import React, {memo, useCallback, useId, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import SpirzenOnlineToolLink from '@/components/demos/SpirzenOnlineToolLink';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  PATTERNS,
  RELATION_KINDS,
  createClass,
  createEmptyModel,
  applyPattern,
  syncAutoRelations,
  generateClassCode,
  relationStroke,
  edgeAnchors,
  memberPreview,
  nextId,
} from '@/components/shared/kb/archiStylerEngine';
import styles from '@/components/demos/ArchiStylerPlay.module.css';

const MEMBER_KINDS = [
  {id: 'Property', label: 'Свойство'},
  {id: 'Method', label: 'Метод'},
  {id: 'Field', label: 'Поле'},
];

function cardHeight(cls) {
  const n = (cls.members || []).length;
  return Math.max(88, 44 + Math.min(n, 14) * 17 + (n > 14 ? 18 : 0));
}

function withCardHeight(cls, patch = {}) {
  const merged = {...cls, ...patch};
  merged.h = cardHeight(merged);
  return merged;
}

const ClassDiagramEdges = memo(function ClassDiagramEdges({
  relations,
  classById,
  markerId,
  onRemoveRelation,
}) {
  return (
    <svg className={styles.svgLayer}>
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="context-stroke" />
        </marker>
      </defs>
      {relations.map((rel) => {
        const from = classById.get(rel.from);
        const to = classById.get(rel.to);
        if (!from || !to) return null;
        const {x1, y1, x2, y2} = edgeAnchors(from, to);
        const mx = (x1 + x2) / 2;
        const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
        const stroke = relationStroke(rel.kind);
        const dash = rel.kind === 'Implements' ? '4 3' : undefined;
        const label = RELATION_KINDS.find((k) => k.id === rel.kind)?.label ?? rel.kind;
        return (
          <g
            key={rel.id}
            className={styles.edgeGroup}
            role="button"
            tabIndex={0}
            aria-label={`${label}: ${from.name} → ${to.name}. Клик — удалить`}
            onClick={(e) => onRemoveRelation(rel.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRemoveRelation(rel.id, e);
              }
            }}
          >
            <path className={styles.edgeHit} d={d} />
            <path
              className={styles.edgeVisible}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeDasharray={dash}
              markerEnd={`url(#${markerId})`}
            />
            <text
              className={styles.edgeLabel}
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 - 6}
              textAnchor="middle"
              pointerEvents="none"
            >
              {rel.kind}
            </text>
          </g>
        );
      })}
    </svg>
  );
});

