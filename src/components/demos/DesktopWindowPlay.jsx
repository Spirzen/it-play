import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/DesktopWindowPlay.module.css';

const MENUS = ['Файл', 'Правка', 'Вид', 'Справка'];

function DesktopWindowPlayInner() {
  const [log, setLog] = useState([]);
  const [minimized, setMinimized] = useState(false);

  const emit = (msg) => setLog((l) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...l].slice(0, 6));

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Окно ОС (mock)" subtitle="Titlebar, меню и client area — события в журнале">
        <div className={clsx(styles.window, minimized && styles.windowMin)}>
          <div
            className={styles.titlebar}
            onDoubleClick={() => {
              setMinimized((m) => !m);
              emit(minimized ? 'Развернуть' : 'Свернуть');
            }}
          >
            <span className={styles.title}>Блокнот — demo.txt</span>
            <div className={styles.buttons}>
              <button type="button" aria-label="Свернуть" onClick={() => { setMinimized(true); emit('Свернуть'); }}>—</button>
              <button type="button" aria-label="Закрыть" onClick={() => emit('Закрыть (WM_CLOSE)')}>×</button>
            </div>
          </div>
          {!minimized && (
            <>
              <ul className={styles.menu}>
                {MENUS.map((m) => (
                  <li key={m}>
                    <button type="button" onClick={() => emit(`Меню: ${m}`)}>
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.client} onClick={() => emit('Клик в client area')}>
                <p>Client area — область приложения</p>
              </div>
            </>
          )}
        </div>
        <ul className={styles.log}>
          {log.length === 0 ? <li className={styles.logEmpty}>Журнал событий пуст</li> : log.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default DesktopWindowPlayInner;
