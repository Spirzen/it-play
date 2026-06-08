import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/ArchiveUtilitySimulator.module.css';

const INITIAL_FILES = [
  {name: 'report.docx', size: '48 KB', inArchive: false},
  {name: 'data.csv', size: '12 KB', inArchive: false},
  {name: 'screenshots/', size: '4.2 MB', inArchive: false},
];

export function ArchiveUtilitySimulatorInner({compact}) {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [archiveName, setArchiveName] = useState('backup.zip');
  const [log, setLog] = useState(['Готов к упаковке файлов.']);

  const packed = files.filter((f) => f.inArchive);
  const totalSize = packed.length ? `${(packed.length * 1.2).toFixed(1)} MB (оценка)` : '0';

  const pack = () => {
    setFiles((prev) => prev.map((f) => ({...f, inArchive: true})));
    setLog((prev) => [...prev, `Создан архив ${archiveName}: ${files.length} объектов.`]);
  };

  const extract = () => {
    setFiles((prev) => prev.map((f) => ({...f, inArchive: false})));
    setLog((prev) => [...prev, `Распакован ${archiveName} в текущую папку.`]);
  };

  const chrome = (
    <DesktopAppChrome
      title="7-Zip / WinRAR (симулятор)"
      accent="#6d4c41"
      toolbar={
        <>
          <button type="button" onClick={pack}>
            📦 Добавить в архив
          </button>
          <button type="button" onClick={extract}>
            📂 Извлечь всё
          </button>
          <input
            className={styles.nameInput}
            value={archiveName}
            onChange={(e) => setArchiveName(e.target.value)}
          />
        </>
      }
      status={<>В архиве: {packed.length} · Размер: {totalSize}</>}
    >
      <div className={styles.layout}>
        <ul className={styles.files}>
          {files.map((f) => (
            <li key={f.name} className={clsx(f.inArchive && styles.inZip)}>
              <span>{f.name}</span>
              <span>{f.size}</span>
              {f.inArchive && <em>в {archiveName}</em>}
            </li>
          ))}
        </ul>
        <pre className={styles.log}>{log.join('\n')}</pre>
      </div>
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор архиватора"
        subtitle="ZIP/RAR: упаковка, распаковка и журнал операций"
      >
        {chrome}
        <p className={styles.hint}>
          Архиватор сжимает данные алгоритмами (Deflate, LZMA); формат ZIP чаще всего используют для
          обмена файлами.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ArchiveUtilitySimulatorInner;
