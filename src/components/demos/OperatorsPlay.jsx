import React, {useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ARITY_TABS,
  buildPrioritySteps,
  evalBinary,
  evalTernary,
  evalUnary,
  formatOperandValue,
  formatResult,
  PRIORITY_WRONG,
} from '@/components/shared/kb/operatorsEngine';
import {resolveOperatorsPreset} from '@/components/shared/kb/operatorsPresets';
import styles from '@/components/demos/OperatorsPlay.module.css';

function OperandChip({value, expr}) {
  return (
    <div className={clsx(styles.chip, styles.operand)}>
      <span className={styles.chipRole}>операнд</span>
      <span className={styles.chipValue}>{value}</span>
      {expr && <span className={styles.chipExpr}>{expr}</span>}
    </div>
  );
}

function OperatorChip({symbol, label}) {
  return (
    <div className={clsx(styles.chip, styles.operator)}>
      <span className={styles.chipRole}>оператор</span>
      <span className={styles.chipValue}>{symbol}</span>
      <span className={styles.chipExpr}>{label}</span>
    </div>
  );
}

function OperationChip({result}) {
  return (
    <div className={clsx(styles.chip, styles.operation)}>
      <span className={styles.chipRole}>операция</span>
      <span className={styles.chipValue}>{result}</span>
      <span className={styles.chipExpr}>результат</span>
    </div>
  );
}

