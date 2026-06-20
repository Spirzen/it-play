import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/RagPipelinePlay.module.css';

const DOCS = [
  {id: 'd1', title: 'Политика отпусков', text: 'Сотрудник имеет право на 28 календарных дней отпуска в год.'},
  {id: 'd2', title: 'IT-безопасность', text: 'Пароли хранятся только в хешированном виде. MFA обязателен для VPN.'},
  {id: 'd3', title: 'Офис', text: 'Гибридный график: 3 дня в офисе, 2 дня удалённо.'},
  {id: 'd4', title: 'Зарплата', text: 'Выплата аванса 25-го числа, основная часть — 10-го.'},
];

const QUERIES = [
  {q: 'Сколько дней отпуска положено?', hits: ['d1'], answer: '28 календарных дней в год.'},
  {q: 'Когда платят зарплату?', hits: ['d4'], answer: 'Аванс 25-го, основная часть 10-го.'},
  {q: 'Нужен ли MFA?', hits: ['d2'], answer: 'Да, MFA обязателен для VPN.'},
  {q: 'Можно ли работать только из дома?', hits: ['d3'], answer: 'Нет — нужно 3 дня в офисе.'},
];

const STAGES = ['Запрос', 'Retriever', 'Промпт + чанки', 'Ответ LLM'];

function RagPipelinePlayInner() {
  const [qi, setQi] = useState(0);
  const [stage, setStage] = useState(0);
  const query = QUERIES[qi];

  const run = () => {
    if (stage < 3) setStage((s) => s + 1);
    else {
      setStage(0);
      setQi((i) => (i + 1) % QUERIES.length);
    }
  };

  return (
    <DemoShell className={shared.rootWide}>
      <DemoCard title="RAG-пайплайн" subtitle="Поиск чанков → промпт → ответ с проверкой faithfulness">
        <p className={styles.query}>&laquo;{query.q}&raquo;</p>

        <div className={shared.stepRow}>
          {STAGES.map((s, i) => (
            <div key={s} className={clsx(shared.stepPill, i <= stage && shared.stepPillOn)}>
              <span className={shared.stepNum}>{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {stage >= 1 && (
          <div className={clsx(shared.scrollArea, styles.chunks)}>
            {DOCS.map((d) => (
              <div key={d.id} className={clsx(styles.chunk, query.hits.includes(d.id) && styles.chunkHit)}>
                <strong>{d.title}</strong>
                <p>{d.text}</p>
              </div>
            ))}
          </div>
        )}

        {stage >= 3 && (
          <div className={shared.panelAccent}>
            <p className={styles.answer}>{query.answer}</p>
            <span className={shared.badgeSuccess}>faithful — из чанка</span>
          </div>
        )}

        <div className={shared.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={run}>
            {stage < 3 ? 'Далее' : 'Следующий запрос'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setStage(0)}>
            С начала
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default RagPipelinePlayInner;
