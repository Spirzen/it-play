import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './dataToolsPlays.module.css';

const LEFT_TREE = {
  '/home/user': [
    {name: 'Documents', type: 'dir'},
    {name: 'Downloads', type: 'dir'},
    {name: 'backup.sql', type: 'file', size: '48 MB'},
    {name: 'notes.txt', type: 'file', size: '2 KB'},
  ],
  '/home/user/Documents': [
    {name: '..', type: 'up'},
    {name: 'report.pdf', type: 'file', size: '1.2 MB'},
    {name: 'project', type: 'dir'},
  ],
  '/home/user/Documents/project': [
    {name: '..', type: 'up'},
    {name: 'src', type: 'dir'},
    {name: 'README.md', type: 'file', size: '4 KB'},
  ],
};

const RIGHT_TREE = {
  '/mnt/backup': [
    {name: 'daily', type: 'dir'},
    {name: 'weekly', type: 'dir'},
    {name: 'archive.log', type: 'file', size: '12 KB'},
  ],
  '/mnt/backup/daily': [
    {name: '..', type: 'up'},
    {name: '2026-05-21.tar.gz', type: 'file', size: '120 MB'},
  ],
};

function listFor(path, tree) {
  return tree[path] ?? [{name: '(пусто)', type: 'empty'}];
}

function FileManagerDualPanePlayInner() {
  const [leftPath, setLeftPath] = useState('/home/user/Documents');
  const [rightPath, setRightPath] = useState('/mnt/backup');
  const [selected, setSelected] = useState(null);
  const [log, setLog] = useState([]);

  const leftItems = useMemo(() => listFor(leftPath, LEFT_TREE), [leftPath]);
  const rightItems = useMemo(() => listFor(rightPath, RIGHT_TREE), [rightPath]);

  const pushLog = (msg) => setLog((l) => [msg, ...l].slice(0, 5));

  const openItem = (side, path, item) => {
    if (item.type === 'dir') {
      const next = `${path}/${item.name}`.replace(/\/+/g, '/');
      if (side === 'left') setLeftPath(next);
      else setRightPath(next);
      setSelected(null);
      return;
    }
    if (item.type === 'up') {
      const parts = path.split('/').filter(Boolean);
      parts.pop();
      const next = parts.length ? `/${parts.join('/')}` : '/';
      if (side === 'left') setLeftPath(next);
      else setRightPath(next);
      setSelected(null);
    }
  };

  const copySelection = () => {
    if (!selected) {
      pushLog('Выберите файл на левой панели');
      return;
    }
    pushLog(`F5: копирование ${selected.name} → ${rightPath}`);
  };

  const moveSelection = () => {
    if (!selected) {
      pushLog('Выберите файл на левой панели');
      return;
    }
    pushLog(`F6: перемещение ${selected.name} → ${rightPath}`);
  };

  const renderPane = (side, path, items) => (
    <div className={styles.fmPane}>
      <div className={styles.fmPath}>{path}</div>
      <ul className={styles.fmList}>
        {items.map((item) => (
          <li key={`${path}-${item.name}`}>
            <button
              type="button"
              className={clsx(
                styles.fmRow,
                selected?.side === side &&
                  selected?.path === path &&
                  selected?.name === item.name &&
                  styles.fmRowActive,
              )}
              onClick={() => {
                if (item.type === 'dir' || item.type === 'up') {
                  openItem(side, path, item);
                } else if (item.type === 'file') {
                  setSelected({side, path, name: item.name, size: item.size});
                }
              }}
              onDoubleClick={() => openItem(side, path, item)}
            >
              <span className={styles.fmIcon}>
                {item.type === 'dir' ? '📁' : item.type === 'up' ? '⬆' : '📄'}
              </span>
              <span>{item.name}</span>
              {item.size && <span className={styles.fmSize}>{item.size}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <DemoShell>
      <DemoCard
        title="Двухпанельный файловый менеджер"
        subtitle="Total Commander, Double Commander, Midnight Commander — одна модель: две папки и быстрые F5/F6"
      >
        <div className={styles.fmDual}>
          {renderPane('left', leftPath, leftItems)}
          {renderPane('right', rightPath, rightItems)}
        </div>
        <div className={styles.fmToolbar}>
          <button type="button" className={styles.fmAction} onClick={copySelection}>
            F5 Копировать
          </button>
          <button type="button" className={styles.fmAction} onClick={moveSelection}>
            F6 Переместить
          </button>
          <button
            type="button"
            className={styles.fmAction}
            onClick={() => pushLog('F3: сравнение панелей (mock)')}
          >
            F3 Сравнить
          </button>
        </div>
        <ul className={styles.fmLog}>
          {log.length === 0 ? (
            <li className={styles.fmLogEmpty}>Выберите файл слева и нажмите F5 или F6</li>
          ) : (
            log.map((line, i) => (
              <li key={i}>{line}</li>
            ))
          )}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default FileManagerDualPanePlayInner;
