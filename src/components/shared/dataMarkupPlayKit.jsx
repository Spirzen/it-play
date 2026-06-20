import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/DataMarkupPlays.module.css';

/** @typedef {{ primary: string; muted: string; border: string; bg: string; surface: string; text: string; success: string; error: string; grid: string; }} DemoCanvasTheme */

export function readCanvasTheme(el) {
  const root = el?.closest?.('.dmRoot') ?? el ?? document.documentElement;
  const cs = getComputedStyle(root);
  const pick = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return {
    primary: pick('--ifm-color-primary', '#7b68ee'),
    muted: pick('--demo-muted', '#6b7280'),
    border: pick('--demo-border', '#d1d5db'),
    bg: pick('--ifm-background-color', '#ffffff'),
    surface: pick('--ifm-background-surface-color', '#f9fafb'),
    text: pick('--ifm-color-content', '#1a1a1a'),
    success: pick('--demo-success', '#2e7d32'),
    error: pick('--demo-error', '#c62828'),
    grid: pick('--demo-border', '#e5e7eb'),
  };
}

export function PlayRoot({title, subtitle, children, className}) {
  return (
    <DemoShell>
      <DemoCard title={title} subtitle={subtitle}>
        <div className={clsx(styles.dmRoot, className)}>{children}</div>
      </DemoCard>
    </DemoShell>
  );
}

export function Section({title, children, className}) {
  return (
    <section className={clsx(styles.section, className)}>
      {title ? <h5 className={styles.sectionTitle}>{title}</h5> : null}
      {children}
    </section>
  );
}

