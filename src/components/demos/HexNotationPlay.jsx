import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/HexNotationPlay.module.css';

const ERROR_CODES = [
  {hex: '0x00000000', name: 'Нулевой код', hint: 'Часто в 1С/приложениях — права, сертификаты'},
  {hex: '0x80070005', name: 'Access Denied', hint: 'Windows: отказ в доступе к файлу или реестру'},
  {hex: '0xC000021A', name: 'Critical system error', hint: 'BSOD: сбой Winlogon / Csrss'},
  {hex: '0xDEADBEEF', name: 'Magic debug fill', hint: 'Маркер неинициализированной памяти в отладке'},
];

function toHex(n) {
  if (!Number.isFinite(n) || n < 0) return '—';
  return `0x${Math.floor(n).toString(16).toUpperCase()}`;
}

function fromHexInput(raw) {
  const s = raw.trim().replace(/^0x/i, '');
  if (!s || !/^[0-9A-Fa-f]+$/.test(s)) return null;
  return parseInt(s, 16);
}

function HexNotationPlayInner() {
  const [mode, setMode] = useState('convert');
  const [decimal, setDecimal] = useState(255);
  const [hexIn, setHexIn] = useState('FF');
  const [colorR, setColorR] = useState(173);
  const [colorG, setColorG] = useState(216);
  const [colorB, setColorB] = useState(230);

  const hexFromDec = useMemo(() => toHex(decimal), [decimal]);
  const decFromHex = useMemo(() => fromHexInput(hexIn), [hexIn]);
  const colorHex = `#${[colorR, colorG, colorB]
    .map((c) => Math.min(255, Math.max(0, c)).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Шестнадцатеричная запись 0x"
        subtitle="Конвертер, коды ошибок Windows и цвет #RRGGBB"
      >
        <div className="it-demo__tabs">
          {[
            {id: 'convert', label: 'Конвертер'},
            {id: 'errors', label: 'Коды 0x'},
            {id: 'color', label: 'Цвет'},
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx('it-demo__tab', mode === m.id && 'it-demo__tab--active')}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'convert' && (
          <div className={styles.convertGrid}>
            <label>
              <span className="it-demo__label">Десятичное</span>
              <input
                type="number"
                className="it-demo__input"
                min={0}
                value={decimal}
                onChange={(e) => setDecimal(Number(e.target.value))}
              />
              <span className={styles.arrow}>⇄</span>
              <strong className={styles.hexOut}>{hexFromDec}</strong>
            </label>
            <label>
              <span className="it-demo__label">Hex (без 0x)</span>
              <input
                className="it-demo__input"
                value={hexIn}
                onChange={(e) => setHexIn(e.target.value)}
              />
              <span className={styles.arrow}>→</span>
              <strong>
                {decFromHex === null ? 'некорректно' : decFromHex}
              </strong>
              <span className={styles.sub}>десятичное</span>
            </label>
            <p className="it-demo__hint">
              Префикс <code>0x</code> сообщает компилятору и человеку: число в системе с основанием 16.
            </p>
          </div>
        )}

        {mode === 'errors' && (
          <ul className={styles.errorList}>
            {ERROR_CODES.map((e) => (
              <li key={e.hex}>
                <code>{e.hex}</code>
                <div>
                  <strong>{e.name}</strong>
                  <p>{e.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {mode === 'color' && (
          <>
            <div className={styles.colorPreview} style={{background: colorHex}} />
            <code className={styles.colorCode}>{colorHex}</code>
            <div className={styles.sliders}>
              {['R', 'G', 'B'].map((ch, i) => {
                const val = [colorR, colorG, colorB][i];
                const set = [setColorR, setColorG, setColorB][i];
                return (
                  <label key={ch}>
                    {ch}
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={val}
                      onChange={(e) => set(Number(e.target.value))}
                    />
                    <span>{val.toString(16).padStart(2, '0').toUpperCase()}</span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default HexNotationPlayInner;
