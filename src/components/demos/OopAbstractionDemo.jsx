import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ABSTRACT_TRANSPORT,
  CONCEPT_TABS,
  FLYABLE_EXAMPLE,
  TRANSPORT_IMPLS,
  formatClientCall,
  getImpl,
  runHonk,
  runMove,
} from '@/components/shared/kb/oopAbstractionEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/OopAbstractionDemo.module.css';

const SYNTAX_CLASS = {
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

function AbstractTransportCard({highlight}) {
  return (
    <div className={styles.abstractCard}>
      <h5 className={styles.abstractTitle}>abstract class {ABSTRACT_TRANSPORT.name}</h5>
      <div className={styles.sectionLabel}>Поля</div>
      {ABSTRACT_TRANSPORT.fields.map((f) => (
        <div key={f.key} className={styles.methodRow}>
          <span>
            private <strong>{f.key}</strong>
          </span>
        </div>
      ))}
      <div className={styles.sectionLabel}>Методы</div>
      {ABSTRACT_TRANSPORT.abstractMethods.map((m) => (
        <div key={m.key} className={styles.methodRow}>
          <span style={highlight === 'abstract' ? TOKEN.fn : undefined}>
            abstract {m.sig}
          </span>
          <span className={styles.abstractBadge}>нет тела</span>
        </div>
      ))}
      {ABSTRACT_TRANSPORT.concreteMethods.map((m) => (
        <div key={m.key} className={styles.methodRow}>
          <span style={highlight === 'concrete' ? TOKEN.fn : undefined}>{m.sig}</span>
          <span className={styles.hiddenBadge}>реализован</span>
        </div>
      ))}
      <p style={{margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
        new Transport() — ошибка компиляции
      </p>
    </div>
  );
}

function ImplCard({impl, active, onSelect}) {
  return (
    <button
      type="button"
      className={clsx(styles.implCard, active && styles.implCardActive)}
      onClick={() => onSelect(impl.id)}
    >
      <div className={styles.implTitle}>
        {impl.icon} class {impl.className}
      </div>
      <div className={styles.methodRow}>
        <span>@Override move()</span>
        <span style={{fontSize: '0.7rem', opacity: 0.85}}>{impl.moveOutput}</span>
      </div>
    </button>
  );
}

function OopAbstractionDemoInner() {
  const [tab, setTab] = useState('client');
  const [implId, setImplId] = useState('car');
  const [showDetails, setShowDetails] = useState(false);
  const [triedAbstract, setTriedAbstract] = useState(false);
  const [lastOutput, setLastOutput] = useState('');
  const [logs, setLogs] = useState([]);

  const impl = getImpl(implId);
  const activeTab = CONCEPT_TABS.find((t) => t.id === tab) ?? CONCEPT_TABS[0];

  const addLog = (text) => {
    setLogs((prev) => [text, ...prev].slice(0, 8));
  };

  const invoke = (method) => {
    const out = method === 'move' ? runMove(impl) : runHonk(impl);
    setLastOutput(out);
    addLog(`${formatClientCall(impl, method)} → ${out}`);
  };

  const clientCodeLines = useMemo(() => {
    const lines = [
      {
        id: 'decl',
        highlight: true,
        parts: [
          {t: 'type', v: 'Transport'},
          {t: 'p', v: ` ${impl.varName} = new `},
          {t: 'type', v: impl.className},
          {t: 'p', v: '('},
          {t: 'str', v: `"${impl.presetName}"`},
          {t: 'p', v: ');'},
        ],
      },
      {id: 'blank', parts: [{t: 'p', v: ''}]},
    ];
    if (lastOutput) {
      const call = logs[0]?.split(' → ')[0] ?? formatClientCall(impl, 'move');
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
  }, [impl, lastOutput, logs]);

  const renderClient = () => (
    <>
      <p style={{margin: '0 0 0.5rem', fontSize: '0.82rem'}}>
        Тип переменной — <code>Transport</code>, фактический объект —{' '}
        <code>{impl.className}</code>. Клиенту не нужно знать, как устроен двигатель.
      </p>
      <div className={styles.chipRow}>
        {TRANSPORT_IMPLS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={clsx(styles.chip, implId === t.id && styles.chipActive)}
            onClick={() => {
              setImplId(t.id);
              setLastOutput('');
            }}
          >
            {t.icon} {t.className}
          </button>
        ))}
        <button
          type="button"
          className={clsx(styles.chip, styles.chipDisabled)}
          onClick={() => {
            setTriedAbstract(true);
            addLog('new Transport() — ошибка: класс абстрактный');
          }}
          title="Нельзя создать экземпляр абстрактного класса"
        >
          Transport ✕
        </button>
      </div>

      <CodeBlock lines={clientCodeLines} />

      <div className={styles.methodBtns}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
          onClick={() => invoke('move')}
        >
          {impl.varName}.move()
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
          onClick={() => invoke('honk')}
        >
          {impl.varName}.honk()
        </button>
      </div>

      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={showDetails}
          onChange={(e) => setShowDetails(e.target.checked)}
        />
        Показать скрытую реализацию ("как" внутри)
      </label>

      {showDetails && (
        <div className={styles.detailPanel}>
          <strong>Скрыто от клиента — move()</strong>
          {impl.moveDetail}
          <strong style={{marginTop: '0.45rem'}}>Скрыто от клиента — honk()</strong>
          {impl.honkDetail}
        </div>
      )}

      {lastOutput && (
        <div className={styles.outputBox}>System.out.println → {lastOutput}</div>
      )}

      {triedAbstract && (
        <div className={styles.errorBox}>
          Transport t = new Transport(); // ✕ Cannot instantiate abstract class Transport
        </div>
      )}
    </>
  );

  const renderHierarchy = () => (
    <div className={styles.layout}>
      <div>
        <AbstractTransportCard highlight="abstract" />
        <div className={styles.hierarchyArrow}>▲ extends</div>
        <div style={{display: 'grid', gap: '0.45rem'}}>
          {TRANSPORT_IMPLS.map((t) => (
            <ImplCard
              key={t.id}
              impl={t}
              active={implId === t.id}
              onSelect={setImplId}
            />
          ))}
        </div>
      </div>
      <div>
        <p style={{margin: '0 0 0.5rem', fontSize: '0.82rem'}}>
          Выбран: <code>{impl.className}</code>. Общий метод <code>honk()</code> унаследован
          из <code>Transport</code>, <code>move()</code> переопределён.
        </p>
        <AbstractTransportCard highlight="concrete" />
        <div className={styles.methodBtns} style={{marginTop: '0.65rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={() => invoke('move')}
          >
            Проверить move()
          </button>
        </div>
        {lastOutput && <div className={styles.outputBox}>{lastOutput}</div>}
      </div>
    </div>
  );

  const renderInterface = () => (
    <div className={styles.layout}>
      <div className={styles.ifaceCard}>
        <h5 className={styles.ifaceTitle}>interface {FLYABLE_EXAMPLE.iface}</h5>
        <div className={styles.methodRow}>
          <span>void {FLYABLE_EXAMPLE.ifaceMethod}</span>
          <span className={styles.abstractBadge}>контракт</span>
        </div>
        <p style={{margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
          Нет полей и реализованных методов — только сигнатуры.
        </p>
      </div>
      <div>
        <div className={styles.implCard}>
          <div className={styles.implTitle}>
            class {FLYABLE_EXAMPLE.impl} implements {FLYABLE_EXAMPLE.iface}
          </div>
          <div className={styles.methodRow}>
            <span>fly()</span>
            <span style={{fontSize: '0.7rem'}}>{FLYABLE_EXAMPLE.flyOutput}</span>
          </div>
        </div>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
          style={{marginTop: '0.65rem'}}
          onClick={() => {
            setLastOutput(FLYABLE_EXAMPLE.flyOutput);
            addLog(`bird.fly() → ${FLYABLE_EXAMPLE.flyOutput}`);
          }}
        >
          bird.fly()
        </button>
        {showDetails ? (
          <div className={styles.detailPanel} style={{marginTop: '0.65rem'}}>
            <strong>Внутри fly()</strong>
            {FLYABLE_EXAMPLE.flyDetail}
          </div>
        ) : (
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={showDetails}
              onChange={(e) => setShowDetails(e.target.checked)}
            />
            Показать реализацию
          </label>
        )}
        {lastOutput && tab === 'interface' && (
          <div className={styles.outputBox} style={{marginTop: '0.5rem'}}>
            {lastOutput}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Абстракция: Transport, абстрактные методы и интерфейс"
        subtitle="Скрываем &quot;как&quot;, оставляем &quot;что&quot; — как в примерах из статьи"
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
                setTriedAbstract(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{activeTab.hint}</p>

        {tab === 'client' && renderClient()}
        {tab === 'hierarchy' && renderHierarchy()}
        {tab === 'interface' && renderInterface()}

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

export default OopAbstractionDemoInner;
