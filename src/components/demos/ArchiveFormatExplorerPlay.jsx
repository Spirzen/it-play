import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './programPlays.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const SAMPLE_FILES = [
  {id: 'log', name: 'server.log', raw: 120, type: 'text', note: 'Повторяющиеся строки — хорошо сжимается'},
  {id: 'photo', name: 'photo.jpg', raw: 2400, type: 'compressed', note: 'JPEG уже сжат — архив почти не уменьшит'},
  {id: 'dump', name: 'backup.sql', raw: 48, type: 'text', note: 'Текст SQL — Deflate/LZMA дают 70–90%'},
  {id: 'encrypted', name: 'vault.bin', raw: 512, type: 'random', note: 'Высокая энтропия — размер может вырасти'},
];

const FORMATS = [
  {id: 'zip', label: 'ZIP', algo: 'Deflate (LZ77 + Huffman)', ratio: 0.35, note: 'Универсальный, встроен в ОС'},
  {id: 'tar', label: 'TAR', algo: 'Только объединение', ratio: 1, note: 'Часто + gzip → .tar.gz'},
  {id: '7z', label: '7z', algo: 'LZMA2 (сквозное)', ratio: 0.22, note: 'Максимальное сжатие, нужен 7-Zip'},
];

function estimateSize(file, format) {
  const base = file.raw;
  if (format.id === 'tar') return base;
  if (file.type === 'random') return base + 12;
  if (file.type === 'compressed') return Math.round(base * 0.98);
  return Math.max(4, Math.round(base * format.ratio));
}

function ArchiveFormatExplorerPlayInner() {
  const [fileId, setFileId] = useState('log');
  const [formatId, setFormatId] = useState('zip');
  const [packed, setPacked] = useState(false);

  const file = SAMPLE_FILES.find((f) => f.id === fileId) ?? SAMPLE_FILES[0];
  const format = FORMATS.find((f) => f.id === formatId) ?? FORMATS[0];
  const archiveSize = useMemo(() => estimateSize(file, format), [file, format]);
  const pct = Math.min(100, Math.round((archiveSize / file.raw) * 100));

  const pack = () => setPacked(true);
  const unpack = () => setPacked(false);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архив: упаковка и форматы"
        subtitle="Архив объединяет файлы и (опционально) сжимает. Не всякий файл становится меньше."
      >
        <div className={styles.formatGrid}>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(styles.formatBtn, formatId === f.id && styles.formatBtnActive)}
              onClick={() => {
                setFormatId(f.id);
                setPacked(false);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.archiveLayout}>
          <div className={styles.filePick}>
            <span className="it-demo__label">Исходные файлы</span>
            {SAMPLE_FILES.map((f) => (
              <div
                key={f.id}
                role="button"
                tabIndex={0}
                className={clsx(styles.fileRow, fileId === f.id && styles.fileRowSelected)}
                onClick={() => {
                  setFileId(f.id);
                  setPacked(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && setFileId(f.id)}
              >
                <span>📄 {f.name}</span>
                <span className={styles.mono}>{f.raw} KB</span>
              </div>
            ))}
            <div className={toolStyles.chips} style={{marginTop: '0.5rem'}}>
              <button type="button" className={toolStyles.chip} onClick={pack}>
                📦 Упаковать
              </button>
              <button type="button" className={toolStyles.chip} onClick={unpack}>
                📂 Распаковать
              </button>
            </div>
          </div>

          <div>
            <span className="it-demo__label">
              {packed ? `Архив backup.${format.id}` : 'Структура контейнера'}
            </span>
            {packed ? (
              <>
                <p style={{margin: '0.35rem 0', fontSize: '0.82rem'}}>
                  {file.raw} KB → <strong>{archiveSize} KB</strong> ({pct}% от исходного)
                </p>
                <div className={styles.ratioBar}>
                  <div className={styles.ratioFill} style={{width: `${pct}%`}} />
                </div>
                <p className={styles.hint}>{file.note}</p>
                <p className={styles.mono} style={{fontSize: '0.72rem'}}>
                  Алгоритм: {format.algo}
                </p>
              </>
            ) : (
              <div className={styles.zipTree}>
                backup.{format.id}
                <br />
                ├─ [заголовок / TOC]
                <br />
                ├─ {file.name} ({file.raw} KB)
                <br />
                └─ [CRC32 / метаданные]
              </div>
            )}
            <p className={styles.hint} style={{marginTop: '0.5rem', marginBottom: 0}}>
              {format.note}. Установочные пакеты (MSI, DEB) — архив + скрипты и метаданные для менеджера пакетов.
            </p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ArchiveFormatExplorerPlayInner;
