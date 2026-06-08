import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  FONT_SAMPLES,
  hexToRgb,
  PALETTE_ROLES,
  rgbToHex,
} from '@/components/shared/kb/uiInterfaceDemoEngine';
import ui from '@/components/shared/kb/uiInterfaceDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function UiVisualElementsDemoInner() {
  const [activeColor, setActiveColor] = useState(PALETTE_ROLES[0].hex);
  const [fontId, setFontId] = useState(FONT_SAMPLES[0].id);
  const [theme, setTheme] = useState('light');

  const rgb = useMemo(() => hexToRgb(activeColor), [activeColor]);
  const font = FONT_SAMPLES.find((f) => f.id === fontId) ?? FONT_SAMPLES[0];

  const onRgbChange = (channel, value) => {
    if (!rgb) return;
    const next = {...rgb, [channel]: Number(value)};
    setActiveColor(rgbToHex(next.r, next.g, next.b));
  };

  return (
    <DemoShell>
      <DemoCard
        title="Визуальные элементы: цвет, шрифт, тема"
        subtitle="Палитра интерфейса, преобразование HEX ↔ RGB и предпросмотр светлой и тёмной темы."
      >
        <p className="it-demo__label">Роли цветовой палитры</p>
        <div className={ui.swatchRow}>
          {PALETTE_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className={clsx(ui.swatch, activeColor === role.hex && ui.swatchActive)}
              style={{backgroundColor: role.hex}}
              title={role.label}
              aria-label={role.label}
              onClick={() => setActiveColor(role.hex)}
            />
          ))}
        </div>

        <div className={ui.colorCodes}>
          <div>
            <label className="it-demo__label">HEX</label>
            <input
              className={ui.uiInput}
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div>
            <label className="it-demo__label">RGB</label>
            {rgb ? (
              <div style={{display: 'flex', gap: '0.35rem'}}>
                {(['r', 'g', 'b']).map((ch) => (
                  <input
                    key={ch}
                    type="number"
                    min={0}
                    max={255}
                    className={ui.uiInput}
                    value={rgb[ch]}
                    onChange={(e) => onRgbChange(ch, e.target.value)}
                    aria-label={ch.toUpperCase()}
                  />
                ))}
              </div>
            ) : (
              <p className={ui.hintText}>Некорректный HEX — нужен формат #RRGGBB</p>
            )}
            {rgb && (
              <p className={ui.hintText} style={{marginTop: '0.35rem'}}>
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </p>
            )}
          </div>
        </div>

        <div
          className={ui.previewBox}
          style={{backgroundColor: activeColor}}
          aria-hidden
        />

        <p className="it-demo__label" style={{marginTop: '1rem'}}>
          Семейство шрифтов
        </p>
        <div className={toolStyles.chips}>
          {FONT_SAMPLES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(toolStyles.chip, fontId === f.id && toolStyles.chipActive)}
              onClick={() => setFontId(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className={ui.fontPreview} style={{fontFamily: font.family}}>
          {font.sample}
        </div>

        <p className="it-demo__label" style={{marginTop: '1rem'}}>
          Тема интерфейса
        </p>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          <button
            type="button"
            className={clsx(toolStyles.chip, theme === 'light' && toolStyles.chipActive)}
            onClick={() => setTheme('light')}
          >
            Светлая
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, theme === 'dark' && toolStyles.chipActive)}
            onClick={() => setTheme('dark')}
          >
            Тёмная
          </button>
        </div>
        <div className={clsx(ui.themePreview, theme === 'dark' ? ui.themeDark : ui.themeLight)}>
          <strong>Карточка продукта</strong>
          <div className={ui.themeCard}>
            <p style={{margin: '0 0 0.5rem'}}>Текст и фон подстраиваются под выбранную тему.</p>
            <button type="button" className={ui.uiBtn} style={{backgroundColor: activeColor, borderColor: activeColor}}>
              Действие
            </button>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UiVisualElementsDemoInner;