function BinaryDemo({binaryOps, languageLabel}) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);
  const [opId, setOpId] = useState(binaryOps[0]?.id ?? '+');

  useEffect(() => {
    if (!binaryOps.some((o) => o.id === opId)) {
      setOpId(binaryOps[0]?.id ?? '+');
    }
  }, [binaryOps, opId]);

  const {op, result} = evalBinary(opId, a, b, binaryOps);
  const expr = `${formatOperandValue(a)} ${op.symbol} ${formatOperandValue(b)}`;

  return (
    <>
      <div className={styles.exprBar} aria-label="Выражение">
        <span className={styles.exprOperand}>{formatOperandValue(a)}</span>{' '}
        <span className={styles.exprOperator}>{op.symbol}</span>{' '}
        <span className={styles.exprOperand}>{formatOperandValue(b)}</span>{' '}
        <span className={styles.exprOperator}>=</span>{' '}
        <span className={styles.exprResult}>{formatResult(result)}</span>
      </div>

      <div className={styles.controlsRow}>
        <label className={styles.control}>
          <span className="it-demo__label">Операнд a</span>
          <input
            type="number"
            className="it-demo__input"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
          />
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">Оператор</span>
          <select className="it-demo__select" value={opId} onChange={(e) => setOpId(e.target.value)}>
            {binaryOps.map((o) => (
              <option key={o.id} value={o.id}>
                {o.symbol} — {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">Операнд b</span>
          <input
            type="number"
            className="it-demo__input"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.diagram}>
        <OperandChip value={formatOperandValue(a)} expr="a" />
        <span className={styles.arrow} aria-hidden>
          →
        </span>
        <OperatorChip symbol={op.symbol} label={op.label} />
        <span className={styles.arrow} aria-hidden>
          →
        </span>
        <OperandChip value={formatOperandValue(b)} expr="b" />
        <span className={styles.arrow} aria-hidden>
          ⇒
        </span>
        <OperationChip result={formatResult(result)} />
      </div>

      <p className="it-demo__alert it-demo__alert--info" style={{marginBottom: 0}}>
        Бинарный оператор связывает <strong>два операнда</strong>; результат вычисления —{' '}
        <strong>операция</strong>. Запись <code>{expr}</code>
        {languageLabel ? ` (${languageLabel})` : ''} — выражение; после вычисления получаем{' '}
        <code>{formatResult(result)}</code>.
      </p>
    </>
  );
}

function UnaryDemo({unaryOps, languageLabel}) {
  const [x, setX] = useState(7);
  const [opId, setOpId] = useState(unaryOps[0]?.id ?? 'neg');

  useEffect(() => {
    if (!unaryOps.some((o) => o.id === opId)) {
      setOpId(unaryOps[0]?.id ?? 'neg');
    }
  }, [unaryOps, opId]);

  const {op, result} = evalUnary(opId, x, unaryOps);
  const displayX = formatOperandValue(x);
  const expr = `${op.symbol}${displayX}`;

  return (
    <>
      <div className={styles.exprBar}>
        <span className={styles.exprOperator}>{op.symbol}</span>
        <span className={styles.exprOperand}>{displayX}</span>
        <span className={styles.exprOperator}> = </span>
        <span className={styles.exprResult}>{formatResult(result)}</span>
      </div>

      <div className={styles.controlsRow}>
        <label className={styles.control}>
          <span className="it-demo__label">Операнд x</span>
          <input
            type="number"
            className="it-demo__input"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
          />
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">Оператор</span>
          <select className="it-demo__select" value={opId} onChange={(e) => setOpId(e.target.value)}>
            {unaryOps.map((o) => (
              <option key={o.id} value={o.id}>
                {o.symbol} — {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.diagram}>
        <OperandChip value={displayX} expr="x" />
        <span className={styles.arrow}>→</span>
        <OperatorChip symbol={op.symbol} label={op.label} />
        <span className={styles.arrow}>⇒</span>
        <OperationChip result={formatResult(result)} />
      </div>

      <p className="it-demo__alert it-demo__alert--info" style={{marginBottom: 0}}>
        Унарный оператор действует на <strong>один операнд</strong>: <code>{expr}</code>
        {languageLabel ? ` (${languageLabel})` : ''}. Арность оператора — 1.
      </p>
    </>
  );
}

function TernaryDemo({hint}) {
  const [condition, setCondition] = useState(true);
  const [whenTrue, setWhenTrue] = useState(100);
  const [whenFalse, setWhenFalse] = useState(0);

  const {branch, result} = evalTernary(condition, whenTrue, whenFalse);

  return (
    <>
      <div className={styles.exprBar}>
        <span className={styles.exprOperand}>{condition ? 'true' : 'false'}</span>
        <span className={styles.exprOperator}> ? </span>
        <span className={styles.exprOperand}>{whenTrue}</span>
        <span className={styles.exprOperator}> : </span>
        <span className={styles.exprOperand}>{whenFalse}</span>
        <span className={styles.exprOperator}> = </span>
        <span className={styles.exprResult}>{formatResult(result)}</span>
      </div>

      <div className={styles.controlsRow}>
        <label className={styles.control}>
          <span className="it-demo__label">Условие</span>
          <select
            className="it-demo__select"
            value={condition ? 'true' : 'false'}
            onChange={(e) => setCondition(e.target.value === 'true')}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">если истина</span>
          <input
            type="number"
            className="it-demo__input"
            value={whenTrue}
            onChange={(e) => setWhenTrue(Number(e.target.value))}
          />
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">если ложь</span>
          <input
            type="number"
            className="it-demo__input"
            value={whenFalse}
            onChange={(e) => setWhenFalse(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.diagram}>
        <OperandChip value={condition ? 'true' : 'false'} expr="условие" />
        <span className={styles.arrow}>?</span>
        <OperandChip value={String(whenTrue)} expr="ветка true" />
        <span className={styles.arrow}>:</span>
        <OperandChip value={String(whenFalse)} expr="ветка false" />
        <span className={styles.arrow}>⇒</span>
        <OperationChip result={formatResult(result)} />
      </div>

      <p className="it-demo__alert it-demo__alert--info" style={{marginBottom: 0}}>
        Тернарный оператор <code>?:</code> принимает <strong>три операнда</strong>. Сейчас условие{' '}
        {condition ? 'истинно' : 'ложно'}, выбрана ветка <code>{formatResult(branch)}</code>.
        {hint ? <> {hint}</> : null}
      </p>
    </>
  );
}

function PriorityDemo() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(4);
  const [stepIdx, setStepIdx] = useState(2);

  const steps = useMemo(() => buildPrioritySteps(a, b, c), [a, b, c]);
  const wrong = PRIORITY_WRONG(a, b, c);
  const correct = steps[steps.length - 1].partial;
  const highlight = steps[Math.min(stepIdx, steps.length - 1)].highlight;

  return (
    <>
      <div className={styles.controlsRow}>
        <label className={styles.control}>
          <span className="it-demo__label">a</span>
          <input
            type="number"
            className="it-demo__input"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
          />
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">b</span>
          <input
            type="number"
            className="it-demo__input"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
          />
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">c</span>
          <input
            type="number"
            className="it-demo__input"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.priorityExpr}>
        <span className={highlight === 'add' || highlight === 'done' ? styles.priorityHighlightAdd : undefined}>
          {a}
        </span>
        {' + '}
        <span
          className={
            highlight === 'mul' || highlight === 'done' ? styles.priorityHighlightMul : undefined
          }
        >
          {b} * {c}
        </span>
        {' = '}
        <span className={styles.priorityHighlightDone}>{correct}</span>
      </div>

      <ul className={styles.stepList}>
        {steps.map((s, idx) => (
          <li key={s.step}>
            <button
              type="button"
              className={clsx(styles.stepItem, stepIdx === idx && styles.stepItemActive)}
              style={{width: '100%', textAlign: 'left', cursor: 'pointer', background: 'inherit'}}
              onClick={() => setStepIdx(idx)}
            >
              <span className={styles.stepNum}>{s.step}</span>
              <span>{s.text}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.compareBox}>
        <div className={styles.compareCard}>
          <strong>Правильно (приоритет *)</strong>
          <code>
            {a} + ({b} * {c}) = {correct}
          </code>
        </div>
        <div className={styles.compareCard}>
          <strong>Ошибочно ((a + b) * c)</strong>
          <code>
            ({a} + {b}) * {c} = {wrong}
          </code>
        </div>
      </div>
    </>
  );
}

function OperatorsPlayInner({language}) {
  const preset = useMemo(() => resolveOperatorsPreset(language), [language]);
  const tabs = useMemo(() => {
    const list = ARITY_TABS.filter((t) => t.id !== 'ternary' || preset.showTernary !== false);
    return list;
  }, [preset.showTernary]);

  const [tab, setTab] = useState('binary');

  useEffect(() => {
    if (!tabs.some((t) => t.id === tab)) {
      setTab(tabs[0]?.id ?? 'binary');
    }
  }, [tabs, tab]);

  const subtitle = preset.label
    ? `Интерактивно (${preset.label}): операнды, операторы и результат`
    : 'Интерактивно: кто на кого действует и какой получается результат';

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Операнды, операторы и операции" subtitle={subtitle}>
        <div className="it-demo__tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
              title={t.hint}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'binary' && (
          <BinaryDemo binaryOps={preset.binaryOps} languageLabel={preset.label} />
        )}
        {tab === 'unary' && <UnaryDemo unaryOps={preset.unaryOps} languageLabel={preset.label} />}
        {tab === 'ternary' && preset.showTernary !== false && (
          <TernaryDemo hint={preset.ternaryHint} />
        )}
        {tab === 'priority' && <PriorityDemo />}

        {preset.showTernary === false && preset.ternaryHint && tab !== 'ternary' && (
          <p className="it-demo__alert it-demo__alert--info" style={{marginTop: '1rem', marginBottom: 0}}>
            {preset.ternaryHint}
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default OperatorsPlayInner;
