import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ANIMAL_IMPLS,
  BASE_ANIMAL,
  BASE_FIGURE,
  CONCEPT_TABS,
  FIGURE_IMPLS,
  MATH_OVERLOADS,
  formatAnimalCall,
  formatFigureCall,
  getAnimal,
  getFigure,
  runAnimalSound,
  runCanvasLoop,
  runFigureDraw,
  runMathAdd,
  runZooLoop,
} from '@/components/shared/kb/oopPolymorphismEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/OopPolymorphismDemo.module.css';

const SYNTAX_CLASS = {
  kw: shared.syntaxKw,
  type: shared.syntaxType,
  fn: shared.syntaxFn,
  str: shared.syntaxStr,
  p: shared.syntaxPlain,
};

function CodeBlock({lines}) {
  return (
    <div className={shared.codePanel}>
      {lines.map((line) => (
        <div
          key={line.id}
          className={clsx(shared.codeLine, line.highlight && shared.codeLineActive)}
        >
          <code>
            {line.parts.map((p, i) => (
              <span key={i} className={SYNTAX_CLASS[p.t] ?? shared.syntaxPlain}>
                {p.v}
              </span>
            ))}
          </code>
        </div>
      ))}
    </div>
  );
}

function BaseClassCard({base, activeMethod}) {
  return (
    <div className={styles.baseCard}>
      <h5 className={clsx(styles.cardTitle, styles.baseTitle)}>class {base.name}</h5>
      <div className={styles.memberRow}>
        <span>{activeMethod}</span>
        <span className={styles.sectionLabel}>базовая реализация</span>
      </div>
      <p style={{margin: '0.35rem 0 0', fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
        → {base.defaultOutput}
      </p>
    </div>
  );
}

function ChildClassCard({base, impl}) {
  return (
    <div className={styles.childCard}>
      <h5 className={clsx(styles.cardTitle, styles.childTitle)}>
        class {impl.className} : {base.name}
      </h5>
      <div className={styles.memberRow}>
        <span>{base.method}</span>
        <span className={styles.overrideBadge}>override</span>
      </div>
      <p style={{margin: '0.35rem 0 0', fontSize: '0.72rem'}}>→ {impl.output}</p>
    </div>
  );
}

function OopPolymorphismDemoInner() {
  const [tab, setTab] = useState('override');
  const [animalId, setAnimalId] = useState('cat');
  const [figureId, setFigureId] = useState('circle');
  const [overloadId, setOverloadId] = useState('int');
  const [argA, setArgA] = useState('');
  const [argB, setArgB] = useState('');
  const [lastOutput, setLastOutput] = useState('');
  const [loopSteps, setLoopSteps] = useState(null);
  const [logs, setLogs] = useState([]);

  const animal = getAnimal(animalId);
  const figure = getFigure(figureId);
  const overload = MATH_OVERLOADS.find((m) => m.id === overloadId) ?? MATH_OVERLOADS[0];
  const activeTab = CONCEPT_TABS.find((t) => t.id === tab) ?? CONCEPT_TABS[0];

  const addLog = (text) => {
    setLogs((prev) => [text, ...prev].slice(0, 8));
  };

  const invokeAnimal = () => {
    const out = runAnimalSound(animal);
    setLastOutput(out);
    setLoopSteps(null);
    addLog(`${formatAnimalCall(animal)} → ${out}`);
  };

  const invokeFigure = () => {
    const out = runFigureDraw(figure);
    setLastOutput(out);
    setLoopSteps(null);
    addLog(`${formatFigureCall(figure)} → ${out}`);
  };

  const runZoo = () => {
    const steps = runZooLoop();
    setLoopSteps(steps);
    setLastOutput(steps.map((s) => s.output).join(' · '));
    addLog(`цикл по Животное[] → ${steps.length} вызовов`);
  };

  const runCanvas = () => {
    const steps = runCanvasLoop();
    setLoopSteps(steps);
    setLastOutput(steps.map((s) => s.output).join(' · '));
    addLog(`цикл по Фигура[] → ${steps.length} вызовов`);
  };

  const invokeOverload = () => {
    const customA = argA.trim() === '' ? undefined : argA;
    const customB = argB.trim() === '' ? undefined : argB;
    const result = runMathAdd(overload, customA, customB);
    if (result.error) {
      setLastOutput(result.error);
      return;
    }
    const call =
      overload.id === 'int'
        ? `сложить(${result.a}, ${result.b})`
        : `сложить("${result.a}", "${result.b}")`;
    setLastOutput(result.output);
    setLoopSteps(null);
    addLog(`${call} → ${result.output}`);
  };

  const animalCodeLines = useMemo(() => {
    const lines = [
      {
        id: 'decl',
        highlight: true,
        parts: [
          {t: 'type', v: BASE_ANIMAL.name},
          {t: 'p', v: ` ${animal.varName} = new `},
          {t: 'type', v: animal.className},
          {t: 'p', v: '();'},
        ],
      },
    ];
    if (lastOutput && tab === 'override' && !loopSteps) {
      lines.push({
        id: 'call',
        highlight: true,
        parts: [{t: 'fn', v: formatAnimalCall(animal)}],
      });
      lines.push({
        id: 'out',
        parts: [
          {t: 'p', v: '// → '},
          {t: 'str', v: lastOutput},
        ],
      });
    }
    return lines;
  }, [animal, lastOutput, tab, loopSteps]);

  const figureCodeLines = useMemo(() => {
    const lines = [
      {
        id: 'decl',
        highlight: true,
        parts: [
          {t: 'type', v: BASE_FIGURE.name},
          {t: 'p', v: ` ${figure.varName} = new `},
          {t: 'type', v: figure.className},
          {t: 'p', v: '();'},
        ],
      },
    ];
    if (lastOutput && tab === 'shapes' && !loopSteps) {
      lines.push({
        id: 'call',
        highlight: true,
        parts: [{t: 'fn', v: formatFigureCall(figure)}],
      });
      lines.push({
        id: 'out',
        parts: [
          {t: 'p', v: '// → '},
          {t: 'str', v: lastOutput},
        ],
      });
    }
    return lines;
  }, [figure, lastOutput, tab, loopSteps]);

  const renderOverride = () => (
    <>
      <div className={styles.layout}>
        <div>
          <BaseClassCard base={BASE_ANIMAL} activeMethod={BASE_ANIMAL.method} />
          <div className={styles.hierarchyArrow}>▼ extends</div>
          <ChildClassCard base={BASE_ANIMAL} impl={animal} />
        </div>
        <div>
          <div className={styles.implPicker}>
            {ANIMAL_IMPLS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={clsx(styles.implBtn, animalId === a.id && styles.implBtnActive)}
                onClick={() => {
                  setAnimalId(a.id);
                  setLastOutput('');
                  setLoopSteps(null);
                }}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
          <p className={styles.dispatchNote}>
            Тип переменной — <strong>{BASE_ANIMAL.name}</strong>, фактический объект —{' '}
            <strong>{animal.className}</strong>. Вызов метода идёт по реальному типу.
          </p>
          <CodeBlock lines={animalCodeLines} />
          <div className={styles.methodBtns}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              onClick={invokeAnimal}
            >
              {formatAnimalCall(animal)}
            </button>
          </div>
          {lastOutput && !loopSteps && (
            <div className={styles.outputBox}>вывод → {lastOutput}</div>
          )}
        </div>
      </div>
      <div className={styles.loopPanel}>
        <div className={styles.loopTitle}>Полиморфный цикл</div>
        <p style={{margin: 0, fontSize: '0.78rem'}}>
          <code>Животное[] зоопарк = {'{'} new Кот(), new Собака(), new Кот() {'}'}</code>
        </p>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
          style={{marginTop: '0.45rem'}}
          onClick={runZoo}
        >
          for (z : зоопарк) z.издатьЗвук()
        </button>
        {loopSteps && tab === 'override' && (
          <ol className={styles.loopSteps}>
            {loopSteps.map((step) => (
              <li key={step.index}>
                [{step.index}] тип {step.declType}
                <span className={styles.typeTag}>объявление</span>, фактически{' '}
                {step.actualType}
                <span className={clsx(styles.typeTag, styles.actualTypeTag)}>runtime</span>
                {' → '}
                {step.output}
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );

  const renderShapes = () => (
    <>
      <div className={styles.layout}>
        <div>
          <BaseClassCard base={BASE_FIGURE} activeMethod={BASE_FIGURE.method} />
          <div className={styles.hierarchyArrow}>▼ extends</div>
          <ChildClassCard base={BASE_FIGURE} impl={figure} />
        </div>
        <div>
          <div className={styles.implPicker}>
            {FIGURE_IMPLS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={clsx(styles.implBtn, figureId === f.id && styles.implBtnActive)}
                onClick={() => {
                  setFigureId(f.id);
                  setLastOutput('');
                  setLoopSteps(null);
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
          <CodeBlock lines={figureCodeLines} />
          <div className={styles.methodBtns}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              onClick={invokeFigure}
            >
              {formatFigureCall(figure)}
            </button>
          </div>
          {lastOutput && !loopSteps && (
            <div className={styles.outputBox}>вывод → {lastOutput}</div>
          )}
        </div>
      </div>
      <div className={styles.loopPanel}>
        <div className={styles.loopTitle}>Один интерфейс — разные реализации</div>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
          onClick={runCanvas}
        >
          for (ф : фигуры) ф.нарисовать()
        </button>
        {loopSteps && tab === 'shapes' && (
          <ol className={styles.loopSteps}>
            {loopSteps.map((step) => (
              <li key={step.index}>
                {step.actualType}.{BASE_FIGURE.method.replace('()', '')}() → {step.output}
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );

  const renderOverload = () => (
    <>
      <p style={{margin: '0 0 0.55rem', fontSize: '0.82rem'}}>
        class <strong>Математика</strong> — два метода с одним именем, разные параметры:
      </p>
      {MATH_OVERLOADS.map((m) => (
        <button
          key={m.id}
          type="button"
          className={clsx(
            styles.overloadCard,
            overloadId === m.id && styles.overloadCardActive,
          )}
          onClick={() => {
            setOverloadId(m.id);
            setArgA('');
            setArgB('');
            setLastOutput('');
          }}
        >
          <div className={styles.overloadSig}>{m.sig}</div>
          <p style={{margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
            {m.detail} · пример: <code>{m.sampleCall}</code> → {m.output}
          </p>
        </button>
      ))}
      <div className={styles.formRow}>
        <label>
          a
          <input
            className="it-demo__input"
            placeholder={String(overload.args.a)}
            value={argA}
            onChange={(e) => setArgA(e.target.value)}
          />
        </label>
        <label>
          b
          <input
            className="it-demo__input"
            placeholder={String(overload.args.b)}
            value={argB}
            onChange={(e) => setArgB(e.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
        onClick={invokeOverload}
      >
        Вызвать {overload.sampleCall.split('(')[0]}(...)
      </button>
      {lastOutput && tab === 'overload' && (
        <div className={styles.outputBox}>вывод → {lastOutput}</div>
      )}
    </>
  );

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Полиморфизм: переопределение, единый интерфейс и перегрузка"
        subtitle="Как в примерах из статьи — Животное/Кот/Собака, Фигура/Круг/Прямоугольник и перегрузка сложить()"
      >
        <div className={styles.tabRow}>
          {CONCEPT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tabBtn, tab === t.id && styles.tabBtnActive)}
              onClick={() => {
                setTab(t.id);
                setLastOutput('');
                setLoopSteps(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{activeTab.hint}</p>
        {tab === 'override' && renderOverride()}
        {tab === 'shapes' && renderShapes()}
        {tab === 'overload' && renderOverload()}
        {logs.length > 0 && (
          <>
            <div className="it-demo__label" style={{marginTop: '0.85rem'}}>
              Журнал
            </div>
            <ul className={styles.log}>
              {logs.map((line, i) => (
                <li key={`${line}-${i}`}>{line}</li>
              ))}
            </ul>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default OopPolymorphismDemoInner;
