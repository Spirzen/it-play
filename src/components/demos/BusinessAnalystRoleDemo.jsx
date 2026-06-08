import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/BusinessAnalystRoleDemo.module.css';

const PHASES = [
  {id: 'discover', label: 'Исследование', tasks: ['Интервью', 'Анализ AS-IS', 'Pain points']},
  {id: 'define', label: 'Формулировка', tasks: ['Потребность vs решение', 'Scope', 'Гипотезы']},
  {id: 'deliver', label: 'Передача', tasks: ['User stories', 'BRD', 'Приоритизация MoSCoW']},
];

const STAKEHOLDERS = [
  {name: 'Владелец продукта', power: 90, interest: 95},
  {name: 'Операции', power: 60, interest: 80},
  {name: 'Разработка', power: 70, interest: 55},
  {name: 'Регулятор', power: 85, interest: 40},
];

function BusinessAnalystRoleDemoInner() {
  const [phase, setPhase] = useState('discover');
  const [need, setNeed] = useState('Быстро получать отчёты для руководства');
  const [solution, setSolution] = useState('Кнопка экспорта в Excel');
  const [reframed, setReframed] = useState('');

  const current = PHASES.find((p) => p.id === phase);

  const reframe = () => {
    setReframed(
      `Потребность: ${need}\nРешение заказчика: ${solution}\n\nФормулировка BA: "Система должна предоставлять отчёт в согласованном формате (PDF/XLSX) за ≤ 30 сек без ручной выгрузки из БД".`,
    );
  };

  return (
    <DemoShell>
      <DemoCard
        title="Роль бизнес-аналитика — практикум"
        subtitle="Жизненный цикл работы BA, матрица стейкхолдеров и перевод потребности в требование"
      >
        <div className={styles.phases}>
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.phase, phase === p.id && styles.phaseActive)}
              onClick={() => setPhase(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <ul className={styles.tasks}>
          {current.tasks.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h4>Матрица стейкхолдеров</h4>
            <div className={styles.matrix}>
              <span className={styles.axisY}>Влияние ↑</span>
              {STAKEHOLDERS.map((s) => (
                <div
                  key={s.name}
                  className={styles.dot}
                  style={{
                    left: `${s.interest}%`,
                    bottom: `${s.power}%`,
                  }}
                  title={`${s.name}: влияние ${s.power}%, интерес ${s.interest}%`}
                >
                  {s.name.split(' ')[0]}
                </div>
              ))}
              <span className={styles.axisX}>Интерес →</span>
            </div>
          </div>

          <div className={styles.card}>
            <h4>Потребность → требование</h4>
            <label>
              Потребность
              <textarea rows={2} value={need} onChange={(e) => setNeed(e.target.value)} />
            </label>
            <label>
              Как сформулировал заказчик (решение)
              <textarea rows={2} value={solution} onChange={(e) => setSolution(e.target.value)} />
            </label>
            <button type="button" className={styles.btn} onClick={reframe}>
              Переформулировать
            </button>
            {reframed && <pre className={styles.out}>{reframed}</pre>}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default BusinessAnalystRoleDemoInner;
