import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';

const PRESETS = [
  {
    id: 'win',
    os: 'Windows',
    tool: 'ShareX / Win+Shift+S',
    hotkey: 'Win + Shift + S — область; ShareX — OCR, GIF, upload',
    tip: 'Для баг-репортов: захват окна + автозагрузка в тикет',
  },
  {
    id: 'mac',
    os: 'macOS',
    tool: 'Cmd + Shift + 4 / CleanShot',
    hotkey: 'Cmd+Shift+4 — область; Cmd+Shift+5 — панель записи',
    tip: 'Снимки по умолчанию на рабочий стол — настройте папку в "Снимок экрана"',
  },
  {
    id: 'linux',
    os: 'Linux',
    tool: 'Flameshot / Ksnip',
    hotkey: 'flameshot gui — аннотации; Print — gnome-screenshot',
    tip: 'Назначьте flameshot на PrtSc в настройках клавиатуры DE',
  },
];

const ANNOT_TYPES = [
  {id: 'rect', label: 'Рамка', style: {top: 24, left: 20, width: 120, height: 70}},
  {id: 'arrow', label: 'Стрелка', style: {top: 100, left: 160, width: 0, height: 0}},
  {id: 'text', label: 'Текст', style: {top: 36, left: 150}},
];

function ScreenshotWorkflowPlayInner() {
  const [presetId, setPresetId] = useState('win');
  const [mode, setMode] = useState('region');
  const [annot, setAnnot] = useState('rect');
  const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0];
  const a = ANNOT_TYPES.find((x) => x.id === annot) ?? ANNOT_TYPES[0];

  return (
    <DemoShell>
      <DemoCard
        title="Сценарий скриншота"
        subtitle="Платформа, режим захвата и аннотация — как в Flameshot или ShareX"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, presetId === item.id && toolStyles.chipActive)}
              onClick={() => setPresetId(item.id)}
            >
              {item.os}
            </button>
          ))}
        </div>
        <p className={styles.lead}>
          <strong>{p.tool}</strong> — {p.hotkey}
        </p>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {['region', 'window', 'full'].map((m) => (
            <button
              key={m}
              type="button"
              className={clsx(toolStyles.chip, mode === m && toolStyles.chipActive)}
              onClick={() => setMode(m)}
            >
              {m === 'region' ? 'Область' : m === 'window' ? 'Окно' : 'Весь экран'}
            </button>
          ))}
        </div>
        <div className={styles.canvas}>
          <div
            className={styles.captureRegion}
            style={{
              top: mode === 'full' ? 8 : 28,
              left: mode === 'full' ? 8 : 40,
              width: mode === 'full' ? 'calc(100% - 16px)' : mode === 'window' ? '55%' : '45%',
              height: mode === 'full' ? 'calc(100% - 16px)' : '55%',
            }}
          />
          {annot === 'rect' && (
            <div
              className={styles.annot}
              style={{...a.style, background: 'transparent', border: '2px solid #e91e63'}}
            />
          )}
          {annot === 'text' && (
            <span className={styles.annot} style={a.style}>
              Баг здесь
            </span>
          )}
          {annot === 'arrow' && (
            <span
              style={{
                position: 'absolute',
                top: 90,
                left: 130,
                fontSize: '1.4rem',
                color: '#e91e63',
              }}
            >
              →
            </span>
          )}
          <span
            style={{
              position: 'absolute',
              bottom: 8,
              right: 10,
              fontSize: '0.72rem',
              opacity: 0.7,
            }}
          >
            Демо-кадр ({mode})
          </span>
        </div>
        <div className={toolStyles.chips} style={{marginTop: '0.5rem'}}>
          {ANNOT_TYPES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, annot === item.id && toolStyles.chipActive)}
              onClick={() => setAnnot(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="it-demo__hint" style={{marginTop: '0.5rem', marginBottom: 0}}>
          {p.tip}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ScreenshotWorkflowPlayInner;
