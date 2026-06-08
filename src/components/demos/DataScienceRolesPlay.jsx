import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const ROLES = [
  {
    id: 'scientist',
    label: 'Data Scientist',
    tasks: ['Гипотезы и модели ML', 'Статистическая оценка', 'Интерпретация для бизнеса'],
  },
  {
    id: 'engineer',
    label: 'Data Engineer',
    tasks: ['Пайплайны ETL/ELT', 'Интеграция источников', 'Качество и SLA данных'],
  },
  {
    id: 'architect',
    label: 'Data Architect',
    tasks: ['Модель данных организации', 'Lake / DWH / lakehouse', 'Метаданные и compliance'],
  },
  {
    id: 'analyst',
    label: 'Data Analyst',
    tasks: ['KPI и дашборды', 'EDA и отчёты', 'BI-инструменты'],
  },
  {
    id: 'ml',
    label: 'ML Engineer',
    tasks: ['Деплой моделей', 'MLOps и мониторинг drift', 'Масштабирование инференса'],
  },
  {
    id: 'bi',
    label: 'BI-специалист',
    tasks: ['Семантический слой', 'Кубы и меры', 'Self-service отчёты'],
  },
];

function DataScienceRolesPlayInner() {
  const [roleId, setRoleId] = useState('scientist');
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];

  return (
    <DemoShell>
      <DemoCard
        title="Роли в экосистеме данных"
        subtitle="Кто за что отвечает в типичной data-команде"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem', flexWrap: 'wrap'}}>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(toolStyles.chip, roleId === r.id && toolStyles.chipActive)}
              onClick={() => setRoleId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <ul style={{margin: 0, paddingLeft: '1.15rem', fontSize: '0.88rem', lineHeight: 1.5}}>
          {role.tasks.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default DataScienceRolesPlayInner;
