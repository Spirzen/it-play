import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  BASE_TRANSPORT,
  CAR_CLASS,
  CONCEPT_TABS,
  DEFAULT_CAR,
  MULTI_CAR,
  MULTI_PARENTS,
  STARTABLE_IFACE,
  createCarState,
  formatCall,
  runCarDrive,
  runCarStart,
  runInterfaceStart,
  runMultiDrive,
  runTransportStart,
} from '@/components/shared/kb/oopInheritanceEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/OopInheritanceDemo.module.css';

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

function TransportCard() {
  return (
    <div className={styles.baseCard}>
      <h5 className={clsx(styles.cardTitle, styles.baseTitle)}>
        class {BASE_TRANSPORT.name}
      </h5>
      <div className={styles.sectionLabel}>Поля</div>
      {BASE_TRANSPORT.fields.map((f) => (
        <div key={f.key} className={styles.memberRow}>
          <span>
            {f.type} <strong>{f.key}</strong>
          </span>
        </div>
      ))}
      <div className={styles.sectionLabel}>Методы</div>
      {BASE_TRANSPORT.methods.map((m) => (
        <div key={m.key} className={styles.memberRow}>
          <span>{m.sig}</span>
        </div>
      ))}
    </div>
  );
}

function CarCard() {
  return (
    <div className={styles.childCard}>
      <h5 className={clsx(styles.cardTitle, styles.childTitle)}>
        class {CAR_CLASS.name} : {CAR_CLASS.extends}
      </h5>
      <div className={styles.sectionLabel}>Унаследовано от {CAR_CLASS.extends}</div>
      {BASE_TRANSPORT.fields.map((f) => (
        <div key={f.key} className={styles.memberRow}>
          <span>
            {f.type} <strong>{f.key}</strong>
          </span>
          <span className={styles.inheritedBadge}>наслед.</span>
        </div>
      ))}
      {BASE_TRANSPORT.methods.map((m) => (
        <div key={m.key} className={styles.memberRow}>
          <span>{m.sig}</span>
          <span className={styles.inheritedBadge}>наслед.</span>
        </div>
      ))}
      <div className={styles.sectionLabel}>Добавлено в подклассе</div>
      {CAR_CLASS.extraFields.map((f) => (
        <div key={f.key} className={styles.memberRow}>
          <span>
            {f.type} <strong>{f.key}</strong>
          </span>
          <span className={styles.newBadge}>новое</span>
        </div>
      ))}
      {CAR_CLASS.extraMethods.map((m) => (
        <div key={m.key} className={styles.memberRow}>
          <span>{m.sig}</span>
          <span className={styles.newBadge}>новое</span>
        </div>
      ))}
      <div className={styles.sectionLabel}>Переопределено</div>
      {CAR_CLASS.overrideMethods.map((m) => (
        <div key={m.key} className={styles.memberRow}>
          <span>{m.sig}</span>
          <span className={styles.overrideBadge}>override</span>
        </div>
      ))}
    </div>
  );
}

function StatePanel({car}) {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateTitle}>Экземпляр {car.varName}</div>
      <div className={styles.stateRow}>
        <span>модель (наслед.)</span>
        <span>{car.model}</span>
      </div>
      <div className={styles.stateRow}>
        <span>год (наслед.)</span>
        <span>{car.year}</span>
      </div>
      <div className={styles.stateRow}>
        <span>количество_колёс</span>
        <span>{car.wheels}</span>
      </div>
    </div>
  );
}

