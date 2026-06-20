import React from 'react';
import clsx from 'clsx';
import s from './InfraSecurityPlays.module.css';

export function InfraRoot({children, className}) {
  return <div className={clsx(s.isRoot, className)}>{children}</div>;
}

export function Section({label, children, className}) {
  return (
    <div className={clsx(s.section, className)}>
      {label && <p className={s.sectionLabel}>{label}</p>}
      {children}
    </div>
  );
}

export function ChipRow({children, scroll, className}) {
  return <div className={clsx(scroll ? s.chipRowScroll : s.chipRow, className)}>{children}</div>;
}

export function Chip({active, warn, className, children, ...props}) {
  return (
    <button
      type="button"
      className={clsx(s.chip, active && s.chipActive, warn && s.chipWarn, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function FlowStepper({steps, activeIndex, onSelect, scroll}) {
  return (
    <div className={clsx(s.flowTrack, scroll && s.flowTrackScroll)} role="tablist">
      {steps.map((step, i) => (
        <button
          key={step.id ?? step.label ?? i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          className={clsx(
            s.flowStep,
            i === activeIndex && s.flowStepActive,
            i < activeIndex && s.flowStepDone,
          )}
          onClick={() => onSelect?.(i)}
        >
          {step.label ?? step}
        </button>
      ))}
    </div>
  );
}

export function Pipeline({steps, activeIndex, onSelect, vertical}) {
  return (
    <div className={clsx(s.pipeline, vertical && s.pipelineVertical)}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          {i > 0 && <span className={s.pipelineArrow} aria-hidden>→</span>}
          <div
            role="button"
            tabIndex={0}
            className={clsx(
              s.pipelineNode,
              i > activeIndex && s.pipelineNodeMuted,
              i === activeIndex && s.pipelineNodeActive,
            )}
            onClick={() => onSelect?.(i)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.(i)}
          >
            {label}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export function StatPanel({rows, className}) {
  return (
    <div className={clsx(s.panel, s.statGrid, className)}>
      {rows.map((row) => (
        <div key={row.key} className={s.statRow}>
          <span className={s.statKey}>{row.key}</span>
          <span className={s.statVal}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CodeGrid({panes}) {
  return (
    <div className={s.codeGrid}>
      {panes.map((pane) => (
        <div key={pane.label} className={s.codePane}>
          <p className={s.sectionLabel}>{pane.label}</p>
          <pre className={clsx(s.codeBlock, pane.diff && s.codeDiff)}>{pane.code}</pre>
        </div>
      ))}
    </div>
  );
}

export function StatusPill({tone = 'neutral', children}) {
  const toneClass =
    tone === 'success'
      ? s.pillSuccess
      : tone === 'warn'
        ? s.pillWarn
        : tone === 'error'
          ? s.pillError
          : s.pillNeutral;
  return (
    <span className={clsx(s.pill, toneClass)}>
      <span className={s.pillDot} aria-hidden />
      {children}
    </span>
  );
}

export function Alert({tone = 'info', children, className}) {
  const toneClass =
    tone === 'success'
      ? s.alertSuccess
      : tone === 'warn'
        ? s.alertWarn
        : tone === 'error'
          ? s.alertError
          : null;
  return <p className={clsx(s.alert, toneClass, className)}>{children}</p>;
}

export function LayerList({layers, enabled, results, onToggle}) {
  return (
    <div className={s.layerList}>
      {layers.map((layer) => {
        const on = enabled[layer.id];
        const result = results?.find((r) => r.id === layer.id);
        return (
          <div
            key={layer.id}
            className={clsx(
              s.layerRow,
              !on && s.layerSkip,
              result && !result.skipped && (result.passed ? s.layerPass : s.layerFail),
            )}
          >
            <input
              type="checkbox"
              checked={on}
              onChange={() => onToggle(layer.id)}
              aria-label={layer.label}
            />
            <div>
              <div className={s.layerLabel}>{layer.label}</div>
              <div className={s.layerLog}>{layer.log}</div>
            </div>
            <span className={s.layerStatus}>
              {!on && '—'}
              {result && !result.skipped && (result.passed ? '✓' : '✗')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function BudgetMeter({value, max, tone}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const fillClass =
    tone === 'bad' ? s.meterBad : tone === 'warn' ? s.meterWarn : s.meterOk;
  return (
    <div className={s.meter} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={clsx(s.meterFill, fillClass)} style={{width: `${pct}%`}} />
    </div>
  );
}

export function SliderField({label, value, displayValue, min, max, step, onChange}) {
  return (
    <div className={s.sliderField}>
      <label className={s.sliderLabel}>
        <span>{label}</span>
        <span>{displayValue ?? value}</span>
      </label>
      <input
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

export function DataTable({columns, rows}) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key ?? row[0]}>
              {row.cells.map((cell, i) => (
                <td key={columns[i]}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardGrid({items, activeId, onSelect}) {
  return (
    <div className={s.cardGrid}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={clsx(s.card, activeId === item.id && s.cardActive)}
          onClick={() => onSelect(item.id)}
        >
          <div className={s.cardTitle}>{item.title}</div>
          {item.meta && <div className={s.cardMeta}>{item.meta}</div>}
        </button>
      ))}
    </div>
  );
}

export function SbomGraph({packages, services, pkgId, onSelectPkg}) {
  const affectedIds = new Set(
    services.filter((svc) => svc.deps.includes(pkgId)).map((svc) => svc.id),
  );
  const selected = packages.find((p) => p.id === pkgId);

  return (
    <>
      <div className={s.graph}>
        <div className={s.graphCol}>
          <p className={s.sectionLabel}>Пакеты (SBOM)</p>
          {packages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(
                s.graphNode,
                s.graphNodePkg,
                pkgId === p.id && s.graphNodePkgActive,
                p.cve && pkgId === p.id && s.graphNodeHit,
              )}
              onClick={() => onSelectPkg(p.id)}
            >
              {p.label}
              {p.cve && ` · ${p.severity}`}
            </button>
          ))}
        </div>
        <div className={s.graphBridge} aria-hidden>
          →
        </div>
        <div className={s.graphCol}>
          <p className={s.sectionLabel}>Сервисы</p>
          {services.map((svc) => (
            <div
              key={svc.id}
              className={clsx(
                s.graphNode,
                !affectedIds.has(svc.id) && pkgId && s.graphNodeMuted,
                affectedIds.has(svc.id) && s.graphNodeHit,
              )}
            >
              {svc.label}
            </div>
          ))}
        </div>
      </div>
      {selected?.cve && (
        <Alert tone="warn">
          Blast radius: {selected.cve} затрагивает {affectedIds.size} сервис(ов). Обновите образы и пересоберите SBOM.
        </Alert>
      )}
    </>
  );
}

export function LeakList({items, on, onToggle, total, max}) {
  const tone = total > 50 ? 'bad' : total > 25 ? 'warn' : 'ok';
  return (
    <>
      {items.map((item) => (
        <label
          key={item.id}
          className={clsx(s.leakRow, on[item.id] && s.leakRowOn)}
        >
          <span className={s.leakLabel}>
            <input type="checkbox" checked={on[item.id]} onChange={() => onToggle(item.id)} />
            {item.label}
          </span>
          <span className={s.leakCost}>${item.cost}/мес</span>
        </label>
      ))}
      <BudgetMeter value={total} max={max} tone={tone} />
      <div className={s.totalRow}>
        <span>Итого</span>
        <span className={s.totalAmount}>${total}/мес</span>
      </div>
    </>
  );
}

export function QuizPanel({children, actions, feedback, feedbackOk}) {
  return (
    <div className={s.quizCard}>
      {children}
      <div className={s.quizActions}>{actions}</div>
      {feedback && (
        <p className={clsx(s.resultLine, feedbackOk ? s.resultOk : s.resultBad)}>{feedback}</p>
      )}
    </div>
  );
}

export function ActionRow({children, className}) {
  return <div className={clsx(s.actionRow, className)}>{children}</div>;
}

export function StackList({items}) {
  return (
    <ul className={s.stackList}>
      {items.map((item) => (
        <li key={item} className={s.stackItem}>
          <span className={s.stackBullet} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Timeline({events, maxDay}) {
  return (
    <ul className={s.timeline}>
      {events.map((e) => (
        <li key={e.day} className={clsx(s.timelineItem, e.day === maxDay && s.timelineItemActive)}>
          <strong>D{e.day}</strong> — {e.event}: {e.action}
        </li>
      ))}
    </ul>
  );
}

export {s as infraStyles};