export function ChipRow({options, value, onChange, scrollable}) {
  const {isMobile} = useBreakpoint();
  const useScroll = scrollable ?? (isMobile && options.length > 3);
  return (
    <div className={useScroll ? styles.chipRowScroll : styles.chipRow} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          className={clsx(styles.chip, value === opt.id && styles.chipActive)}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function DataTable({columns, rows, highlight, caption}) {
  if (!rows?.length) {
    return <p className={styles.hint}>Нет строк для отображения</p>;
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={highlight?.(row, i) ? styles.rowHighlight : undefined}>
              {columns.map((c) => (
                <td key={c}>{row[c] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MemoryStrip({cells, activeIndex}) {
  return (
    <div className={styles.memoryStrip}>
      {cells.map((cell, i) => (
        <div
          key={cell.addr ?? i}
          className={clsx(styles.memoryCell, activeIndex === i && styles.memoryCellActive)}
        >
          <div className={styles.memoryAddr}>{cell.addr}</div>
          <div className={styles.memoryHex}>{cell.hex}</div>
          {cell.hint ? <div className={styles.memoryHint}>{cell.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function Panel({title, children, className, muted}) {
  return (
    <div className={clsx(styles.panel, className)}>
      {title ? <div className={styles.panelTitle}>{title}</div> : null}
      {muted ? <p className={styles.panelMuted}>{children}</p> : children}
    </div>
  );
}

export function MetricGrid({items}) {
  return (
    <div className={styles.metricGrid}>
      {items.map((item) => (
        <div
          key={item.label}
          className={clsx(
            styles.metric,
            item.tone === 'success' && styles.metricSuccess,
            item.tone === 'error' && styles.metricError,
          )}
        >
          <div className={styles.metricLabel}>{item.label}</div>
          <div className={styles.metricValue}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function StepPipeline({steps, activeId, onSelect, brokenStep}) {
  return (
    <div className={styles.pipeline}>
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          {i > 0 && <span className={styles.pipeArrow} aria-hidden="true">→</span>}
          <button
            type="button"
            className={clsx(
              styles.pipeNode,
              activeId === step.id && styles.pipeNodeActive,
              brokenStep === step.id && styles.pipeNodeBroken,
            )}
            onClick={() => onSelect(step.id)}
          >
            {step.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * @param {{ draw: (ctx: CanvasRenderingContext2D, w: number, h: number, theme: DemoCanvasTheme) => void; height?: number; className?: string }} props
 */
export function Canvas2D({draw, height = 220, className}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  const paint = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const cssW = Math.max(wrap.clientWidth, 240);
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const theme = readCanvasTheme(wrap);
    ctx.clearRect(0, 0, cssW, height);
    draw(ctx, cssW, height, theme);
  }, [draw, height]);

  useEffect(() => {
    paint();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => paint());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return undefined;
    const obs = new MutationObserver(paint);
    obs.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    return () => obs.disconnect();
  }, [paint]);

  return (
    <div ref={wrapRef} className={clsx(styles.canvasWrap, className)}>
      <canvas ref={canvasRef} className={styles.canvas} role="img" aria-hidden="true" />
    </div>
  );
}

export function SliderRow({label, value, displayValue, min, max, step = 1, onChange}) {
  return (
    <div className={styles.sliderRow}>
      <div className={styles.sliderRowLabel}>
        <span>{label}</span>
        {displayValue != null ? <span className={styles.sliderRowValue}>{displayValue}</span> : null}
      </div>
      <input
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Field({label, hint, children}) {
  return (
    <label className={styles.field}>
      {label ? <span className={styles.fieldLabel}>{label}</span> : null}
      {children}
      {hint ? <span className={styles.fieldHint}>{hint}</span> : null}
    </label>
  );
}

export function CodeBlock({children, className}) {
  return <pre className={clsx(styles.codeBlock, className)}>{children}</pre>;
}

export function SplitView({left, right}) {
  return (
    <div className={styles.splitView}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export function ActionBar({children, stretch}) {
  return <div className={stretch ? styles.actionBarStretch : styles.actionBar}>{children}</div>;
}

export function Hint({children}) {
  return <p className={styles.hint}>{children}</p>;
}

export function StatusBanner({tone = 'ok', children}) {
  return (
    <div className={tone === 'error' ? styles.statusBannerErr : styles.statusBannerOk}>{children}</div>
  );
}

export function CheckField({label, checked, onChange}) {
  return (
    <label className={styles.checkRow}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function BarMeter({live, dead, liveLabel = 'Live', deadLabel = 'Dead'}) {
  const total = Math.max(live + dead, 1);
  const livePct = (live / total) * 100;
  const deadPct = (dead / total) * 100;
  return (
    <Section>
      <div className={styles.barMeter} role="meter" aria-valuenow={livePct} aria-valuemin={0} aria-valuemax={100}>
        <div className={clsx(styles.barSegment, styles.barLive)} style={{width: `${livePct}%`}} title={liveLabel} />
        <div className={clsx(styles.barSegment, styles.barDead)} style={{width: `${deadPct}%`}} title={deadLabel} />
      </div>
      <div className={styles.barLegend}>
        <span>
          <span className={styles.legendDot} style={{background: 'color-mix(in srgb, var(--ifm-color-primary) 75%, var(--ifm-background-color))'}} />
          {liveLabel}: {livePct.toFixed(0)}%
        </span>
        <span>
          <span className={styles.legendDot} style={{background: 'color-mix(in srgb, var(--demo-error) 65%, var(--ifm-background-color))'}} />
          {deadLabel}: {deadPct.toFixed(0)}%
        </span>
      </div>
    </Section>
  );
}

export function splitCsvLine(line, sep) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === sep && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function parseCsv(text, sep = ',') {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return {headers: [], rows: [], errors: ['Пустой ввод']};
  const headers = splitCsvLine(lines[0], sep);
  const rows = [];
  const errors = [];
  lines.slice(1).forEach((line, idx) => {
    const cols = splitCsvLine(line, sep);
    if (cols.length !== headers.length) {
      errors.push(`Строка ${idx + 2}: ${cols.length} полей, ожидалось ${headers.length}`);
    }
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? '';
    });
    rows.push(row);
  });
  return {headers, rows, errors};
}

export function toHexByte(n) {
  return `0x${(n & 0xff).toString(16).toUpperCase().padStart(2, '0')}`;
}

export function intToBytes(value, littleEndian) {
  const v = Number(value) >>> 0;
  const bytes = [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
  return littleEndian ? bytes.reverse() : bytes;
}

export {toolStyles, styles, useBreakpoint};
