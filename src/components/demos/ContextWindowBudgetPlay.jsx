import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/ContextWindowBudgetPlay.module.css';

const LIMITS = [
  {id: '8k', label: '8K', tokens: 8192},
  {id: '32k', label: '32K', tokens: 32768},
  {id: '128k', label: '128K', tokens: 128000},
];

const BLOCKS = [
  {id: 'system', label: 'System prompt', tokens: 420, hue: 250},
  {id: 'history', label: 'История чата', tokens: 1800, hue: 170},
  {id: 'rag', label: 'RAG-чанки', tokens: 2400, hue: 35},
  {id: 'tools', label: 'Описание tools', tokens: 650, hue: 290},
  {id: 'user', label: 'Запрос пользователя', tokens: 320, hue: 210},
  {id: 'reserve', label: 'Резерв на ответ', tokens: 1200, hue: 130},
];

function estimateUsed(enabled) {
  return BLOCKS.reduce((sum, b) => sum + (enabled[b.id] ? b.tokens : 0), 0);
}

function ContextWindowBudgetPlayInner() {
  const [limitId, setLimitId] = useState('32k');
  const [enabled, setEnabled] = useState({
    system: true,
    history: true,
    rag: true,
    tools: false,
    user: true,
    reserve: true,
  });

  const limit = LIMITS.find((l) => l.id === limitId) ?? LIMITS[1];
  const used = useMemo(() => estimateUsed(enabled), [enabled]);
  const pct = Math.min(100, (used / limit.tokens) * 100);
  const overflow = used > limit.tokens;

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Бюджет контекстного окна" subtitle="Включайте блоки — смотрите, как заполняется лимит токенов">
        <div className={shared.stack}>
          <div>
            <p className={shared.sectionTitle}>Размер окна</p>
            <div className={shared.chipRow}>
              {LIMITS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={clsx(shared.chip, limitId === l.id && shared.chipActive)}
                  onClick={() => setLimitId(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.meterBlock}>
            <div className={shared.meter}>
              <div
                className={clsx(
                  shared.meterFill,
                  !overflow && pct > 85 && shared.meterFillWarn,
                  overflow && shared.meterFillError,
                )}
                style={{width: `${Math.min(100, pct)}%`}}
              />
            </div>
            <p className={shared.meterLabel}>
              {used.toLocaleString('ru-RU')} / {limit.tokens.toLocaleString('ru-RU')} токенов · {pct.toFixed(0)}%
            </p>
          </div>

          <div>
            <p className={shared.sectionTitle}>Состав контекста</p>
            <div className={styles.blocks}>
              {BLOCKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={clsx(styles.block, enabled[b.id] && styles.blockOn)}
                  style={{'--block-hue': b.hue}}
                  onClick={() => setEnabled((s) => ({...s, [b.id]: !s[b.id]}))}
                  aria-pressed={enabled[b.id]}
                >
                  <span className={styles.blockLabel}>{b.label}</span>
                  <span className={styles.blockTokens}>{b.tokens.toLocaleString('ru-RU')} tok</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className={shared.hint}>
          {overflow
            ? 'Переполнение: история или RAG-чанки обрежутся до лимита окна.'
            : pct > 85
              ? 'Окно почти заполнено — длинный ответ может вытеснить старые сообщения.'
              : 'Клик по карточке включает или выключает блок. System и user обычно обязательны.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ContextWindowBudgetPlayInner;
