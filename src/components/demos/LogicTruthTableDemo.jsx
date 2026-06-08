import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  LOGIC_PRESETS,
  buildTruthTable,
  formatBool,
  rowsEquivalent,
} from '@/components/shared/kb/logicEngine';
import styles from '@/components/demos/LogicTruthTableDemo.module.css';

function LogicTruthTableDemoInner() {
  const [presetId, setPresetId] = useState('demorgan-and');
  const [customExpr, setCustomExpr] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const preset = LOGIC_PRESETS.find((p) => p.id === presetId) ?? LOGIC_PRESETS[0];
  const expr = useCustom ? customExpr : preset.expr;

  const main = useMemo(() => {
    try {
      return {ok: true, data: buildTruthTable(expr)};
    } catch (e) {
      return {ok: false, error: e.message};
    }
  }, [expr]);

  const equiv = useMemo(() => {
    if (!preset.equivalent || useCustom) return null;
    try {
      const left = buildTruthTable(preset.expr);
      const right = buildTruthTable(preset.equivalent);
      return rowsEquivalent(left.rows, right.rows);
    } catch {
      return null;
    }
  }, [preset, useCustom]);

  const applyPreset = (id) => {
    setPresetId(id);
    setUseCustom(false);
    const p = LOGIC_PRESETS.find((x) => x.id === id);
    if (p) setCustomExpr(p.expr);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Таблица истинности"
        subtitle="Булевы операции, законы де Моргана и эквивалентные формы условий в коде"
      >
        <div className={styles.layout}>
          <div className={styles.toolbar}>
            <select
              className={styles.select}
              value={presetId}
              onChange={(e) => applyPreset(e.target.value)}
              aria-label="Выбор выражения"
            >
              {LOGIC_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <label className={styles.toolbar}>
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
              />
              Свой ввод
            </label>
          </div>

          <input
            className={clsx(styles.select, styles.exprInput)}
            value={useCustom ? customExpr : preset.expr}
            onChange={(e) => {
              setCustomExpr(e.target.value);
              setUseCustom(true);
            }}
            placeholder="A AND B, NOT (A OR B) …"
            spellCheck={false}
          />

          {!main.ok ? (
            <p className={styles.error}>{main.error}</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {main.data.vars.map((v) => (
                      <th key={v}>{v}</th>
                    ))}
                    <th>Результат</th>
                  </tr>
                </thead>
                <tbody>
                  {main.data.rows.map((row, i) => (
                    <tr
                      key={i}
                      className={row.result ? styles.rowTrue : styles.rowFalse}
                    >
                      {main.data.vars.map((v) => (
                        <td key={v}>{formatBool(row.env[v])}</td>
                      ))}
                      <td>{formatBool(row.result)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preset.equivalent && !useCustom && equiv != null && (
            <div className={styles.equiv}>
              <span
                className={clsx(
                  styles.equivBadge,
                  !equiv && styles.equivBadgeFail,
                )}
              >
                {equiv ? 'Эквивалентно' : 'Не эквивалентно'}
              </span>
              <div>
                <strong>Исходное:</strong> {preset.expr}
                <br />
                <strong>После преобразования:</strong> {preset.equivalent}
              </div>
              {preset.code && <pre className={styles.code}>{preset.code}</pre>}
            </div>
          )}

          {preset.code && (useCustom || !preset.equivalent) && (
            <pre className={styles.code}>В коде: {preset.code}</pre>
          )}

          <p className={styles.note}>{preset.note}</p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LogicTruthTableDemoInner;
