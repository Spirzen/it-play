import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  ENTITIES,
  ENTITY_KEYS,
  ER_NODES,
  ORM_QUERIES,
  QUERY_OPS,
  RELATIONS_CODE,
  buildEntityClassCode,
  simulateQuery,
} from '@/components/shared/kb/ormEngine';
import styles from '@/components/demos/ORMDemo.module.css';

const TABS = [
  {id: 'visual', label: 'Сопоставление'},
  {id: 'code', label: 'Код и запросы'},
  {id: 'relations', label: 'Связи'},
];

const ER_TO_ENTITY = {users: 'user', posts: 'post', roles: 'role'};

function SchemaPanel({title, badge, fields, mode, highlightField, setHighlightField}) {
  return (
    <div className={styles.schemaPanel}>
      <div className={styles.schemaHead}>
        <span>{title}</span>
        <span className="it-demo__badge">{badge}</span>
      </div>
      <div className={clsx(styles.schemaRow, styles.schemaRowHead)}>
        <span>{mode === 'sql' ? 'column' : 'property'}</span>
        <span>type</span>
        <span>meta</span>
      </div>
      {fields.map((field) => (
        <div
          key={field.name}
          className={clsx(styles.schemaRow, highlightField === field.name && styles.schemaRowHighlight)}
          onMouseEnter={() => setHighlightField(field.name)}
          onMouseLeave={() => setHighlightField(null)}
        >
          <span>{mode === 'sql' ? field.name : (field.column ?? field.name)}</span>
          <span className={styles.typeCol}>{mode === 'sql' ? field.type : field.ormType}</span>
          <span>{field.pk ? '🔑 PK' : field.fk ? '🔗 FK' : field.unique ? 'unique' : '—'}</span>
        </div>
      ))}
    </div>
  );
}

function MappingPanels({entity, highlightField, setHighlightField}) {
  return (
    <div className={styles.mappingWrap}>
      <div className={styles.mappingGrid}>
        <SchemaPanel
          title={`SQL · ${entity.table}`}
          badge="таблица"
          fields={entity.fields}
          mode="sql"
          highlightField={highlightField}
          setHighlightField={setHighlightField}
        />
        <div className={styles.mappingArrow} aria-hidden>
          ⇄
        </div>
        <SchemaPanel
          title={`ORM · ${entity.name}`}
          badge="@Entity"
          fields={entity.fields}
          mode="orm"
          highlightField={highlightField}
          setHighlightField={setHighlightField}
        />
      </div>
    </div>
  );
}

function ORMDemoInner() {
  const [activeTab, setActiveTab] = useState('visual');
  const [selectedEntity, setSelectedEntity] = useState('user');
  const [highlightField, setHighlightField] = useState(null);
  const [queryOp, setQueryOp] = useState('find');
  const [queryResult, setQueryResult] = useState(null);
  const [queryBusy, setQueryBusy] = useState(false);
  const {copy, isCopied} = useCopyToClipboard();

  const entity = ENTITIES[selectedEntity];
  const entityCode = buildEntityClassCode(selectedEntity);
  const queryCode = ORM_QUERIES[selectedEntity][queryOp];

  const runQuery = useCallback(() => {
    setQueryBusy(true);
    setQueryResult(null);
    window.setTimeout(() => {
      setQueryResult(simulateQuery(queryOp));
      setQueryBusy(false);
    }, 380);
  }, [queryOp]);

  return (
    <DemoShell>
      <DemoCard
        title="ORM — Object-Relational Mapping"
        subtitle="Связь таблиц SQL с классами приложения: сопоставление полей, запросы и отношения"
      >
        <div className="it-demo__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className={clsx('it-demo__tab', activeTab === t.id && 'it-demo__tab--active')}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'visual' && (
          <>
            <div className="it-demo__row" style={{marginBottom: '0.75rem'}}>
              {ENTITY_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={clsx(
                    'it-demo__btn',
                    'it-demo__btn--sm',
                    selectedEntity === key ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
                  )}
                  onClick={() => setSelectedEntity(key)}
                >
                  {ENTITIES[key].name}
                </button>
              ))}
            </div>
            <MappingPanels
              entity={entity}
              highlightField={highlightField}
              setHighlightField={setHighlightField}
            />
          </>
        )}

        {activeTab === 'code' && (
          <div className="it-demo__grid it-demo__grid--2">
            <div>
              <div className="it-demo__row" style={{marginBottom: '0.5rem'}}>
                {ENTITY_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={clsx(
                      'it-demo__btn',
                      'it-demo__btn--sm',
                      selectedEntity === key ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
                    )}
                    onClick={() => setSelectedEntity(key)}
                  >
                    {ENTITIES[key].name}
                  </button>
                ))}
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                  onClick={() => copy(entityCode, 'entity')}
                >
                  {isCopied('entity') ? 'Скопировано' : 'Копировать класс'}
                </button>
              </div>
              <pre className={styles.codePre}>{entityCode}</pre>
            </div>

            <div>
              <div className={styles.queryToolbar}>
                {QUERY_OPS.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    className={clsx(
                      'it-demo__btn',
                      'it-demo__btn--sm',
                      queryOp === op.id ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
                    )}
                    onClick={() => {
                      setQueryOp(op.id);
                      setQueryResult(null);
                    }}
                  >
                    {op.icon} {op.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
                  onClick={runQuery}
                  disabled={queryBusy}
                >
                  {queryBusy ? 'Выполнение…' : '▶ Выполнить'}
                </button>
              </div>
              <pre className={styles.codePre}>{queryCode}</pre>
              {queryResult && (
                <div
                  className={clsx(
                    'it-demo__alert',
                    queryResult.success ? 'it-demo__alert--success' : 'it-demo__alert--error',
                    styles.queryResult,
                  )}
                >
                  {queryResult.message}
                  {queryResult.rows != null && (
                    <span style={{display: 'block', marginTop: '0.25rem', fontSize: '0.8rem'}}>
                      Затронуто строк: {queryResult.rows}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="it-demo__grid it-demo__grid--2">
            <div>
              <p className="it-demo__subtitle" style={{margin: '0 0 0.65rem'}}>
                Нажмите на сущность, чтобы открыть её сопоставление
              </p>
              {ER_NODES.map((node) => (
                <div
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  className={clsx(
                    styles.erNode,
                    node.indent && styles.erNodeIndent,
                    entity.table === node.label && styles.erNodeActive,
                  )}
                  onClick={() => {
                    const key = ER_TO_ENTITY[node.id];
                    if (key) setSelectedEntity(key);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const key = ER_TO_ENTITY[node.id];
                      if (key) setSelectedEntity(key);
                    }
                  }}
                >
                  <strong>{node.label}</strong>
                  <div style={{fontSize: '0.78rem', color: 'var(--demo-muted)', marginTop: '0.2rem'}}>
                    {node.fields}
                  </div>
                  <div className={styles.erBadges}>
                    {node.badges.map((b) => (
                      <span key={b} className="it-demo__badge">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="it-demo__row" style={{marginBottom: '0.5rem'}}>
                <span style={{fontSize: '0.85rem', fontWeight: 600}}>Аннотации связей</span>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                  onClick={() => copy(RELATIONS_CODE, 'rel')}
                >
                  {isCopied('rel') ? 'Скопировано' : 'Копировать'}
                </button>
              </div>
              <pre className={styles.codePre}>{RELATIONS_CODE}</pre>
            </div>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ORMDemoInner;
