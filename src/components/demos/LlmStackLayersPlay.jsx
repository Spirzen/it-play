import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/LlmStackLayersPlay.module.css';

const LAYERS = [
  {id: 7, name: 'Прикладение', desc: 'Чат, RAG-поиск, автоматизация', checks: ['UX', 'HITL', 'Политики']},
  {id: 6, name: 'Интеграция', desc: 'API, SSO, коннекторы', checks: ['Auth', 'Rate limits', 'MCP']},
  {id: 5, name: 'Инференс', desc: 'Стриминг, кэш, лимиты', checks: ['Temperature', 'Квоты', 'Fallback']},
  {id: 4, name: 'Оркестрация', desc: 'Промпты, RAG, агенты', checks: ['System prompt', 'Retriever', 'Tools']},
  {id: 3, name: 'Модель', desc: 'Выбор, fine-tuning', checks: ['Версия', 'Eval', 'Red team']},
  {id: 2, name: 'Данные', desc: 'Очистка, чанки, эмбеддинги', checks: ['Качество', 'PII', 'Индекс']},
  {id: 1, name: 'Источники', desc: 'Документы, логи, API', checks: ['Лицензии', 'Актуальность', 'Доступ']},
];

function LlmStackLayersPlayInner() {
  const [active, setActive] = useState(4);
  const [filled, setFilled] = useState({});

  const layer = LAYERS.find((l) => l.id === active) ?? LAYERS[0];
  const coverage = LAYERS.filter((l) => l.checks.every((c) => filled[`${l.id}-${c}`])).length;

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="7 слоёв LLM-стека" subtitle="Чеклист зрелости — клик по слою и отметкам">
        <div className={shared.statGrid}>
          <div className={shared.statBox}>
            <span className={shared.statValue}>{coverage}/7</span>
            <span className={shared.statLabel}>слоёв закрыто</span>
          </div>
        </div>

        <div className={styles.stack}>
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.layer, active === l.id && styles.layerActive)}
              onClick={() => setActive(l.id)}
            >
              <span className={styles.layerId}>L{l.id}</span>
              <span className={styles.layerName}>{l.name}</span>
            </button>
          ))}
        </div>

        <div className={shared.panel}>
          <p className={styles.desc}>{layer.desc}</p>
          <div className={shared.chipRow}>
            {layer.checks.map((c) => (
              <button
                key={c}
                type="button"
                className={clsx(shared.chip, filled[`${active}-${c}`] && shared.chipActive)}
                onClick={() => setFilled((s) => ({...s, [`${active}-${c}`]: !s[`${active}-${c}`]}))}
              >
                {filled[`${active}-${c}`] ? '✓ ' : ''}{c}
              </button>
            ))}
          </div>
        </div>

        <p className={shared.hint}>Частая ошибка — сильный L7 (чат) при пустом L2 (качество данных).</p>
      </DemoCard>
    </DemoShell>
  );
}

export default LlmStackLayersPlayInner;
