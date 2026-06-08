import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CAT_CLASS,
  CAT_PRESETS,
  CONCEPT_TABS,
  DEFAULT_CONSTRUCTOR_FORM,
  createCatInstance,
  formatConstructorCall,
  runCatMethod,
} from '@/components/shared/kb/oopBasicsEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/OopBasicsDemo.module.css';

const SYNTAX_CLASS = {
  kw: shared.syntaxKw,
  type: shared.syntaxType,
  fn: shared.syntaxFn,
  p: shared.syntaxPlain,
};

function ClassBlueprint({highlight}) {
  return (
    <div className={styles.classCard}>
      <h5 className={styles.classTitle}>class {CAT_CLASS.name}</h5>
      <div className={styles.sectionLabel}>Атрибуты (поля)</div>
      {CAT_CLASS.attributes.map((a) => (
        <div key={a.key} className={styles.fieldRow}>
          <span>
            <span className={highlight === 'attributes' ? shared.syntaxType : undefined}>{a.type}</span>{' '}
            <strong>{a.key}</strong>
          </span>
          <span className={styles.emptyValue}>—</span>
        </div>
      ))}
      <div className={styles.sectionLabel}>Методы</div>
      {CAT_CLASS.methods.map((m) => (
        <div key={m.key} className={styles.methodRow}>
          <span className={highlight === 'methods' ? shared.syntaxFn : undefined}>{m.key}()</span>
          <span className={styles.fieldType}>{m.returns}</span>
        </div>
      ))}
    </div>
  );
}

