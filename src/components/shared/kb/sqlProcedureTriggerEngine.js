/** Учебная модель процедуры и триггера */

export const INITIAL_EMPLOYEES = [
  {id: 101, name: 'Анна К.', salary: 85000, department_id: 10},
  {id: 102, name: 'Борис М.', salary: 72000, department_id: 10},
  {id: 103, name: 'Вера С.', salary: 91000, department_id: 20},
];

export const PROCEDURE_STEPS = [
  {label: 'CALL UpdateSalary(102, 5000, @new_salary)', detail: 'Вход: emp_id=102, increase=5000'},
  {label: 'UPDATE employees SET salary = salary + 5000', detail: 'Модификация на сервере БД'},
  {label: 'SELECT salary INTO @new_salary', detail: 'OUT-параметр: новое значение зарплаты'},
  {label: 'RETURN к клиенту', detail: 'Приложение получает @new_salary без прямого доступа к таблице'},
];

export function runProcedure(employees, empId, increase) {
  const row = employees.find((e) => e.id === empId);
  if (!row) return {employees, newSalary: null, error: 'Сотрудник не найден'};
  const next = employees.map((e) =>
    e.id === empId ? {...e, salary: e.salary + increase} : e,
  );
  const updated = next.find((e) => e.id === empId);
  return {employees: next, newSalary: updated.salary, error: null};
}

export function runTriggerUpdate(employees, empId, newSalary, auditLog) {
  const old = employees.find((e) => e.id === empId);
  if (!old) return {employees, auditLog, blocked: true};
  const entry = {
    id: auditLog.length + 1,
    user_id: empId,
    action: 'update',
    old_salary: old.salary,
    new_salary: newSalary,
    time: new Date().toLocaleTimeString('ru-RU'),
  };
  const next = employees.map((e) => (e.id === empId ? {...e, salary: newSalary} : e));
  return {employees: next, auditLog: [...auditLog, entry], blocked: false};
}
