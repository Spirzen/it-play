import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/GamepadPlay.module.css';

const DEAD = 0.12;
const SCHEMES = [
  {id: 'xbox', label: 'Xbox / XInput', jump: 'A', confirm: 'A', back: 'B'},
  {id: 'playstation', label: 'PlayStation', jump: '✕', confirm: '✕', back: '○'},
  {id: 'nintendo', label: 'Nintendo', jump: 'B', confirm: 'A', back: 'B'},
];

function applyDeadZone(v) {
  const mag = Math.hypot(v.x, v.y);
  if (mag < DEAD) return {x: 0, y: 0};
  const scale = (mag - DEAD) / (1 - DEAD);
  return {x: (v.x / mag) * scale, y: (v.y / mag) * scale};
}

function fmt(v) {
  return v.toFixed(2);
}

function Stick({side, value, onChange, zoneRef}) {
  const dragging = useRef(false);

  const move = useCallback(
    (clientX, clientY) => {
      const el = zoneRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const max = rect.width / 2 - 18;
      let dx = (clientX - cx) / max;
      let dy = (clientY - cy) / max;
      const len = Math.hypot(dx, dy);
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      onChange({x: dx, y: dy});
    },
    [onChange, zoneRef],
  );

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      move(e.clientX, e.clientY);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      onChange({x: 0, y: 0});
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [move, onChange]);

  const px = 50 + value.x * 38;
  const py = 50 + value.y * 38;

  return (
    <div
      ref={zoneRef}
      className={clsx(styles.stickZone, side === 'L' ? styles.stickLeft : styles.stickRight)}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX, e.clientY);
      }}
      role="slider"
      aria-label={`Стик ${side}`}
    >
      <div className={styles.deadZone} title="Мёртвая зона" />
      <div
        className={clsx(styles.stickCap, (value.x || value.y) && styles.stickCapActive)}
        style={{left: `${px}%`, top: `${py}%`}}
      />
    </div>
  );
}