function ArchiStylerPlayInner({
  title = 'ArchiStyler — планировщик классов',
  subtitle = 'Добавляйте классы, члены и связи на диаграмме',
  defaultLanguage = 'csharp',
  defaultPattern = null,
  namespace = 'App.Demo',
  showOnlineLink = true,
}) {
  const initial = useMemo(() => {
    if (defaultPattern) {
      const applied = applyPattern(defaultPattern);
      return {
        namespace,
        language: defaultLanguage,
        classes: applied.classes.map((c) => withCardHeight(c)),
        relations: syncAutoRelations(applied.classes, applied.relations),
      };
    }
    const empty = createEmptyModel(namespace);
    return {
      namespace,
      language: defaultLanguage,
      classes: empty.classes,
      relations: empty.relations,
    };
  }, [defaultLanguage, defaultPattern, namespace]);

  const [language, setLanguage] = useState(initial.language);
  const [classes, setClasses] = useState(initial.classes);
  const [relations, setRelations] = useState(initial.relations);
  const [selectedId, setSelectedId] = useState(initial.classes[0]?.id ?? null);
  const [connectFrom, setConnectFrom] = useState(null);
  const [defaultRel, setDefaultRel] = useState('Uses');
  const [showCode, setShowCode] = useState(false);
  const canvasRef = useRef(null);
  const markerId = `as-arrow-${useId().replace(/:/g, '')}`;
  const {copy, copied} = useCopyToClipboard();

  const selected = classes.find((c) => c.id === selectedId) ?? null;
  const classById = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);
  const dragRafRef = useRef(null);
  const dragPendingRef = useRef(null);

  const loadPattern = (patternId) => {
    const applied = applyPattern(patternId);
    const sized = applied.classes.map((c) => withCardHeight(c));
    setClasses(sized);
    setRelations(syncAutoRelations(sized, applied.relations));
    setSelectedId(sized[0]?.id ?? null);
    setConnectFrom(null);
  };

  const removeRelation = (relId, e) => {
    e?.stopPropagation();
    setRelations((prev) => prev.filter((r) => r.id !== relId));
  };

  const updateClass = useCallback((id, patch) => {
    const positionOnly = Object.keys(patch).every((k) => k === 'x' || k === 'y');
    setClasses((prev) => {
      const next = prev.map((c) => (c.id === id ? withCardHeight(c, patch) : c));
      if (!positionOnly) {
        setRelations((rels) => syncAutoRelations(next, rels));
      }
      return next;
    });
  }, []);

  const moveClass = useCallback((id, x, y) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? {...c, x, y} : c)));
  }, []);

  const flushDragMove = useCallback(() => {
    dragRafRef.current = null;
    const pending = dragPendingRef.current;
    if (!pending) return;
    dragPendingRef.current = null;
    moveClass(pending.id, pending.x, pending.y);
  }, [moveClass]);

  const scheduleDragMove = useCallback(
    (id, x, y) => {
      dragPendingRef.current = {id, x, y};
      if (dragRafRef.current == null) {
        dragRafRef.current = requestAnimationFrame(flushDragMove);
      }
    },
    [flushDragMove],
  );

  const addClass = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cls = withCardHeight(
      createClass({
        x: rect ? rect.width / 2 - 84 : 120,
        y: rect ? rect.height / 2 - 56 : 100,
      }),
    );
    setClasses((prev) => [...prev, cls]);
    setSelectedId(cls.id);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setClasses((prev) => prev.filter((c) => c.id !== selectedId));
    setRelations((prev) => prev.filter((r) => r.from !== selectedId && r.to !== selectedId));
    setSelectedId(null);
    setConnectFrom(null);
  };

  const clearAll = () => {
    const empty = createEmptyModel(namespace);
    setClasses(empty.classes);
    setRelations(empty.relations);
    setSelectedId(null);
    setConnectFrom(null);
  };

  const addMember = (kind) => {
    if (!selected) return;
    const base =
      kind === 'Method'
        ? {kind, name: 'DoWork', returnType: 'void', access: 'Public', generateStub: true}
        : {kind, name: kind === 'Property' ? 'Name' : '_field', type: 'string', access: 'Public'};
    updateClass(selected.id, {members: [...(selected.members || []), base]});
  };

  const updateMember = (index, patch) => {
    if (!selected) return;
    const members = (selected.members || []).map((m, i) => (i === index ? {...m, ...patch} : m));
    updateClass(selected.id, {members});
  };

  const removeMember = (index) => {
    if (!selected) return;
    updateClass(selected.id, {
      members: (selected.members || []).filter((_, i) => i !== index),
    });
  };

  const onCardPointerDown = (e, cls) => {
    e.stopPropagation();
    if (connectFrom) {
      if (connectFrom !== cls.id) {
        setRelations((prev) => {
          if (prev.some((r) => r.from === connectFrom && r.to === cls.id && r.kind === defaultRel)) {
            return prev;
          }
          return [...prev, {id: nextId('rel'), from: connectFrom, to: cls.id, kind: defaultRel}];
        });
      }
      setConnectFrom(null);
      return;
    }
    setSelectedId(cls.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const ox = cls.x;
    const oy = cls.y;

    const onMove = (ev) => {
      scheduleDragMove(cls.id, ox + ev.clientX - startX, oy + ev.clientY - startY);
    };
    const onUp = () => {
      if (dragRafRef.current != null) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = null;
      }
      flushDragMove();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const code = selected
    ? generateClassCode(selected, {namespace, language})
    : '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard title={title} subtitle={subtitle}>
        <div className={styles.toolbar}>
          <button type="button" className={styles.toolBtn} onClick={addClass}>
            + Класс
          </button>
          <select
            className={styles.select}
            defaultValue=""
            aria-label="Загрузить шаблон"
            onChange={(e) => {
              const id = e.target.value;
              if (id) loadPattern(id);
              e.target.value = '';
            }}
          >
            <option value="">Шаблон…</option>
            {PATTERNS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={clsx(styles.toolBtn, connectFrom && styles.toolBtnOn)}
            onClick={() => setConnectFrom(connectFrom ? null : selectedId)}
            disabled={!selectedId}
            title={connectFrom ? 'Кликните по целевому классу' : 'Связь от выбранного класса'}
          >
            {connectFrom ? '→ выберите цель' : 'Связать'}
          </button>
          <select
            className={styles.select}
            value={defaultRel}
            onChange={(e) => setDefaultRel(e.target.value)}
            aria-label="Тип связи"
          >
            {RELATION_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
          {selected && (
            <>
              <span className={styles.toolbarSep} aria-hidden />
              {MEMBER_KINDS.map((mk) => (
                <button
                  key={mk.id}
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => addMember(mk.id)}
                >
                  + {mk.label}
                </button>
              ))}
            </>
          )}
          <span className={styles.toolbarSpacer} />
          <select
            className={styles.select}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Язык генерации"
          >
            <option value="csharp">C#</option>
            <option value="java">Java</option>
          </select>
          <button type="button" className={styles.toolBtn} onClick={clearAll}>
            Очистить
          </button>
          <button
            type="button"
            className={clsx(styles.toolBtn, styles.toolBtnDanger)}
            onClick={removeSelected}
            disabled={!selectedId}
          >
            Удалить
          </button>
        </div>

        <div
          className={clsx(styles.canvasWrap, connectFrom && styles.canvasWrapConnect)}
          ref={canvasRef}
          onClick={(e) => {
            if (e.target.closest(`.${styles.classCard}`)) return;
            setSelectedId(null);
            setConnectFrom(null);
          }}
          role="presentation"
        >
          <div className={styles.canvas}>
            <ClassDiagramEdges
              relations={relations}
              classById={classById}
              markerId={markerId}
              onRemoveRelation={removeRelation}
            />

            {classes.length === 0 && (
              <p className={styles.canvasHint}>Нажмите "+ Класс", затем добавьте свойства и методы в панели ниже</p>
            )}

            {classes.map((cls) => (
              <div
                key={cls.id}
                className={clsx(
                  styles.classCard,
                  cls.isInterface && styles.classCardInterface,
                  selectedId === cls.id && styles.classCardSelected,
                )}
                style={{left: cls.x, top: cls.y, width: cls.w, height: cls.h}}
                onPointerDown={(e) => onCardPointerDown(e, cls)}
              >
                <div className={styles.classHead}>{cls.name}</div>
                <div className={styles.classBody}>
                  {memberPreview(cls, 12).map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected ? (
          <div className={styles.editBar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.editBarHead}>
              <label className={styles.editName}>
                <span>Класс</span>
                <input
                  type="text"
                  value={selected.name}
                  onChange={(e) => updateClass(selected.id, {name: e.target.value})}
                />
              </label>
              <label className={styles.editCheck}>
                <input
                  type="checkbox"
                  checked={selected.isInterface}
                  onChange={(e) => updateClass(selected.id, {isInterface: e.target.checked})}
                />
                interface
              </label>
              <label className={styles.editCheck}>
                <input
                  type="checkbox"
                  checked={selected.isAbstract}
                  onChange={(e) => updateClass(selected.id, {isAbstract: e.target.checked})}
                />
                abstract
              </label>
              <label className={styles.editInline}>
                <span>extends</span>
                <input
                  type="text"
                  value={selected.baseType || ''}
                  placeholder="—"
                  onChange={(e) => updateClass(selected.id, {baseType: e.target.value})}
                />
              </label>
              <button
                type="button"
                className={styles.toolBtn}
                onClick={() => setShowCode((v) => !v)}
              >
                {showCode ? 'Скрыть код' : 'Код'}
              </button>
              {showCode && (
                <button type="button" className={styles.toolBtn} onClick={() => copy(code)}>
                  {copied ? 'Скопировано' : 'Копировать'}
                </button>
              )}
            </div>

            <div className={styles.memberList}>
              {(selected.members || []).length === 0 ? (
                <p className={styles.memberEmpty}>Нет членов — кнопки "+ Свойство / Метод / Поле" в панели сверху</p>
              ) : (
                (selected.members || []).map((m, idx) => (
                  <div key={`${m.kind}-${m.name}-${idx}`} className={styles.memberRow}>
                    <span className={styles.memberKind}>{m.kind}</span>
                    <input
                      type="text"
                      className={styles.memberInput}
                      value={m.name}
                      aria-label="Имя"
                      onChange={(e) => updateMember(idx, {name: e.target.value})}
                    />
                    {m.kind === 'Method' ? (
                      <input
                        type="text"
                        className={styles.memberInput}
                        value={m.returnType || 'void'}
                        aria-label="Возвращаемый тип"
                        onChange={(e) => updateMember(idx, {returnType: e.target.value})}
                      />
                    ) : (
                      <input
                        type="text"
                        className={styles.memberInput}
                        value={m.type || ''}
                        aria-label="Тип"
                        placeholder="тип"
                        onChange={(e) => updateMember(idx, {type: e.target.value})}
                      />
                    )}
                    <button
                      type="button"
                      className={styles.memberRemove}
                      onClick={() => removeMember(idx)}
                      aria-label="Удалить член"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {showCode && <pre className={styles.codeBox}>{code}</pre>}
          </div>
        ) : (
          <p className={styles.hint}>
            Перетаскивайте карточки. "Связать" — от выбранного класса к цели; клик по линии связи — удалить.
            Шаблон — в выпадающем списке. Namespace: <code>{namespace}</code>
          </p>
        )}
        {showOnlineLink && <SpirzenOnlineToolLink toolId="archiStyler" />}
      </DemoCard>
    </DemoShell>
  );
}

export default ArchiStylerPlayInner;