function CatCodeBlock({selected, callLine}) {
  const lines = useMemo(() => {
    const base = [
      {
        id: 'c1',
        parts: [
          {t: 'kw', v: 'class'},
          {t: 'p', v: ' '},
          {t: 'type', v: 'Cat'},
          {t: 'p', v: ' {'},
        ],
      },
      {id: 'c2', parts: [{t: 'p', v: '  String name; int age; String color; String breed;'}]},
      {id: 'c3', parts: [{t: 'p', v: '  void meow() { ... }  void sleep() { ... }'}]},
      {id: 'c4', parts: [{t: 'p', v: '}'}]},
    ];
    if (callLine) {
      base.push({id: 'call', highlight: true, parts: [{t: 'p', v: callLine}]});
    } else if (selected) {
      base.push({
        id: 'ref',
        highlight: true,
        parts: [
          {t: 'type', v: 'Cat'},
          {t: 'p', v: ' '},
          {t: 'fn', v: selected.varName},
          {t: 'p', v: ' → объект в памяти'},
        ],
      });
    }
    return base;
  }, [callLine, selected]);

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

function MemoryPanel({objects, selectedId, onSelect}) {
  return (
    <div className={styles.memoryZone}>
      <div className={styles.memoryTitle}>Память (экземпляры)</div>
      {objects.length === 0 ? (
        <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--demo-muted)'}}>
          Объектов пока нет — создайте через конструктор
        </p>
      ) : (
        objects.map((obj) => (
          <button
            key={obj.id}
            type="button"
            className={clsx(
              styles.objectCard,
              obj.id === selectedId && styles.objectCardSelected,
            )}
            onClick={() => onSelect(obj.id)}
          >
            <div className={styles.objectVar}>{obj.varName}</div>
            <div className={styles.objectMeta}>экземпляр class Cat</div>
            <div className={styles.fieldRow}>
              <span>name</span>
              <span>{obj.name}</span>
            </div>
            <div className={styles.fieldRow}>
              <span>color</span>
              <span>{obj.color}</span>
            </div>
            <div className={styles.fieldRow}>
              <span>age</span>
              <span>{obj.age}</span>
            </div>
            <div className={styles.fieldRow}>
              <span>breed</span>
              <span>{obj.breed}</span>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

function OopBasicsDemoInner() {
  const [tab, setTab] = useState('class');
  const [objects, setObjects] = useState(() => CAT_PRESETS.map((p) => createCatInstance(p)));
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(DEFAULT_CONSTRUCTOR_FORM);
  const [lastCall, setLastCall] = useState('');
  const [logs, setLogs] = useState([]);

  const selected = objects.find((o) => o.id === selectedId) ?? objects[0] ?? null;
  const activeTab = CONCEPT_TABS.find((t) => t.id === tab) ?? CONCEPT_TABS[0];
  const highlight =
    tab === 'attributes' ? 'attributes' : tab === 'methods' ? 'methods' : undefined;

  const addLog = (text) => {
    setLogs((prev) => [text, ...prev].slice(0, 8));
  };

  const createFromForm = () => {
    const inst = createCatInstance(form);
    setObjects((prev) => {
      const without = prev.filter((o) => o.varName !== inst.varName);
      return [...without, inst];
    });
    setSelectedId(inst.id);
    setLastCall(formatConstructorCall(form));
    addLog(`Создан объект ${inst.varName} (${inst.name})`);
    setTab('object');
  };

  const loadPreset = (preset) => {
    setForm({
      varName: preset.varName,
      name: preset.name,
      color: preset.color,
      age: preset.age,
      breed: preset.breed,
    });
    setTab('constructor');
  };

  const updateSelectedAttr = (key, value) => {
    if (!selected) return;
    setObjects((prev) =>
      prev.map((o) => {
        if (o.id !== selected.id) return o;
        if (key === 'age') return {...o, age: Number(value) || 0};
        return {...o, [key]: value};
      }),
    );
    addLog(`${selected.varName}.${key} = ${JSON.stringify(value)}`);
  };

  const invokeMethod = (methodKey) => {
    if (!selected) return;
    const msg = runCatMethod(methodKey, selected);
    addLog(`${selected.varName}.${methodKey}() → ${msg}`);
  };

  const renderPanel = () => {
    switch (tab) {
      case 'class':
        return (
          <div className={styles.layout}>
            <ClassBlueprint highlight={highlight} />
            <MemoryPanel
              objects={objects}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
          </div>
        );

      case 'constructor':
        return (
          <>
            <div className={styles.presetRow}>
              {CAT_PRESETS.map((p) => (
                <button
                  key={p.varName}
                  type="button"
                  className={styles.chip}
                  onClick={() => loadPreset(p)}
                >
                  {p.varName} — {p.name}
                </button>
              ))}
            </div>
            <div className={styles.formRow}>
              <label>
                Переменная
                <input
                  className="it-demo__input"
                  value={form.varName}
                  onChange={(e) => setForm((f) => ({...f, varName: e.target.value}))}
                />
              </label>
              <label>
                name
                <input
                  className="it-demo__input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                />
              </label>
              <label>
                age
                <input
                  type="number"
                  className="it-demo__input"
                  value={form.age}
                  onChange={(e) => setForm((f) => ({...f, age: Number(e.target.value)}))}
                />
              </label>
              <label>
                color
                <input
                  className="it-demo__input"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({...f, color: e.target.value}))}
                />
              </label>
              <label>
                breed
                <input
                  className="it-demo__input"
                  value={form.breed}
                  onChange={(e) => setForm((f) => ({...f, breed: e.target.value}))}
                />
              </label>
            </div>
            <CatCodeBlock callLine={formatConstructorCall(form)} />
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              style={{marginTop: '0.65rem'}}
              onClick={createFromForm}
            >
              Выполнить конструктор
            </button>
          </>
        );

      case 'object':
        return (
          <div className={styles.layout}>
            <div>
              <ClassBlueprint />
              <div className={styles.refArrow}>↓ instance of</div>
            </div>
            <MemoryPanel
              objects={objects}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
          </div>
        );

      case 'attributes':
        if (!selected) {
          return (
            <p className="it-demo__alert it-demo__alert--info">
              Сначала создайте объект на вкладке "Конструктор".
            </p>
          );
        }
        return (
          <>
            <p style={{margin: '0 0 0.65rem', fontSize: '0.82rem'}}>
              Редактируем поля объекта <code>{selected.varName}</code> — у других экземпляров
              значения не меняются.
            </p>
            <div className={styles.attrGrid}>
              <label>
                name
                <input
                  className="it-demo__input"
                  value={selected.name}
                  onChange={(e) => updateSelectedAttr('name', e.target.value)}
                />
              </label>
              <label>
                color
                <input
                  className="it-demo__input"
                  value={selected.color}
                  onChange={(e) => updateSelectedAttr('color', e.target.value)}
                />
              </label>
              <label>
                age
                <input
                  type="number"
                  className="it-demo__input"
                  value={selected.age}
                  onChange={(e) => updateSelectedAttr('age', e.target.value)}
                />
              </label>
              <label>
                breed
                <input
                  className="it-demo__input"
                  value={selected.breed}
                  onChange={(e) => updateSelectedAttr('breed', e.target.value)}
                />
              </label>
            </div>
            <div className={styles.layout} style={{marginTop: '0.75rem'}}>
              <MemoryPanel
                objects={objects}
                selectedId={selected.id}
                onSelect={setSelectedId}
              />
            </div>
          </>
        );

      case 'methods':
        if (!selected) {
          return (
            <p className="it-demo__alert it-demo__alert--info">
              Сначала создайте объект на вкладке "Конструктор".
            </p>
          );
        }
        return (
          <>
            <p style={{margin: '0 0 0.5rem', fontSize: '0.82rem'}}>
              Методы объявлены в классе <code>Cat</code>, вызываются у конкретного объекта:{' '}
              <code>{selected.varName}.meow()</code>
            </p>
            <div className={styles.methodBtns}>
              {CAT_CLASS.methods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                  onClick={() => invokeMethod(m.key)}
                >
                  {selected.varName}.{m.key}()
                </button>
              ))}
            </div>
            <ClassBlueprint highlight="methods" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Основы ООП: класс, объект, атрибуты, методы, конструктор"
        subtitle="Интерактивная модель на примере класса Cat из статьи"
      >
        <div className={styles.tabRow}>
          {CONCEPT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tabBtn, tab === t.id && styles.tabBtnActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{activeTab.hint}</p>

        {tab !== 'constructor' && tab !== 'attributes' && (
          <CatCodeBlock selected={selected} callLine={lastCall || undefined} />
        )}

        {renderPanel()}

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

export default OopBasicsDemoInner;
