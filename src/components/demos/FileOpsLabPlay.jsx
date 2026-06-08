import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BATCH_OPS,
  DIFF_PAIR,
  FILE_CONTENTS,
  SAMPLE_TREE,
  SEARCH_PRESETS,
  diffLines,
  runSearch,
} from '@/components/shared/kb/fileOpsLabEngine';
import styles from './automationPlays.module.css';

function FileOpsLabPlayInner() {
  const [tab, setTab] = useState('diff');
  const [searchId, setSearchId] = useState('py');
  const [batchId, setBatchId] = useState('clean-tmp');
  const [batchDone, setBatchDone] = useState(false);

  const preset = SEARCH_PRESETS.find((p) => p.id === searchId) ?? SEARCH_PRESETS[0];
  const hits = useMemo(
    () => runSearch(preset.pattern, preset.flags),
    [preset.pattern, preset.flags],
  );

  const leftText = FILE_CONTENTS[DIFF_PAIR.left.key] ?? '';
  const rightText = FILE_CONTENTS[DIFF_PAIR.right.key] ?? '';
  const diff = useMemo(() => diffLines(leftText, rightText), [leftText, rightText]);

  const batch = BATCH_OPS.find((b) => b.id === batchId) ?? BATCH_OPS[0];

  const runBatch = () => {
    setBatchDone(true);
    setTimeout(() => setBatchDone(false), 2200);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Файлы: diff, поиск, пакетные команды"
        subtitle="Три типичных сценария автоматизации работы с файловой системой"
      >
        <div className={styles.tabs} role="tablist">
          {[
            {id: 'diff', label: 'Сравнение'},
            {id: 'search', label: 'Поиск (find/rg)'},
            {id: 'batch', label: 'Пакетно'},
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'diff' && (
          <>
            <p className={styles.human}>
              {DIFF_PAIR.left.label} → {DIFF_PAIR.right.label}. В реальности:{' '}
              <code>diff</code>, <code>meld</code>, <code>git diff</code>.
            </p>
            <div className={styles.split}>
              <pre className={styles.diffPane}>
                {diff.map((row, i) => (
                  <div
                    key={i}
                    className={
                      row.type === 'add'
                        ? styles.lineAdd
                        : row.type === 'del'
                          ? styles.lineDel
                          : styles.lineSame
                    }
                  >
                    {row.type === 'add' ? '+ ' : row.type === 'del' ? '- ' : '  '}
                    {row.text}
                  </div>
                ))}
              </pre>
            </div>
          </>
        )}

        {tab === 'search' && (
          <>
            <div className={styles.batchRow}>
              {SEARCH_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx(styles.tab, searchId === p.id && styles.tabActive)}
                  onClick={() => setSearchId(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <pre className={styles.expr} style={{fontSize: '0.75rem'}}>
              rg {preset.flags ? `-{preset.flags} ` : ''}
              {preset.pattern} project/
            </pre>
            <ul className={styles.fileList}>
              {hits.length === 0 ? (
                <li className={styles.fileItem}>Нет совпадений</li>
              ) : (
                hits.map((f) => (
                  <li key={f.path} className={styles.fileItem}>
                    <span>{f.path}</span>
                    <span>{f.size}</span>
                  </li>
                ))
              )}
            </ul>
            <p className="it-demo__hint">Всего в дереве: {SAMPLE_TREE.filter((f) => f.type === 'file').length} файлов</p>
          </>
        )}

        {tab === 'batch' && (
          <>
            <div className={styles.batchRow}>
              {BATCH_OPS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={clsx(styles.tab, batchId === b.id && styles.tabActive)}
                  onClick={() => setBatchId(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <pre className={styles.expr}>{batch.cmd}</pre>
            <p className={styles.affected}>
              Затронет: {batch.affect.join(', ')}
              {batchDone && ' — выполнено ✓'}
            </p>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runBatch}>
              Запустить (симуляция)
            </button>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default FileOpsLabPlayInner;
