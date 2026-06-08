import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/TestingSectionHub.module.css';

const ARTIFACTS = [
  {id: 'strategy', name: 'Тест-стратегия', link: 'Стратегия →'},
  {id: 'plan', name: 'Тест-план', link: 'План →'},
  {id: 'cases', name: 'Тест-кейсы', link: 'Кейсы →'},
  {id: 'log', name: 'Лог прогона', link: 'Лог →'},
  {id: 'bugs', name: 'Баг-репорты', link: 'Jira →'},
  {id: 'report', name: 'Итоговый отчёт', link: 'Отчёт →'},
];

const TECHNIQUES = [
  {name: 'Эквивалентные классы', example: 'Возраст 0–120'},
  {name: 'Граничные значения', example: 'Пароль 5, 6, 20, 21 символов'},
  {name: 'Таблица решений', example: 'Скидка × регион × VIP'},
];

function TestingSectionHubInner() {
  const [activeArtifact, setActiveArtifact] = useState(0);
  const [bugTitle, setBugTitle] = useState('');
  const [bugs, setBugs] = useState([
    {id: 'BUG-101', title: '500 при пустой корзине', severity: 'Critical'},
  ]);

  const addBug = () => {
    if (!bugTitle.trim()) return;
    setBugs((prev) => [
      ...prev,
      {id: `BUG-${100 + prev.length + 1}`, title: bugTitle, severity: 'Major'},
    ]);
    setBugTitle('');
  };

  return (
    <DemoShell>
      <DemoCard
        title="Раздел &quot;Тестирование&quot; — интерактивный хаб"
        subtitle="Цепочка артефактов качества, техники тест-дизайна и мини-трекер дефектов"
      >
        <div className={styles.chain}>
          {ARTIFACTS.map((a, i) => (
            <React.Fragment key={a.id}>
              <button
                type="button"
                className={clsx(styles.art, activeArtifact === i && styles.artActive)}
                onClick={() => setActiveArtifact(i)}
              >
                <strong>{a.name}</strong>
                <span>{a.link}</span>
              </button>
              {i < ARTIFACTS.length - 1 && <span className={styles.arrow}>→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className={styles.hint}>
          Активный артефакт: <strong>{ARTIFACTS[activeArtifact].name}</strong> — прослеживаемость от
          требований до отчёта.
        </p>

        <div className={styles.grid}>
          <div>
            <h4>Техники тест-дизайна</h4>
            <ul className={styles.tech}>
              {TECHNIQUES.map((t) => (
                <li key={t.name}>
                  <strong>{t.name}</strong> — {t.example}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Баг-трекер (демо)</h4>
            <ul className={styles.bugs}>
              {bugs.map((b) => (
                <li key={b.id}>
                  <code>{b.id}</code> {b.title}
                  <span className={styles[b.severity.toLowerCase()]}>{b.severity}</span>
                </li>
              ))}
            </ul>
            <div className={styles.add}>
              <input
                placeholder="Новый дефект…"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
              />
              <button type="button" onClick={addBug}>
                + Bug
              </button>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default TestingSectionHubInner;