function OopInheritanceDemoInner() {
  const [tab, setTab] = useState('subclass');
  const [car, setCar] = useState(() => createCarState(DEFAULT_CAR));
  const [form, setForm] = useState(DEFAULT_CAR);
  const [lastOutput, setLastOutput] = useState('');
  const [logs, setLogs] = useState([]);

  const activeTab = CONCEPT_TABS.find((t) => t.id === tab) ?? CONCEPT_TABS[0];

  const addLog = (text) => {
    setLogs((prev) => [text, ...prev].slice(0, 8));
  };

  const invoke = (fn, callLabel) => {
    const out = fn();
    setLastOutput(out);
    addLog(`${callLabel} → ${out}`);
  };

  const carCodeLines = useMemo(() => {
    const lines = [
      {
        id: 'decl',
        highlight: true,
        parts: [
          {t: 'type', v: CAR_CLASS.name},
          {t: 'p', v: ` ${car.varName} = new ${CAR_CLASS.name}(`},
          {t: 'str', v: `"${car.model}"`},
          {t: 'p', v: `, ${car.year}, ${car.wheels});`},
        ],
      },
    ];
    if (lastOutput && logs[0]) {
      const call = logs[0].split(' → ')[0];
      lines.push({
        id: 'call',
        highlight: true,
        parts: [{t: 'p', v: call}],
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
  }, [car, lastOutput, logs]);

  const renderSubclass = () => (
    <>
      <div className={styles.layout}>
        <div>
          <TransportCard />
          <div className={styles.hierarchyArrow}>▼ extends</div>
          <CarCard />
        </div>
        <div>
          <StatePanel car={car} />
          <div className={styles.formRow}>
            <label>
              модель
              <input
                className="it-demo__input"
                value={form.model}
                onChange={(e) => setForm((f) => ({...f, model: e.target.value}))}
              />
            </label>
            <label>
              год
              <input
                type="number"
                className="it-demo__input"
                value={form.year}
                onChange={(e) => setForm((f) => ({...f, year: e.target.value}))}
              />
            </label>
            <label>
              колёса
              <input
                type="number"
                className="it-demo__input"
                value={form.wheels}
                onChange={(e) => setForm((f) => ({...f, wheels: e.target.value}))}
              />
            </label>
          </div>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => setCar(createCarState(form))}
          >
            Обновить экземпляр
          </button>
        </div>
      </div>
      <CodeBlock lines={carCodeLines} />
      <div className={styles.methodBtns}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
          onClick={() =>
            invoke(() => runCarStart(), formatCall(car.varName, 'запустить()'))
          }
        >
          {car.varName}.запустить()
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
          onClick={() => invoke(() => runCarDrive(), formatCall(car.varName, 'ехать()'))}
        >
          {car.varName}.ехать()
        </button>
      </div>
      {lastOutput && tab === 'subclass' && (
        <div className={styles.outputBox}>вывод → {lastOutput}</div>
      )}
    </>
  );

  const renderOverride = () => (
    <>
      <p style={{margin: '0 0 0.5rem', fontSize: '0.82rem'}}>
        Один метод <code>запустить()</code> в родителе и подклассе — при вызове у{' '}
        <code>{car.varName}</code> срабатывает переопределённая версия.
      </p>
      <div className={styles.compareGrid}>
        <div className={clsx(styles.compareCard, styles.compareParent)}>
          <strong>Транспорт (родитель)</strong>
          <div className={styles.methodBtns}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              onClick={() =>
                invoke(() => runTransportStart(), 'transport.запустить()')
              }
            >
              transport.запустить()
            </button>
          </div>
          {lastOutput && tab === 'override' && logs[0]?.startsWith('transport') && (
            <div className={styles.outputBox}>{lastOutput}</div>
          )}
        </div>
        <div className={clsx(styles.compareCard, styles.compareChild)}>
          <strong>Автомобиль (подкласс)</strong>
          <div className={styles.methodBtns}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              onClick={() =>
                invoke(() => runCarStart(), formatCall(car.varName, 'запустить()'))
              }
            >
              {car.varName}.запустить()
            </button>
          </div>
          {lastOutput && tab === 'override' && !logs[0]?.startsWith('transport') && (
            <div className={styles.outputBox}>{lastOutput}</div>
          )}
        </div>
      </div>
    </>
  );

  const renderInterface = () => (
    <div className={styles.layout}>
      <div className={styles.ifaceCard}>
        <h5 className={styles.ifaceTitle}>interface {STARTABLE_IFACE.name}</h5>
        {STARTABLE_IFACE.methods.map((m) => (
          <div key={m.key} className={styles.memberRow}>
            <span>void {m.sig}</span>
            <span className={styles.inheritedBadge}>контракт</span>
          </div>
        ))}
        <p style={{margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
          Без реализации — только сигнатура метода.
        </p>
      </div>
      <div>
        <div className={styles.childCard}>
          <h5 className={clsx(styles.cardTitle, styles.childTitle)}>
            class {CAR_CLASS.name} : {STARTABLE_IFACE.name}
          </h5>
          <div className={styles.memberRow}>
            <span>запустить()</span>
            <span className={styles.newBadge}>реализация</span>
          </div>
        </div>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
          style={{marginTop: '0.65rem'}}
          onClick={() =>
            invoke(() => runInterfaceStart(), `${car.varName}.запустить()`)
          }
        >
          {car.varName}.запустить()
        </button>
        {lastOutput && tab === 'interface' && (
          <div className={styles.outputBox} style={{marginTop: '0.5rem'}}>
            {lastOutput}
          </div>
        )}
      </div>
    </div>
  );

  const renderMulti = () => {
    const drive = runMultiDrive();
    return (
      <>
        <div className={styles.multiParents}>
          {MULTI_PARENTS.map((p) => (
            <div key={p.id} className={styles.parentMini}>
              <strong>class {p.name}</strong>
              <div className={styles.memberRow}>
                <span>{p.method}</span>
                <span style={{fontSize: '0.72rem'}}>→ {p.output}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.hierarchyArrow}>
          ▲ {MULTI_CAR.extends.join(' + ')}
        </div>
        <div className={styles.childCard}>
          <h5 className={clsx(styles.cardTitle, styles.childTitle)}>
            class {MULTI_CAR.name} : {MULTI_CAR.extends.join(', ')}
          </h5>
          <div className={styles.memberRow}>
            <span>{MULTI_CAR.method}</span>
            <span className={styles.newBadge}>свой метод</span>
          </div>
        </div>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
          style={{marginTop: '0.65rem'}}
          onClick={() => {
            setLastOutput(drive.summary);
            addLog(`авто.ехать() → ${drive.steps.join(' | ')}`);
          }}
        >
          авто.ехать()
        </button>
        {lastOutput && tab === 'multi' && (
          <>
            <ol className={styles.flowSteps}>
              {drive.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className={styles.outputBox}>{lastOutput}</div>
          </>
        )}
        <p style={{margin: '0.65rem 0 0', fontSize: '0.75rem', color: 'var(--demo-muted)'}}>
          В Java множественное наследование классов запрещено; в Python порядок MRO решает,
          какой метод вызвать.
        </p>
      </>
    );
  };

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Наследование: Транспорт, Автомобиль и иерархия типов"
        subtitle="Как в примерах из статьи — базовый класс, подкласс, переопределение и множественное наследование"
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
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{activeTab.hint}</p>
        {tab === 'subclass' && renderSubclass()}
        {tab === 'override' && renderOverride()}
        {tab === 'interface' && renderInterface()}
        {tab === 'multi' && renderMulti()}
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

export default OopInheritanceDemoInner;
