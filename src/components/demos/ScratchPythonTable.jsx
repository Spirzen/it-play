import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  BLOCK_MAPPINGS,
  EXAMPLE_PROGRAMS,
  getBlocksByCategory,
  SCRATCH_CATEGORIES,
} from '@/components/shared/kb/scratchPythonEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/ScratchPythonTable.module.css';

function ScratchPythonTableInner() {
  const [mode, setMode] = useState('table');
  const [category, setCategory] = useState('');
  const [blockId, setBlockId] = useState(BLOCK_MAPPINGS[0].id);
  const [programKey, setProgramKey] = useState('square');
  const {copy, isCopied} = useCopyToClipboard();

  const filteredBlocks = useMemo(() => getBlocksByCategory(category), [category]);
  const activeBlock = useMemo(
    () => BLOCK_MAPPINGS.find((b) => b.id === blockId) ?? BLOCK_MAPPINGS[0],
    [blockId],
  );
  const program = EXAMPLE_PROGRAMS[programKey];

  const selectCategory = (id) => {
    setCategory(id);
    const next = getBlocksByCategory(id);
    if (next.length) setBlockId(next[0].id);
  };

  return (
    <DemoShell className={clsx(shared.root, styles.root)}>
      <DemoCard
        title="Таблица Scratch ↔ Python"
        subtitle="Выберите блок или готовый пример — слева Scratch, справа Python"
      >
        <div className="it-demo__tabs">
          <button
            type="button"
            className={clsx('it-demo__tab', mode === 'table' && 'it-demo__tab--active')}
            onClick={() => setMode('table')}
          >
            По блокам
          </button>
          <button
            type="button"
            className={clsx('it-demo__tab', mode === 'programs' && 'it-demo__tab--active')}
            onClick={() => setMode('programs')}
          >
            Готовые примеры
          </button>
        </div>

        {mode === 'table' && (
          <>
            <div className="it-demo__tabs" style={{marginTop: '0.65rem', flexWrap: 'wrap'}}>
              <button
                type="button"
                className={clsx(
                  'it-demo__tab it-demo__tab--sm',
                  !category && 'it-demo__tab--active',
                )}
                onClick={() => selectCategory('')}
              >
                Все
              </button>
              {SCRATCH_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={clsx(
                    'it-demo__tab it-demo__tab--sm',
                    category === cat.id && 'it-demo__tab--active',
                  )}
                  onClick={() => selectCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={styles.layout}>
              <div className={styles.blockList} role="listbox" aria-label="Блоки Scratch">
                {filteredBlocks.map((block) => (
                  <button
                    key={block.id}
                    type="button"
                    role="option"
                    aria-selected={blockId === block.id}
                    className={clsx(
                      styles.blockBtn,
                      blockId === block.id && styles.blockBtnActive,
                    )}
                    onClick={() => setBlockId(block.id)}
                  >
                    {block.scratch.split('\n')[0]}
                  </button>
                ))}
              </div>

              <div>
                <div className={styles.panels}>
                  <div className={styles.panel}>
                    <div className={clsx(styles.panelHead, styles.panelHeadScratch)}>
                      Scratch 3.0
                    </div>
                    <pre className={styles.panelBody}>{activeBlock.scratch}</pre>
                  </div>
                  <div className={styles.panel}>
                    <div className={clsx(styles.panelHead, styles.panelHeadPython)}>Python 3</div>
                    <pre className={styles.panelBody}>{activeBlock.python}</pre>
                  </div>
                </div>
                {activeBlock.note && (
                  <div className={styles.note}>
                    <strong>Заметка.</strong> {activeBlock.note}
                  </div>
                )}
                <div style={{marginTop: '0.65rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                    onClick={() => copy(activeBlock.python)}
                  >
                    {isCopied ? 'Скопировано' : 'Копировать Python'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {mode === 'programs' && (
          <>
            <div className="it-demo__tabs" style={{marginTop: '0.65rem'}}>
              {Object.values(EXAMPLE_PROGRAMS).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx(
                    'it-demo__tab it-demo__tab--sm',
                    programKey === p.id && 'it-demo__tab--active',
                  )}
                  onClick={() => setProgramKey(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="it-demo__panel" style={{marginTop: '0.75rem'}}>
              <strong>{program.title}</strong>
              <p style={{margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--demo-muted)'}}>
                {program.description}
              </p>
            </div>

            <div className={styles.programLayout}>
              <div className={styles.panel}>
                <div className={clsx(styles.panelHead, styles.panelHeadScratch)}>Scratch</div>
                <pre className={styles.panelBody}>{program.scratch}</pre>
              </div>
              <div className={styles.panel}>
                <div className={clsx(styles.panelHead, styles.panelHeadPython)}>Python</div>
                <pre className={styles.panelBody}>{program.python}</pre>
              </div>
            </div>

            <div className={shared.hint} style={{marginTop: '1rem'}}>
              <strong>Что переносится один в один:</strong>
              <ul>
                {program.hints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              style={{marginTop: '0.65rem'}}
              onClick={() => copy(program.python)}
            >
              {isCopied ? 'Скопировано' : 'Копировать Python-пример'}
            </button>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ScratchPythonTableInner;