function GamepadPlayInner({variant = 'full'}) {
  const compact = variant === 'compact';
  const [left, setLeft] = useState({x: 0, y: 0});
  const [right, setRight] = useState({x: 0, y: 0});
  const [dpad, setDpad] = useState('');
  const [face, setFace] = useState('');
  const [bumpers, setBumpers] = useState({L: false, R: false});
  const [triggers, setTriggers] = useState({L: 0, R: 0});
  const [rumble, setRumble] = useState(false);
  const [schemeId, setSchemeId] = useState('xbox');
  const [log, setLog] = useState([]);

  const leftZone = useRef(null);
  const rightZone = useRef(null);

  const leftNorm = applyDeadZone(left);
  const rightNorm = applyDeadZone(right);
  const scheme = SCHEMES.find((s) => s.id === schemeId) ?? SCHEMES[0];

  const push = useCallback((msg) => {
    setLog((prev) => [{id: Date.now(), msg}, ...prev].slice(0, 6));
  }, []);

  const flashFace = (btn) => {
    setFace(btn);
    push(`Кнопка ${btn}`);
    setTimeout(() => setFace(''), 200);
    if (rumble) setTimeout(() => setRumble(false), 120);
  };

  const gameAction = useCallback(() => {
    const parts = [];
    if (Math.abs(leftNorm.y) > 0.2) parts.push(leftNorm.y < 0 ? 'вперёд' : 'назад');
    if (Math.abs(leftNorm.x) > 0.2) parts.push(leftNorm.x < 0 ? 'влево' : 'вправо');
    if (Math.abs(rightNorm.x) > 0.15 || Math.abs(rightNorm.y) > 0.15) parts.push('камера');
    if (dpad) parts.push(`D-pad: ${dpad}`);
    if (face) parts.push(`действие (${face})`);
    if (triggers.L > 0.5) parts.push('тормоз');
    if (triggers.R > 0.5) parts.push('газ');
    if (bumpers.L) parts.push('предыдущее оружие');
    if (bumpers.R) parts.push('следующее оружие');
    return parts.length ? parts.join(' · ') : 'ожидание ввода…';
  }, [leftNorm, rightNorm, dpad, face, triggers, bumpers]);

  const showPipeline = !compact;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Попробуйте геймпад"
        subtitle="Двигайте стики, нажимайте кнопки и триггеры — значения нормализуются как в игровом движке (−1…+1, dead zone)."
      >
        <div className={styles.layout}>
          <div className={styles.padWrap}>
            <div className={clsx(styles.gamepad, rumble && styles.gamepadVibrate)}>
              <div className={styles.dpad}>
                {[
                  ['up', styles.dpadUp],
                  ['left', styles.dpadLeft],
                  ['', styles.dpadCenter],
                  ['right', styles.dpadRight],
                  ['down', styles.dpadDown],
                ].map(([dir, cls]) =>
                  dir ? (
                    <button
                      key={dir}
                      type="button"
                      className={clsx(styles.dpadBtn, cls, dpad === dir && styles.dpadBtnActive)}
                      onPointerDown={() => {
                        setDpad(dir);
                        push(`D-pad ${dir}`);
                      }}
                      onPointerUp={() => setDpad('')}
                      onPointerLeave={() => setDpad('')}
                      aria-label={dir}
                    />
                  ) : (
                    <span key="c" className={cls} />
                  ),
                )}
              </div>

              <Stick side="L" value={left} onChange={setLeft} zoneRef={leftZone} />
              <Stick side="R" value={right} onChange={setRight} zoneRef={rightZone} />

              <div className={styles.faceBtns}>
                {[
                  ['Y', styles.btnY],
                  ['B', styles.btnB],
                  ['X', styles.btnX],
                  ['A', styles.btnA],
                ].map(([label, cls]) => (
                  <button
                    key={label}
                    type="button"
                    className={clsx(styles.faceBtn, cls, face === label && styles.faceBtnActive)}
                    onPointerDown={() => {
                      flashFace(label);
                      setRumble(true);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={clsx(styles.bumper, styles.bumperL, bumpers.L && styles.bumperActive)}
                onPointerDown={() => {
                  setBumpers((b) => ({...b, L: true}));
                  push('LB');
                }}
                onPointerUp={() => setBumpers((b) => ({...b, L: false}))}
              >
                LB
              </button>
              <button
                type="button"
                className={clsx(styles.bumper, styles.bumperR, bumpers.R && styles.bumperActive)}
                onPointerDown={() => {
                  setBumpers((b) => ({...b, R: true}));
                  push('RB');
                }}
                onPointerUp={() => setBumpers((b) => ({...b, R: false}))}
              >
                RB
              </button>
            </div>

            <div className={styles.triggerRow}>
              <label className={styles.trigger}>
                LT {(triggers.L * 255) | 0}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(triggers.L * 100)}
                  onChange={(e) => setTriggers((t) => ({...t, L: Number(e.target.value) / 100}))}
                />
              </label>
              <label className={styles.trigger}>
                RT {(triggers.R * 255) | 0}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(triggers.R * 100)}
                  onChange={(e) => setTriggers((t) => ({...t, R: Number(e.target.value) / 100}))}
                />
              </label>
            </div>

            <label className={styles.hint}>
              <input type="checkbox" checked={rumble} onChange={(e) => setRumble(e.target.checked)} /> Вибрация при
              нажатии A
            </label>
          </div>

          <div>
            <div className={styles.schemeTabs}>
              {SCHEMES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={clsx(styles.schemeTab, schemeId === s.id && styles.schemeTabActive)}
                  onClick={() => setSchemeId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <pre className={styles.readout}>
              {`LS  X:${fmt(leftNorm.x)}  Y:${fmt(leftNorm.y)}
RS  X:${fmt(rightNorm.x)}  Y:${fmt(rightNorm.y)}
LT  ${(triggers.L * 255) | 0}    RT  ${(triggers.R * 255) | 0}
D-pad  ${dpad || '—'}    Face  ${face || '—'}`}
            </pre>
            <div className={styles.actionBox}>
              <strong>В игре:</strong> {gameAction()}
              <br />
              <span className={styles.hint}>
                Прыжок: {scheme.jump} · Подтвердить: {scheme.confirm} · Назад: {scheme.back}
              </span>
            </div>

            {showPipeline && (
              <div className={styles.pipeline} aria-label="Цепочка HID">
                {['Кнопка/стик', 'HID-отчёт', 'Драйвер ОС', 'XInput/SDL', 'Игровая логика'].map((step, i) => (
                  <React.Fragment key={step}>
                    {i > 0 && <span className={styles.pipeArrow}>→</span>}
                    <span className={clsx(styles.pipeStep, (face || dpad || left.x) && i <= 2 && styles.pipeStepLit)}>
                      {step}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {log.length > 0 && (
              <ul className={styles.hint} style={{marginTop: '0.65rem', paddingLeft: '1rem'}}>
                {log.map((e) => (
                  <li key={e.id}>{e.msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GamepadPlayInner;
