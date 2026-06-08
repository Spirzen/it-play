import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {XAML_PRESETS, buildXaml} from '@/components/shared/kb/xamlDemoEngine';
import styles from '@/components/demos/XamlLayoutPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const LAYOUTS = [
  {id: 'center', label: 'По центру'},
  {id: 'stack', label: 'StackPanel'},
  {id: 'grid', label: 'Grid'},
];

function XamlLayoutPlayInner() {
  const {copy, isCopied} = useCopyToClipboard();
  const [config, setConfig] = useState(XAML_PRESETS[0]);
  const [activePreset, setActivePreset] = useState(XAML_PRESETS[0].id);

  const xaml = useMemo(() => buildXaml(config), [config]);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setConfig({...preset});
  };

  const update = (patch) => setConfig((c) => ({...c, ...patch}));

  return (
    <DemoShell>
      <DemoCard
        title="XAML: декларативный интерфейс"
        subtitle="Параметры окна меняют разметку и превью — как в WPF/UWP, где UI описывается отдельно от кода."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {XAML_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={clsx(toolStyles.chip, activePreset === preset.id && toolStyles.chipActive)}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className={clsx('it-demo__grid', 'it-demo__grid--2')} style={{marginBottom: '1rem'}}>
          <div className={styles.controls}>
            <label className="it-demo__label">Заголовок окна</label>
            <input
              className="it-demo__input"
              value={config.title}
              onChange={(e) => {
                setActivePreset('');
                update({title: e.target.value});
              }}
            />
            <label className="it-demo__label">Текст TextBlock</label>
            <input
              className="it-demo__input"
              value={config.text}
              onChange={(e) => {
                setActivePreset('');
                update({text: e.target.value});
              }}
            />
            <label className="it-demo__label">Размер шрифта</label>
            <input
              type="range"
              min={12}
              max={32}
              value={config.fontSize}
              onChange={(e) => {
                setActivePreset('');
                update({fontSize: Number(e.target.value)});
              }}
            />
            <span className={styles.rangeVal}>{config.fontSize}px</span>

            <label className="it-demo__label">Контейнер</label>
            <div className={toolStyles.chips}>
              {LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  type="button"
                  className={clsx(
                    toolStyles.chip,
                    config.layout === layout.id && toolStyles.chipActive,
                  )}
                  onClick={() => {
                    setActivePreset('');
                    update({layout: layout.id});
                  }}
                >
                  {layout.label}
                </button>
              ))}
            </div>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={config.showButton}
                onChange={(e) => {
                  setActivePreset('');
                  update({showButton: e.target.checked});
                }}
              />
              Показать кнопку
            </label>
            {config.showButton && (
              <input
                className="it-demo__input"
                value={config.buttonText}
                onChange={(e) => {
                  setActivePreset('');
                  update({buttonText: e.target.value});
                }}
                placeholder="Текст кнопки"
              />
            )}
          </div>

          <div>
            <label className="it-demo__label">Превью окна</label>
            <div className={styles.windowChrome}>
              <div className={styles.titleBar}>
                <span className={styles.traffic} />
                <span className={styles.traffic} />
                <span className={styles.traffic} />
                <span className={styles.windowTitle}>{config.title}</span>
              </div>
              <div
                className={clsx(
                  styles.client,
                  config.layout === 'center' && styles.clientCenter,
                  config.layout === 'stack' && styles.clientStack,
                  config.layout === 'grid' && styles.clientGrid,
                )}
              >
                {config.layout === 'grid' && (
                  <div className={styles.gridHeader}>{config.title}</div>
                )}
                <p className={styles.previewText} style={{fontSize: config.fontSize}}>
                  {config.text}
                </p>
                {config.showButton && (
                  <button type="button" className={styles.previewBtn}>
                    {config.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <label className="it-demo__label">Сгенерированный XAML</label>
        <pre className={styles.xamlBlock}>{xaml}</pre>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
          style={{marginTop: '0.5rem'}}
          onClick={() => copy(xaml, 'xaml')}
        >
          {isCopied('xaml') ? 'Скопировано' : 'Копировать XAML'}
        </button>

        <p className="it-demo__hint" style={{marginTop: '0.75rem', marginBottom: 0}}>
          При сборке .NET XAML компилируется в BAML и связывается с code-behind — свойства элементов можно
          привязать к модели данных (Data Binding).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default XamlLayoutPlayInner;
