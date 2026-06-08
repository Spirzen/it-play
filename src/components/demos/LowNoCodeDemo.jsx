import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DEFAULT_CANVAS,
  LOW_CODE_EXAMPLES,
  PALETTE,
  exportCanvasJson,
  parseLowCodeConfig,
} from '@/components/shared/kb/lowNoCodeEngine';
import styles from '@/components/demos/LowNoCodeDemo.module.css';

function LowCodePreview({config, tableSort, onSort}) {
  if (!config?.ok) return null;

  if (config.type === 'button') {
    const {text, backgroundColor, color} = config.props;
    return (
      <button
        type="button"
        className={styles.previewBtn}
        style={{backgroundColor, color}}
        onClick={() => window.alert(`Low-Code: ${text}`)}
      >
        {text}
      </button>
    );
  }

  if (config.type === 'table') {
    const {rows, columns} = config.props;
    const sorted = [...rows].sort((a, b) => {
      if (!tableSort.col) return 0;
      const av = a[tableSort.col];
      const bv = b[tableSort.col];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return tableSort.dir === 'asc' ? cmp : -cmp;
    });
    return (
      <table className={styles.previewTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} onClick={() => onSort(col)}>
                {col}
                {tableSort.col === col ? (tableSort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (config.type === 'chart') {
    const {data, labels} = config.props;
    const max = Math.max(...data, 1);
    return (
      <div className={styles.chartBars}>
        {data.map((val, i) => (
          <div key={labels[i] ?? i} className={styles.chartCol}>
            <div className={styles.chartBar} style={{height: `${(val / max) * 100}%`}} title={String(val)} />
            <span className={styles.chartLabel}>{labels[i]}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function CanvasWidget({comp}) {
  switch (comp.type) {
    case 'button':
      return (
        <button
          type="button"
          style={{
            padding: '8px 14px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
          onClick={(e) => {
            e.stopPropagation();
            window.alert(comp.label);
          }}
        >
          {comp.label}
        </button>
      );
    case 'text':
      return (
        <div style={{padding: '8px', background: 'var(--ifm-background-surface-color)', borderRadius: 6}}>
          {comp.label}
        </div>
      );
    case 'input':
      return (
        <input
          type="text"
          placeholder={comp.label}
          style={{padding: '8px', borderRadius: 6, border: '1px solid var(--demo-border)', minWidth: 140}}
          onClick={(e) => e.stopPropagation()}
        />
      );
    case 'card':
      return (
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--ifm-card-background-color)',
            borderRadius: 8,
            border: '1px solid var(--demo-border)',
            minWidth: 120,
          }}
        >
          <strong style={{fontSize: '0.85rem'}}>{comp.label}</strong>
          <p style={{margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--demo-muted)'}}>Содержимое карточки</p>
        </div>
      );
    default:
      return <span>{comp.label}</span>;
  }
}

function LowNoCodeDemoInner() {
  const [activeTab, setActiveTab] = useState('nocode');
  const [inputCode, setInputCode] = useState('');
  const [preview, setPreview] = useState(null);
  const [parseError, setParseError] = useState('');
  const [tableSort, setTableSort] = useState({col: null, dir: 'asc'});
  const [components, setComponents] = useState(DEFAULT_CANVAS);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dragRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const buildLowCode = () => {
    const result = parseLowCodeConfig(inputCode);
    if (result.ok) {
      setPreview(result);
      setParseError('');
      setTableSort({col: null, dir: 'asc'});
    } else {
      setPreview(null);
      setParseError(result.error);
    }
  };

  const handleSort = (col) => {
    setTableSort((s) =>
      s.col === col ? {col, dir: s.dir === 'asc' ? 'desc' : 'asc'} : {col, dir: 'asc'},
    );
  };

  const clamp = (x, y, w, h) => {
    const maxX = Math.max(10, w - 110);
    const maxY = Math.max(10, h - 44);
    return {x: Math.max(10, Math.min(x, maxX)), y: Math.max(10, Math.min(y, maxY))};
  };

  const addComponent = (type, label, x, y) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const {x: cx, y: cy} = rect
      ? clamp(x, y, rect.width, rect.height)
      : {x: 40 + components.length * 12, y: 40 + components.length * 12};
    setComponents((list) => [...list, {id: Date.now(), type, label, x: cx, y: cy}]);
  };

  const handlePaletteDragStart = (e, comp) => {
    e.dataTransfer.setData('type', comp.type);
    e.dataTransfer.setData('label', comp.defaultLabel);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const type = e.dataTransfer.getData('type');
    const label = e.dataTransfer.getData('label');
    if (!type || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    addComponent(type, label, e.clientX - rect.left - 40, e.clientY - rect.top - 16);
  };

  const startDragItem = (e, comp) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canvasRef.current) return;
    setSelectedId(comp.id);
    const rect = canvasRef.current.getBoundingClientRect();
    dragRef.current = {
      id: comp.id,
      offsetX: e.clientX - rect.left - comp.x,
      offsetY: e.clientY - rect.top - comp.y,
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const drag = dragRef.current;
      const canvas = canvasRef.current;
      if (!drag || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const {x, y} = clamp(
        e.clientX - rect.left - drag.offsetX,
        e.clientY - rect.top - drag.offsetY,
        rect.width,
        rect.height,
      );
      const dragId = drag.id;
      setComponents((list) => list.map((c) => (c.id === dragId ? {...c, x, y} : c)));
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const selected = components.find((c) => c.id === selectedId);

  const updateSelectedLabel = (label) => {
    if (!selectedId) return;
    setComponents((list) => list.map((c) => (c.id === selectedId ? {...c, label} : c)));
  };

  const copyExport = useCallback(() => {
    const json = exportCanvasJson(components);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(json);
    }
  }, [components]);

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Low-Code и No-Code</h3>
        <p className={styles.subtitle}>Сравните конфигурацию с минимумом кода и визуальный конструктор без кода</p>
      </header>

      <div className={styles.compareRow}>
        <div className={clsx(styles.compareCard, styles.compareLow)}>
          <strong>Low-Code</strong> — JSON/DSL + платформа генерирует UI. Нужны разработчики для сложной логики.
        </div>
        <div className={clsx(styles.compareCard, styles.compareNo)}>
          <strong>No-Code</strong> — drag-and-drop, шаблоны. Бизнес-пользователи собирают экраны без IDE.
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={clsx('it-demo__btn', activeTab === 'lowcode' && 'it-demo__btn--primary')}
          onClick={() => setActiveTab('lowcode')}
        >
          Low-Code
        </button>
        <button
          type="button"
          className={clsx('it-demo__btn', activeTab === 'nocode' && 'it-demo__btn--primary')}
          onClick={() => setActiveTab('nocode')}
        >
          No-Code
        </button>
      </div>

      {activeTab === 'lowcode' && (
        <>
          <div className={styles.lowGrid}>
            <div>
              <h4>Примеры</h4>
              {Object.entries(LOW_CODE_EXAMPLES).map(([key, ex]) => (
                <button
                  key={key}
                  type="button"
                  className={styles.exampleCard}
                  onClick={() => {
                    setInputCode(ex.code);
                    setPreview(null);
                    setParseError('');
                  }}
                >
                  <div className={styles.exampleName}>{ex.name}</div>
                  <pre className={styles.exampleSnippet}>{ex.code.slice(0, 90)}…</pre>
                  <div style={{fontSize: '0.72rem', color: 'var(--demo-muted)', marginTop: 6}}>→ {ex.result}</div>
                </button>
              ))}
            </div>

            <div>
              <h4>Конфигурация</h4>
              <textarea
                className={clsx('it-demo__textarea', styles.editor)}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder='Вставьте объект с type: "button" | "table" | "chart"…'
                spellCheck={false}
              />
              <button type="button" className="it-demo__btn it-demo__btn--primary" style={{width: '100%'}} onClick={buildLowCode}>
                Собрать превью
              </button>
              {parseError && <div className={styles.resultErr}>{parseError}</div>}
            </div>

            <div className={styles.previewPanel}>
              <div className={styles.previewLabel}>Живой превью</div>
              {preview ? (
                <LowCodePreview config={preview} tableSort={tableSort} onSort={handleSort} />
              ) : (
                <div className={styles.previewEmpty}>Выберите пример или нажмите "Собрать превью"</div>
              )}
            </div>
          </div>

          <div className={styles.infoBox}>
            <strong>Low-Code:</strong> OutSystems, Mendix, Retool — ускоряют админки и MVP, оставляя точки расширения
            кодом.
          </div>
        </>
      )}

      {activeTab === 'nocode' && (
        <>
          {isMobile && (
            <p className={styles.mobileTip}>На телефоне нажмите на элемент палитры, чтобы добавить его на холст.</p>
          )}

          <div className={styles.palette}>
            {PALETTE.map((comp) => (
              <div
                key={comp.id}
                className={styles.paletteItem}
                draggable={!isMobile}
                onDragStart={(e) => !isMobile && handlePaletteDragStart(e, comp)}
                onClick={() => isMobile && addComponent(comp.type, comp.defaultLabel, 60, 60)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && addComponent(comp.type, comp.defaultLabel, 60, 60)}
              >
                {comp.icon} {comp.name}
              </div>
            ))}
          </div>

          <div
            ref={canvasRef}
            className={clsx(styles.canvas, isDragging && styles.canvasDrag)}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => setSelectedId(null)}
          >
            {components.map((comp) => (
              <div
                key={comp.id}
                className={clsx(styles.canvasItem, selectedId === comp.id && styles.canvasItemSelected)}
                style={{left: comp.x, top: comp.y}}
                onMouseDown={(e) => startDragItem(e, comp)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(comp.id);
                }}
              >
                <CanvasWidget comp={comp} />
              </div>
            ))}
            {components.length === 0 && (
              <div className={styles.previewEmpty} style={{position: 'absolute', inset: 0}}>
                Перетащите компоненты с палитры
              </div>
            )}
          </div>

          {selected && (
            <div className={styles.propsPanel}>
              <strong>Свойства: {selected.type}</strong>
              <div className={styles.propsRow}>
                <label htmlFor="comp-label">Текст</label>
                <input
                  id="comp-label"
                  className="it-demo__input"
                  value={selected.label}
                  onChange={(e) => updateSelectedLabel(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.canvasActions}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--danger"
              onClick={() => {
                dragRef.current = null;
                setSelectedId(null);
                setComponents([]);
              }}
            >
              Очистить
            </button>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => {
                dragRef.current = null;
                setSelectedId(null);
                setComponents(DEFAULT_CANVAS.map((c) => ({...c})));
              }}
            >
              Пример
            </button>
            <button type="button" className="it-demo__btn" onClick={copyExport}>
              Копировать JSON
            </button>
          </div>

          <div className={styles.infoBox}>
            <strong>No-Code:</strong> Bubble, Webflow, Tilda — маркетологи и аналитики публикуют лендинги и простые
            приложения без репозитория кода.
          </div>
        </>
      )}

      <p className={styles.fact}>
        По оценкам Gartner, к 2025 году до 70% новых приложений создаются с элементами Low-Code/No-Code — цикл
        "идея → прототип" сокращается с месяцев до недель.
      </p>
    </DemoShell>
  );
}

export default LowNoCodeDemoInner;
