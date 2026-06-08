import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/PromptPipelineDemo.module.css';

const STAGES = [
  {id: 'prompt', title: 'Запрос пользователя', body: '"Объясни bubble sort простыми словами"'},
  {id: 'context', title: 'Контекст (RAG / system)', body: 'Статья из базы знаний + роль: "ты преподаватель IT"'},
  {id: 'model', title: 'Модель', body: 'Токенизация → attention → генерация токенов'},
  {id: 'response', title: 'Ответ', body: '"Bubble sort сравнивает соседей и меняет местами…"'},
];

function PromptPipelineDemoInner() {
  const [stage, setStage] = useState(0);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Pipeline LLM-запроса" subtitle="Кликайте &quot;Далее&quot; — пройдите путь от prompt до ответа">
        <div className={styles.pipeline}>
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className={clsx(styles.stage, i <= stage && styles.stageDone, i === stage && styles.stageActive)}
            >
              <span className={styles.num}>{i + 1}</span>
              <div>
                <strong>{s.title}</strong>
                {i <= stage && <p className={styles.body}>{s.body}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setStage((s) => Math.min(STAGES.length - 1, s + 1))}
            disabled={stage >= STAGES.length - 1}
          >
            Далее
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setStage(0)}>
            С начала
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default PromptPipelineDemoInner;
