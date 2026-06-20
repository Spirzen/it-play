import React from 'react';
import clsx from 'clsx';
import s from './projectPlay.module.css';

export {s as projectStyles};

export function ProjectStack({children, className}) {
  return <div className={clsx(s.stack, className)}>{children}</div>;
}

export function ProjectPanel({title, children, className}) {
  return (
    <div className={clsx(s.panel, className)}>
      {title && <span className={s.panelTitle}>{title}</span>}
      {children}
    </div>
  );
}

export function ProjectMetrics({items}) {
  return (
    <div className={s.metrics}>
      {items.map((item) => (
        <div
          key={item.label}
          className={clsx(
            s.metric,
            item.tone === 'warn' && s.metricWarn,
            item.tone === 'error' && s.metricError,
            item.tone === 'success' && s.metricSuccess,
          )}
        >
          <span className={s.metricValue}>{item.value}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

export function ProjectSlider({label, value, onChange, min, max, step = 1, disabled}) {
  return (
    <div className={s.sliderBlock}>
      <label className={s.sliderLabel}>{label}</label>
      <input
        className={s.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}

export function ProjectChipRow({chips}) {
  return (
    <div className={s.chipRow}>
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          className={clsx(s.chip, chip.active && s.chipActive)}
          onClick={chip.onClick}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export function ProjectBtnRow({children, className}) {
  return <div className={clsx(s.btnRow, className)}>{children}</div>;
}

export function ProjectMessage({tone = 'info', children}) {
  const toneClass =
    tone === 'ok' ? s.messageOk : tone === 'warn' ? s.messageWarn : tone === 'err' ? s.messageErr : s.messageInfo;
  return <p className={clsx(s.message, toneClass)}>{children}</p>;
}

export function ProjectHint({children}) {
  return <p className={s.hint}>{children}</p>;
}

export function ProjectBurndown({days, points, total, day}) {
  return (
    <div className={s.burndownWrap}>
      <div className={s.burndownLegend}>
        <span>
          <span className={s.legendDot} style={{background: 'var(--it-primary)'}} />
          Факт
        </span>
        <span>
          <span className={s.legendDot} style={{background: 'var(--demo-warning)'}} />
          Идеал
        </span>
      </div>
      <div className={s.burndownChart}>
        {Array.from({length: days + 1}, (_, i) => {
          const actual = points[i];
          const ideal = Math.max(0, Math.round(total - (total / days) * i));
          const showActual = actual !== null && actual !== undefined;
          return (
            <div key={i} className={s.burndownCol} title={showActual ? `День ${i}: ${actual} SP` : `День ${i}`}>
              {showActual && (
                <div
                  className={s.burndownBar}
                  style={{height: `${Math.max(4, (actual / total) * 100)}%`}}
                />
              )}
              <div
                className={s.burndownIdeal}
                style={{bottom: `${Math.max(2, (ideal / total) * 100)}%`}}
              />
              <span className={s.burndownDay}>{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectTaskList({tasks}) {
  return (
    <ul className={s.taskList}>
      {tasks.map((t) => (
        <li
          key={t.id}
          className={clsx(s.taskItem, t.done && s.taskDone, t.creep && s.taskCreep)}
        >
          <span>{t.title}</span>
          <span className={s.taskPoints}>{t.points} SP</span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectKanbanBoard({columns, wipOverColumn}) {
  return (
    <div className={s.boardScroll}>
      <div className={s.board}>
        {columns.map((col) => (
          <div
            key={col.id}
            className={clsx(s.column, col.id === wipOverColumn && s.columnWipOver)}
          >
            <div className={s.columnHeader}>{col.label}</div>
            {col.tasks.map((t) => (
              <div
                key={t.id}
                className={clsx(
                  s.taskCard,
                  t.cls === 'expedite' && s.taskCardExpedite,
                  t.cls === 'intangible' && s.taskCardIntangible,
                )}
              >
                {t.title}
                <span className={s.taskCardTag}>{t.cls}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectStoryCard({title, hint}) {
  return (
    <div className={s.storyCard}>
      <strong>{title}</strong>
      {hint && <p className={s.panelMuted} style={{marginTop: '0.35rem'}}>{hint}</p>}
    </div>
  );
}

export function ProjectPokerDeck({deck, selected, revealed, onSelect}) {
  return (
    <div className={s.pokerGrid}>
      {deck.map((n) => (
        <button
          key={n}
          type="button"
          className={clsx(s.pokerCard, selected === n && s.pokerCardSelected)}
          onClick={() => onSelect(n)}
          disabled={revealed}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export function ProjectTeamVotes({members, votes, userPick}) {
  return (
    <div className={s.teamGrid}>
      {members.map((m, i) => (
        <div
          key={m}
          className={clsx(s.teamVote, userPick === votes[i] && s.teamVoteMatch)}
        >
          {m}: <strong>{votes[i]}</strong>
          {userPick === votes[i] && ' ✓'}
        </div>
      ))}
    </div>
  );
}

export function ProjectTimeline({steps, currentIdx, done}) {
  return (
    <div className={s.timeline}>
      {steps.map((step, i) => (
        <div
          key={step.id}
          className={clsx(
            s.timelineStep,
            i === currentIdx && !done && s.timelineActive,
            i < currentIdx && s.timelineDone,
          )}
        >
          <span className={s.stepNum}>{i + 1}</span>
          <div>
            <strong>{step.label}</strong>
            {step.desc && (
              <div
                className={s.panelMuted}
                style={{marginTop: '0.15rem'}}
                dangerouslySetInnerHTML={{__html: step.desc}}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectChoiceList({choices, onPick}) {
  return (
    <div className={s.choiceList}>
      {choices.map((c) => (
        <button
          key={c.id}
          type="button"
          className={clsx('it-demo__btn it-demo__btn--secondary', s.choiceBtn)}
          onClick={() => onPick(c)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export function ProjectLog({items}) {
  if (!items.length) return null;
  return (
    <ul className={s.logList}>
      {items.map((line, i) => (
        <li key={i} className={s.logItem}>
          {line}
        </li>
      ))}
    </ul>
  );
}

export function ProjectMeter({label, value, max = 100, tone}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={s.meterRow}>
      <span>{label}</span>
      <div className={s.meterTrack}>
        <div
          className={clsx(
            s.meterFill,
            tone === 'warn' && s.meterFillWarn,
            tone === 'error' && s.meterFillErr,
          )}
          style={{width: `${pct}%`}}
        />
      </div>
      <span>{value}%</span>
    </div>
  );
}

export function ProjectScopeBar({scope, capacity}) {
  const pct = Math.min(100, (scope / capacity) * 100);
  const over = scope > capacity;
  return (
    <div className={s.dualMeter}>
      <div className={s.meterRow}>
        <span>Scope</span>
        <div className={s.scopeBar}>
          <div
            className={clsx(s.scopeFill, over && s.scopeFillOver)}
            style={{width: `${Math.min(100, pct)}%`}}
          />
          <div className={s.scopeCapacity} style={{left: '100%'}} title={`Capacity: ${capacity} SP`} />
        </div>
        <span>
          {scope}/{capacity}
        </span>
      </div>
    </div>
  );
}

export function ProjectFlagSplit({newPct, killed}) {
  const legacy = 100 - newPct;
  return (
    <div className={clsx(s.flagSplit, killed && s.flagKilled)}>
      <div className={clsx(s.flagSegment, s.flagNew)} style={{flex: `${newPct || 1} 1 0`}}>
        New {newPct}%
      </div>
      <div className={clsx(s.flagSegment, s.flagLegacy)} style={{flex: `${legacy || 1} 1 0`}}>
        Legacy {legacy}%
      </div>
    </div>
  );
}

export function ProjectStatusRow({status, statusClass, chain}) {
  return (
    <div className={s.statusRow}>
      <span className={clsx(s.statusBadge, statusClass)}>{status}</span>
      {chain && <span className={s.chain}>Цепочка: {chain}</span>}
    </div>
  );
}

export function ProjectForm({children}) {
  return <div className={s.form}>{children}</div>;
}

export function ProjectField({label, children}) {
  return (
    <div className={s.field}>
      <label>{label}</label>
      {children}
    </div>
  );
}

export function ProjectCodeBlock({children}) {
  return <pre className={s.codeSnippet}>{children}</pre>;
}

export function ProjectMatrix({headers, rows, renderCell}) {
  return (
    <div className={s.matrixScroll}>
      <div className={s.matrix}>
        <table>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {row.cells.map((cell, ci) => (
                  <td key={ci}>{renderCell(cell, row.index, ci)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProjectSummaryPills({items}) {
  return (
    <div className={s.summaryRow}>
      {items.map((item) => (
        <div key={item.label} className={s.summaryPill}>
          <strong>{item.value}</strong> {item.label}
        </div>
      ))}
    </div>
  );
}

export function ProjectFactorGrid({factors, active, onToggle}) {
  return (
    <div className={s.factorGrid}>
      {factors.map((f) => (
        <button
          key={f.id}
          type="button"
          className={clsx(s.factorCard, active[f.id] > 1 && s.factorCardActive)}
          onClick={() => onToggle(f.id)}
        >
          <div className={s.factorLabel}>{f.label}</div>
          <p className={s.factorHint}>{f.desc}</p>
        </button>
      ))}
    </div>
  );
}

export function ProjectCheckGrid({columns}) {
  return (
    <div className={s.checkGrid}>
      {columns.map((col) => (
        <div key={col.title} className={s.checkCol}>
          <p className="it-demo__label">
            {col.title}
            <span className={s.checkProgress}>
              {col.checked}/{col.total}
            </span>
          </p>
          {col.items.map((item) => (
            <label
              key={item.id}
              className={clsx(s.checkRow, item.checked && s.checkRowDone)}
            >
              <input type="checkbox" checked={item.checked} onChange={item.onChange} />
              {item.label}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProjectToggleGroup({label, options, value, onChange, disabled}) {
  return (
    <>
      {label && <p className="it-demo__label">{label}</p>}
      <div className={s.toggleGroup}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={clsx('it-demo__btn', s.toggleBtn, value === o.id && 'it-demo__btn--primary')}
            onClick={() => onChange(o.id)}
            disabled={disabled}
          >
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}

export const ADR_STATUS_CLASS = {
  Proposed: s.statusProposed,
  Accepted: s.statusAccepted,
  Deprecated: s.statusDeprecated,
  Superseded: s.statusSuperseded,
};

export const FIT_GAP_CLASS = {
  fit: s.cellFit,
  partial: s.cellPartial,
  gap: s.cellGap,
};
