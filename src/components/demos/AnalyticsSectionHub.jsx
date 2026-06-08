import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AnalyticsSectionHub.module.css';

const PIPELINE = [
  {id: 'discover', name: 'Discovery', hint: 'Интервью, as-is'},
  {id: 'model', name: 'Модели', hint: 'BPMN, ERD, API'},
  {id: 'spec', name: 'Спецификация', hint: 'ТЗ, stories, AC'},
  {id: 'align', name: 'Согласование', hint: 'Стейкхолдеры'},
  {id: 'deliver', name: 'Передача', hint: 'Jira, refinement'},
  {id: 'verify', name: 'Приёмка', hint: 'Тесты, UAT'},
];

const ROLES = {
  ba: {
    label: 'Бизнес-аналитик',
    path: [
      '1 → История и контекст роли',
      '111 → Основы анализа требований',
      '113 → Роль BA в проекте',
      '116 → Управление требованиями',
      '124 → 129 → 130 → BPMN, справочник, движки',
      '117–122 → Документация (по типу проекта)',
    ],
    tips: [
      'Сначала "зачем", потом "что" — не записывайте кнопки с первого созвона',
      'Фиксируйте глоссарий: один термин — одно значение для всей команды',
      'Любое изменение scope — через оценку влияния и согласование',
    ],
  },
  sa: {
    label: 'Системный аналитик',
    path: [
      '111–112 → База и профессиональная практика',
      '114 → Роль SA',
      '115 → Исследование системы',
      '123 → Артефакты (use case, API, ERD)',
      '128 → Технический дизайн',
      '126 → Инструменты моделирования',
    ],
    tips: [
      'Sequence diagram + OpenAPI часто понятнее разработчикам, чем простыня текста',
      'NFR формулируйте измеримо: не "быстро", а перцентиль отклика',
      'Трассировка: требование → задача → тест → релиз',
    ],
  },
  product: {
    label: 'Продуктовый аналитик',
    path: [
      '1123 → Метрики и цикл гипотез',
      '1121 → Бизнес-цель → метрики',
      '1122 → SQL для выборок',
      '125 → Прототипы и сценарии',
      '127 → Работа с командой и PO',
    ],
    tips: [
      'Событие в продукте = глагол + объект ("order_completed")',
      'Одна гипотеза — одна метрика успеха на эксперимент',
      'Смотрите когорты, а не только "среднее по больнице"',
    ],
  },
  data: {
    label: 'Данные и метрики',
    path: [
      '1121 → Постановка задач на данные',
      '1122 → SQL',
      'Раздел 3.11 → Анализ данных (углубление)',
      '116 → Требования к отчётам и витринам',
    ],
    tips: [
      'Словарь метрик обязателен: что считается "активным пользователем"',
      'Проверяйте качество данных до построения дашборда',
      'Отделяйте витрину для BI от операционной OLTP-схемы',
    ],
  },
};

function AnalyticsSectionHubInner() {
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState('ba');

  const r = ROLES[role];

  return (
    <DemoShell>
      <DemoCard
        title="Раздел &quot;Аналитика&quot; — навигатор"
        subtitle="Цепочка работы аналитика, треки по ролям и короткие подсказки"
      >
        <div className={styles.roles}>
          {Object.entries(ROLES).map(([key, {label}]) => (
            <button
              key={key}
              type="button"
              className={clsx(styles.roleBtn, role === key && styles.roleActive)}
              onClick={() => setRole(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.chain}>
          {PIPELINE.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                className={clsx(styles.step, activeStep === i && styles.stepActive)}
                onClick={() => setActiveStep(i)}
              >
                <strong>{s.name}</strong>
                <span>{s.hint}</span>
              </button>
              {i < PIPELINE.length - 1 && <span className={styles.arrow}>→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className={styles.hint}>
          Сейчас в фокусе этап <strong>{PIPELINE[activeStep].name}</strong> — {PIPELINE[activeStep].hint}.
          Полный цикл повторяется на каждой фиче или релизе.
        </p>

        <div className={styles.grid}>
          <div>
            <h4>Маршрут: {r.label}</h4>
            <ul className={styles.path}>
              {r.path.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Практические напоминания</h4>
            <ul className={styles.tips}>
              {r.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default AnalyticsSectionHubInner;
