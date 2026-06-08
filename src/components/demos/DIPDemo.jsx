import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {BENEFITS, CODE_BAD, CODE_GOOD, DEVICES, getDevice} from '@/components/shared/kb/dipEngine';
import styles from '@/components/demos/DIPDemo.module.css';

const INITIAL_STATE = Object.fromEntries(DEVICES.map((d) => [d.id, false]));

function DIPDemoInner() {
  const [activeDevice, setActiveDevice] = useState('bulb');
  const [deviceStates, setDeviceStates] = useState(INITIAL_STATE);
  const [followsDip, setFollowsDip] = useState(true);

  const device = getDevice(activeDevice);
  const isOn = deviceStates[activeDevice];

  const toggle = useCallback(() => {
    setDeviceStates((prev) => ({...prev, [activeDevice]: !prev[activeDevice]}));
  }, [activeDevice]);

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>🔄 Принцип инверсии зависимостей (DIP)</h4>
        <p className={styles.subtitle}>
          Высокоуровневый модуль (Switch) зависит от абстракции Switchable, а не от конкретных устройств.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={clsx(styles.modeBtn, followsDip && styles.modeBtnActive)}
            onClick={() => setFollowsDip(true)}
          >
            ✅ Соблюдаем DIP
          </button>
          <button
            type="button"
            className={clsx(styles.modeBtn, !followsDip && styles.modeBtnBadActive)}
            onClick={() => setFollowsDip(false)}
          >
            ❌ Нарушение DIP
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.diagram}>
            <div className={clsx(styles.archBox, styles.archSwitch, !followsDip && styles.archDimmed)}>
              <strong>🔌 Switch</strong>
              <span className={styles.archLabel}>высокоуровневый модуль</span>
            </div>
            <span className={styles.archArrow}>{followsDip ? 'зависит от ↓' : 'знает только ↓'}</span>

            <div
              className={clsx(
                styles.archBox,
                styles.archIface,
                followsDip ? styles.archBoxActive : styles.archDimmed,
              )}
            >
              <strong>📄 Switchable</strong>
              <span className={styles.archLabel}>turnOn() · turnOff() · isOn()</span>
            </div>

            <span className={styles.archArrow}>{followsDip ? 'реализуют ↓' : 'жёстко привязан к ↓'}</span>

            <div className={styles.deviceRow}>
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={clsx(
                    styles.deviceChip,
                    activeDevice === d.id && styles.deviceChipActive,
                    !followsDip && d.id !== 'bulb' && styles.archDimmed,
                  )}
                  style={{'--chip-accent': d.accent}}
                  onClick={() => setActiveDevice(d.id)}
                  disabled={!followsDip && d.id !== 'bulb'}
                >
                  {d.icon} {d.name}
                </button>
              ))}
            </div>
            <span className={styles.archLabel}>низкоуровневые детали</span>
          </div>

          <div>
            <span className="it-demo__label">Устройство (Switchable)</span>
            <div className={styles.deviceRow} style={{marginBottom: '0.85rem'}}>
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={clsx(
                    'it-demo__btn it-demo__btn--sm',
                    activeDevice !== d.id && 'it-demo__btn--secondary',
                  )}
                  onClick={() => setActiveDevice(d.id)}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>

            <div className={clsx(styles.stage, isOn && styles.stageOn)}>
              <div
                className={clsx(styles.deviceIcon, isOn && styles.deviceIconOn)}
                style={isOn ? {'--glow-color': device.accent} : undefined}
              >
                {device.icon}
              </div>
              <strong className={styles.deviceName}>{device.label}</strong>
              <span className={styles.statusLine}>{isOn ? '🔛 Включено' : '⛔ Выключено'}</span>
            </div>

            <div className="it-demo__row" style={{justifyContent: 'center', marginBottom: '0.85rem'}}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={toggle}>
                {isOn ? 'ВЫКЛЮЧИТЬ' : 'ВКЛЮЧИТЬ'} через Switch
              </button>
            </div>

            <div
              className={clsx(
                'it-demo__alert',
                followsDip ? 'it-demo__alert--success' : 'it-demo__alert--warning',
              )}
            >
              {followsDip ? (
                <>
                  <strong>Switch(Switchable device)</strong> — можно подставить любое устройство, в том числе mock для
                  тестов.
                </>
              ) : (
                <>
                  <strong>Switch(LightBulb)</strong> — Switch скомпилирован под лампочку; Fan и Heater потребуют новый
                  класс Switch.
                </>
              )}
            </div>

            <details>
              <summary style={{cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600}}>Пример кода</summary>
              <pre className={styles.codeBlock}>{followsDip ? CODE_GOOD : CODE_BAD}</pre>
            </details>

            <div className={styles.benefitList}>
              {BENEFITS.map((b) => (
                <div key={b.title} className={styles.benefit}>
                  <span>{b.icon}</span>
                  <span>
                    <strong>{b.title}</strong> — {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export default DIPDemoInner;
