import {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useCopyToClipboard from '@/components/shared/useCopyToClipboard';
import styles from './BlockBuilder.module.css';

type BlockLine = {
  text: string;
  level: number;
  type: 'open' | 'close' | 'instr';
};

const TEMPLATES = {
  ifElse: {
    label: 'if / else',
    lines: ['if (condition) {', '\tinstruction_1;', '} else {', '\tinstruction_2;', '}'],
    levels: [0, 1, 0, 1, 0],
  },
  loop: {
    label: 'Цикл',
    lines: ['while (running) {', '\tinstruction_1;', '\tinstruction_2;', '}'],
    levels: [0, 1, 1, 0],
  },
  func: {
    label: 'Функция',
    lines: ['function task() {', '\tinstruction_1;', '\treturn result;', '}'],
    levels: [0, 1, 1, 0],
  },
} as const;

export default function BlockBuilder() {
  const [blocks, setBlocks] = useState<BlockLine[]>([]);
  const [history, setHistory] = useState<BlockLine[][]>([]);
  const [instrCount, setInstrCount] = useState(0);
  const {copy, isCopied} = useCopyToClipboard();

  const openDepth =
    blocks.filter((b) => b.type === 'open').length - blocks.filter((b) => b.type === 'close').length;

  const pushHistory = useCallback(
    (next: BlockLine[]) => {
      setHistory((h) => [...h.slice(-24), blocks]);
      setBlocks(next);
    },
    [blocks],
  );

  const addInstruction = () => {
    const n = instrCount + 1;
    setInstrCount(n);
    const tabs = '\t'.repeat(openDepth);
    pushHistory([...blocks, {text: `${tabs}instruction_${n};`, level: openDepth, type: 'instr'}]);
  };

  const openBlock = () => {
    const tabs = '\t'.repeat(openDepth);
    pushHistory([...blocks, {text: `${tabs}{`, level: openDepth, type: 'open'}]);
  };

  const closeBlock = () => {
    if (openDepth <= 0) return;
    const tabs = '\t'.repeat(openDepth - 1);
    pushHistory([...blocks, {text: `${tabs}}`, level: openDepth - 1, type: 'close'}]);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBlocks(prev);
  };

  const clearAll = () => {
    setHistory([]);
    setBlocks([]);
    setInstrCount(0);
  };

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setBlocks(
      t.lines.map((text, i) => {
        const trimmed = text.trim();
        const type = trimmed === '{' ? 'open' : trimmed === '}' ? 'close' : 'instr';
        return {text, level: t.levels[i], type};
      }),
    );
    setHistory([]);
    setInstrCount(2);
  };

  const sourceText = blocks.map((b) => b.text).join('\n');

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор блоков"
        subtitle="Соберите вложенную структуру — как блоки кода в программе"
      >
        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={addInstruction}>
            + Строка
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={openBlock}>
            {'{'} Открыть
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={closeBlock}
            disabled={openDepth <= 0}
          >
            {'}'} Закрыть
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={undo}
            disabled={!history.length}
          >
            ↩ Отмена
          </button>
          {blocks.length > 0 && (
            <button type="button" className="it-demo__btn it-demo__btn--danger it-demo__btn--sm" onClick={clearAll}>
              Очистить
            </button>
          )}
          <span className={styles.levelBadge}>Вложенность: {openDepth}</span>
        </div>

        <div className="it-demo__row" style={{marginBottom: '0.75rem'}}>
          {(Object.entries(TEMPLATES) as [keyof typeof TEMPLATES, (typeof TEMPLATES)[keyof typeof TEMPLATES]][]).map(
            ([key, t]) => (
              <button
                key={key}
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                onClick={() => applyTemplate(key)}
              >
                {t.label}
              </button>
            ),
          )}
          {sourceText && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              onClick={() => copy(sourceText, 'src')}
            >
              {isCopied('src') ? '✓ Скопировано' : 'Копировать'}
            </button>
          )}
        </div>

        <div className={styles.editor} aria-label="Редактор блоков">
          {blocks.length === 0 ? (
            <p className={styles.empty}>Добавьте строку, откройте блок или выберите шаблон</p>
          ) : (
            blocks.map((line, i) => (
              <div key={i} className={styles.lineRow}>
                <div className={styles.lineGutter}>
                  {Array.from({length: line.level}).map((_, d) => (
                    <span key={d} className={styles.indentGuide} />
                  ))}
                  <span className={styles.lineNum}>{i + 1}</span>
                </div>
                <span
                  className={clsx(
                    styles.lineContent,
                    line.type === 'open' && styles.braceOpen,
                    line.type === 'close' && styles.braceClose,
                    line.type === 'instr' && styles.instruction,
                  )}
                >
                  {line.text.trim()}
                </span>
              </div>
            ))
          )}
        </div>

        {openDepth > 0 && (
          <p className={styles.tip}>
            Незакрытых блоков: {openDepth}. Добавьте <code>{'}'}</code>, чтобы сбалансировать структуру.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}
