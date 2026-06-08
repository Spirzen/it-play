import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BIOS_STATE,
  DEFAULT_SYSTEM,
  POST_SCRIPT,
  SETUP_TABS,
  createDefaultSetupValues,
  getSetupRows,
  toggleBoolValue,
} from '@/components/shared/kb/biosEngine';
import styles from '@/components/demos/BIOSemulator.module.css';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function PostLine({line}) {
  return (
    <div
      className={clsx(
        styles.postLine,
        line.tone === 'ok' && styles.postOk,
        line.tone === 'warn' && styles.postWarn,
        line.tone === 'hint' && styles.postHint,
      )}
    >
      {line.text}
    </div>
  );
}

function BIOSemulatorInner() {
  const system = DEFAULT_SYSTEM;
  const [state, setState] = useState(BIOS_STATE.OFF);
  const [postLines, setPostLines] = useState([]);
  const [memoryPct, setMemoryPct] = useState(0);
  const [memoryTesting, setMemoryTesting] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [setupTab, setSetupTab] = useState(0);
  const [setupRow, setSetupRow] = useState(0);
  const [setupValues, setSetupValues] = useState(() => createDefaultSetupValues(system));
  const [popup, setPopup] = useState(null);
  const [osProgress, setOsProgress] = useState(0);
  const [toast, setToast] = useState('');
  const postAbort = useRef(false);

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);

  const runPost = useCallback(async () => {
    postAbort.current = false;
    setState(BIOS_STATE.POST);
    setPostLines([]);
    setMemoryPct(0);
    setMemoryTesting(false);

    const script = POST_SCRIPT(system);
    for (const step of script) {
      if (postAbort.current) return;
      if (step.delay) await wait(step.delay);

      if (step.memoryBar) {
        setMemoryTesting(true);
        for (let p = 0; p <= 100; p += 5) {
          if (postAbort.current) return;
          setMemoryPct(p);
          await wait(40);
        }
        setMemoryTesting(false);
        continue;
      }

      setPostLines((prev) => [...prev, {id: `${Date.now()}-${prev.length}`, text: step.text, tone: step.tone}]);
    }
  }, [system]);

  const powerOff = useCallback(() => {
    postAbort.current = true;
    setState(BIOS_STATE.OFF);
    setPostLines([]);
    setMemoryPct(0);
    setBootIndex(0);
    setSetupTab(0);
    setSetupRow(0);
    setPopup(null);
    setOsProgress(0);
    setToast('');
  }, []);

  const togglePower = useCallback(() => {
    if (state === BIOS_STATE.OFF) {
      runPost();
    } else {
      powerOff();
    }
  }, [state, runPost, powerOff]);

  const bootFromDrive = useCallback((drive) => {
    setState(BIOS_STATE.LOADING_OS);
    setOsProgress(0);
    showToast(`Загрузка: ${drive.name}`);
  }, [showToast]);

  useEffect(() => {
    if (state !== BIOS_STATE.LOADING_OS) return undefined;
    let p = 0;
    const id = setInterval(() => {
      p += 4;
      setOsProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setState(BIOS_STATE.OS_LOADED);
      }
    }, 80);
    return () => clearInterval(id);
  }, [state]);

  const handleSetupEnter = useCallback(() => {
    const rows = getSetupRows(setupTab, setupValues, system);
    const row = rows[setupRow];
    if (!row) return;

    if (row.type === 'device') {
      setPopup({field: row.key, title: row.name, selection: 0});
    } else if (row.type === 'bool') {
      const next = toggleBoolValue(row.value);
      setSetupValues((v) => ({...v, [row.key]: next}));
      showToast(`${row.name}: ${next}`);
    } else if (row.type === 'time') {
      setSetupValues((v) => ({
        ...v,
        systemTime: new Date().toLocaleTimeString('en-GB', {hour12: false}),
      }));
      showToast('Время обновлено');
    } else if (row.type === 'date') {
      setSetupValues((v) => ({
        ...v,
        systemDate: new Date().toDateString(),
      }));
      showToast('Дата обновлена');
    } else if (row.type === 'pass') {
      showToast('Пароль: демо-режим (не сохраняется)');
    }
  }, [setupTab, setupRow, setupValues, system, showToast]);

  const handleInput = useCallback(
    (key) => {
      if (state === BIOS_STATE.OFF) return;

      if (popup) {
        if (key === 'UP' && popup.selection > 0) {
          setPopup((p) => ({...p, selection: p.selection - 1}));
        } else if (key === 'DOWN' && popup.selection < system.drives.length - 1) {
          setPopup((p) => ({...p, selection: p.selection + 1}));
        } else if (key === 'ENTER') {
          const drive = system.drives[popup.selection];
          setSetupValues((v) => ({...v, [popup.field]: drive.id}));
          showToast(`Выбрано: ${drive.name}`);
          setPopup(null);
        } else if (key === 'ESC') {
          setPopup(null);
        }
        return;
      }

      switch (state) {
        case BIOS_STATE.POST:
          if (key === 'DEL') {
            setState(BIOS_STATE.BIOS_SETUP);
            setSetupTab(0);
            setSetupRow(0);
          } else if (key === 'F12') {
            setState(BIOS_STATE.BOOT_MENU);
            setBootIndex(0);
          }
          break;

        case BIOS_STATE.BOOT_MENU:
          if (key === 'UP' && bootIndex > 0) setBootIndex((i) => i - 1);
          else if (key === 'DOWN' && bootIndex < system.drives.length - 1) setBootIndex((i) => i + 1);
          else if (key === 'ENTER') bootFromDrive(system.drives[bootIndex]);
          else if (key === 'ESC') runPost();
          break;

        case BIOS_STATE.BIOS_SETUP: {
          const rows = getSetupRows(setupTab, setupValues, system);
          if (key === 'LEFT' || key === 'RIGHT') {
            setSetupTab((t) => (t + (key === 'RIGHT' ? 1 : -1) + 3) % 3);
            setSetupRow(0);
          } else if (key === 'UP' && setupRow > 0) setSetupRow((r) => r - 1);
          else if (key === 'DOWN' && setupRow < rows.length - 1) setSetupRow((r) => r + 1);
          else if (key === 'ENTER') handleSetupEnter();
          else if (key === 'ESC') {
            showToast('Выход без сохранения на диск…');
            setTimeout(runPost, 400);
          }
          break;
        }

        case BIOS_STATE.LOADING_OS:
        case BIOS_STATE.OS_LOADED:
          if (key === 'ESC') runPost();
          break;
        default:
          break;
      }
    },
    [
      state,
      popup,
      bootIndex,
      setupTab,
      setupRow,
      setupValues,
      system,
      runPost,
      bootFromDrive,
      handleSetupEnter,
      showToast,
    ],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (state === BIOS_STATE.OFF) return;
      let key = e.key.toUpperCase();
      if (key === 'ARROWUP') key = 'UP';
      if (key === 'ARROWDOWN') key = 'DOWN';
      if (key === 'ARROWLEFT') key = 'LEFT';
      if (key === 'ARROWRIGHT') key = 'RIGHT';
      if (key === 'DELETE') key = 'DEL';
      handleInput(key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, handleInput]);

  const renderScreen = () => {
    if (state === BIOS_STATE.OFF) {
      return <div className={styles.screenOff}>Нажмите "ВКЛ/ВЫКЛ" или клавиши на панели</div>;
    }

    if (popup) {
      return (
        <div className={styles.popup}>
          <div className={styles.popupTitle}>Select device: {popup.title}</div>
          <div className={styles.popupList}>
            {system.drives.map((d, i) => (
              <div
                key={d.id}
                className={clsx(styles.popupItem, i === popup.selection && styles.popupItemSelected)}
                onClick={() => setPopup((p) => ({...p, selection: i}))}
              >
                {d.name}
              </div>
            ))}
          </div>
          <div className={styles.popupFooter}>[↑↓] Select · [Enter] OK · [Esc] Cancel</div>
        </div>
      );
    }

    if (state === BIOS_STATE.POST) {
      return (
        <>
          {postLines.map((line) => (
            <PostLine key={line.id} line={line} />
          ))}
          {memoryTesting && (
            <div className={styles.memoryBar}>
              <div className={styles.memoryFill} style={{width: `${memoryPct}%`}} />
            </div>
          )}
        </>
      );
    }

    if (state === BIOS_STATE.BOOT_MENU) {
      return (
        <>
          <div className={styles.bootTitle}>Boot Priority Order</div>
          {system.drives.map((drive, i) => (
            <div
              key={drive.id}
              className={clsx(styles.bootItem, i === bootIndex && styles.bootItemActive)}
              onClick={() => setBootIndex(i)}
            >
              {i + 1}. {drive.name}
            </div>
          ))}
          <div className={styles.bootHint}>[↑↓] Select · [Enter] Boot · [Esc] POST</div>
        </>
      );
    }

    if (state === BIOS_STATE.BIOS_SETUP) {
      const rows = getSetupRows(setupTab, setupValues, system);
      return (
        <>
          <div className={styles.biosHeader}>BIOS Setup Utility — PhoenixBIOS</div>
          <div className={styles.tabs}>
            {SETUP_TABS.map((tab, i) => (
              <span
                key={tab}
                className={clsx(styles.tab, i === setupTab && styles.tabActive)}
                onClick={() => {
                  setSetupTab(i);
                  setSetupRow(0);
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className={styles.biosTable}>
            <table>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.key} className={i === setupRow ? styles.rowSelected : undefined}>
                    <td>{row.name}</td>
                    <td>{row.label ?? row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.biosFooter}>[←→] Tab · [↑↓] Item · [Enter] Edit · [Esc] Exit</div>
        </>
      );
    }

    if (state === BIOS_STATE.LOADING_OS) {
      return (
        <>
          <div className={styles.winLogo}>Microsoft Windows</div>
          <div>Starting Windows…</div>
          <div className={styles.winLoader}>
            <div className={styles.winProgress} style={{width: `${osProgress}%`}} />
          </div>
        </>
      );
    }

    if (state === BIOS_STATE.OS_LOADED) {
      return (
        <div className={styles.desktop}>
          <span className={styles.desktopIcon}>🖥️</span>
          <div>Рабочий стол (симуляция)</div>
          <small>Esc — перезапуск POST</small>
        </div>
      );
    }

    return null;
  };

  const powered = state !== BIOS_STATE.OFF;

  return (
    <DemoShell className={styles.shell}>
      <div className={styles.monitor}>
        <div className={styles.bezelTop}>
          <span>CRT Monitor · POST / Setup / Boot</span>
          <span className={clsx(styles.powerLed, powered && styles.powerLedOn)} title={powered ? 'On' : 'Off'} />
        </div>
        <div className={styles.screen}>
          {renderScreen()}
          {toast && <div className={styles.toast}>{toast}</div>}
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.keyPower} onClick={togglePower}>
            {powered ? '⏻ ВЫКЛ' : '⏻ ВКЛ'}
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('ESC')}>
            Esc
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('F12')}>
            F12
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('DEL')}>
            Del
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('UP')}>
            ▲
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('DOWN')}>
            ▼
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('LEFT')}>
            ◀
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('RIGHT')}>
            ▶
          </button>
          <button type="button" className={styles.key} onClick={() => handleInput('ENTER')}>
            Enter
          </button>
        </div>
        <div className={styles.chips}>
          <span className={styles.chip}>Del → Setup</span>
          <span className={styles.chip}>F12 → Boot menu</span>
          <span className={styles.chip}>Стрелки + Enter</span>
        </div>
      </div>
      <p className={styles.hintBar}>Эмулятор PhoenixBIOS: POST, выбор загрузочного устройства и базовый Setup.</p>
    </DemoShell>
  );
}

export default BIOSemulatorInner;
