/** Данные и вычисление цепочки CTE для учебного демо */

export const EMPLOYEES = [
  {employee_id: 1, employee_name: 'Анна', department_id: 10, salary: 95000, status: 'active'},
  {employee_id: 2, employee_name: 'Борис', department_id: 10, salary: 82000, status: 'active'},
  {employee_id: 3, employee_name: 'Вера', department_id: 20, salary: 71000, status: 'active'},
  {employee_id: 4, employee_name: 'Глеб', department_id: 20, salary: 68000, status: 'active'},
  {employee_id: 5, employee_name: 'Дина', department_id: 30, salary: 105000, status: 'active'},
  {employee_id: 6, employee_name: 'Егор', department_id: 10, salary: 54000, status: 'inactive'},
  {employee_id: 7, employee_name: 'Жанна', department_id: 30, salary: 88000, status: 'active'},
];

export const DEPARTMENTS = [
  {department_id: 10, department_name: 'Разработка', manager_id: 1},
  {department_id: 20, department_name: 'Аналитика', manager_id: 3},
  {department_id: 30, department_name: 'Продажи', manager_id: 5},
];

export const DEPT_TREE = [
  {department_id: 1, department_name: 'Компания', parent_department_id: null},
  {department_id: 10, department_name: 'Разработка', parent_department_id: 1},
  {department_id: 11, department_name: 'Backend', parent_department_id: 10},
  {department_id: 12, department_name: 'Frontend', parent_department_id: 10},
  {department_id: 20, department_name: 'Аналитика', parent_department_id: 1},
  {department_id: 30, department_name: 'Продажи', parent_department_id: 1},
];

export const CTE_CHAIN = [
  {
    id: 'base',
    name: 'базовые_данные',
    sql: `WITH базовые_данные AS (
  SELECT employee_id, employee_name, department_id, salary
  FROM employees WHERE status = 'active'
)`,
    describe: 'Фильтр активных сотрудников',
  },
  {
    id: 'dept',
    name: 'данные_отделов',
    sql: `, данные_отделов AS (
  SELECT d.department_id, d.department_name,
         COUNT(b.employee_id) AS employee_count
  FROM departments d
  LEFT JOIN базовые_данные b ON d.department_id = b.department_id
  GROUP BY d.department_id, d.department_name
)`,
    describe: 'JOIN + GROUP BY по отделам',
  },
  {
    id: 'salary',
    name: 'расчеты_зарплат',
    sql: `, расчеты_зарплат AS (
  SELECT b.*, AVG(b.salary) OVER (PARTITION BY b.department_id) AS avg_dept_salary,
         b.salary - AVG(b.salary) OVER (PARTITION BY b.department_id) AS diff_from_avg
  FROM базовые_данные b
)`,
    describe: 'Оконные функции по отделу',
  },
  {
    id: 'final',
    name: 'SELECT',
    sql: `SELECT r.employee_name, d.department_name, r.salary,
       r.avg_dept_salary, r.diff_from_avg
FROM расчеты_зарплат r
JOIN данные_отделов d ON r.department_id = d.department_id
ORDER BY r.diff_from_avg DESC`,
    describe: 'Финальный результат',
  },
];

function avg(nums) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export function computeCteStep(stepId) {
  const base = EMPLOYEES.filter((e) => e.status === 'active');
  if (stepId === 'base') {
    return {rows: base, columns: ['employee_id', 'employee_name', 'department_id', 'salary']};
  }

  const deptRows = DEPARTMENTS.map((d) => {
    const emps = base.filter((e) => e.department_id === d.department_id);
    return {
      department_id: d.department_id,
      department_name: d.department_name,
      employee_count: emps.length,
    };
  });
  if (stepId === 'dept') {
    return {rows: deptRows, columns: ['department_id', 'department_name', 'employee_count']};
  }

  const salaryRows = base.map((e) => {
    const deptSalaries = base.filter((x) => x.department_id === e.department_id).map((x) => x.salary);
    const avgDept = avg(deptSalaries);
    return {
      ...e,
      avg_dept_salary: Math.round(avgDept),
      diff_from_avg: e.salary - Math.round(avgDept),
    };
  });
  if (stepId === 'salary') {
    return {
      rows: salaryRows,
      columns: ['employee_name', 'department_id', 'salary', 'avg_dept_salary', 'diff_from_avg'],
    };
  }

  const final = salaryRows
    .map((r) => {
      const d = DEPARTMENTS.find((x) => x.department_id === r.department_id);
      return {
        employee_name: r.employee_name,
        department_name: d?.department_name ?? '—',
        salary: r.salary,
        avg_dept_salary: r.avg_dept_salary,
        diff_from_avg: r.diff_from_avg,
      };
    })
    .sort((a, b) => b.diff_from_avg - a.diff_from_avg);

  return {
    rows: final,
    columns: ['employee_name', 'department_name', 'salary', 'avg_dept_salary', 'diff_from_avg'],
  };
}

/** Рекурсивный обход дерева отделов */
export function buildRecursiveTree() {
  const roots = DEPT_TREE.filter((d) => d.parent_department_id == null);
  const result = [];

  function walk(parentId, path, level) {
    const children = DEPT_TREE.filter((d) => d.parent_department_id === parentId);
    for (const c of children) {
      const fullPath = path ? `${path} → ${c.department_name}` : c.department_name;
      result.push({
        department_id: c.department_id,
        department_name: c.department_name,
        full_path: fullPath,
        level,
        indent: '  '.repeat(level),
      });
      walk(c.department_id, fullPath, level + 1);
    }
  }

  for (const r of roots) {
    result.push({
      department_id: r.department_id,
      department_name: r.department_name,
      full_path: r.department_name,
      level: 0,
      indent: '',
    });
    walk(r.department_id, r.department_name, 1);
  }
  return result;
}
