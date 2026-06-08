import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {SCENARIOS, getScenario} from '@/components/shared/kb/erdEngine';
import styles from '@/components/demos/ERDDemo.module.css';

function fieldBadge(field) {
  if (field.pk && field.fk) return 'PK, FK';
  if (field.pk) return 'PK';
  if (field.fk) return 'FK';
  return field.type;
}

function EntityBox({entity, active, highlightField, onSelect, onFieldHover}) {
  return (
    <button
      type="button"
      className={clsx(
        styles.entityBox,
        entity.junction && styles.entityBoxJunction,
        active && styles.entityBoxActive,
      )}
      onClick={() => onSelect(entity.id)}
    >
      <div className={clsx(styles.entityHead, entity.junction && styles.entityHeadJunction)}>
        {entity.name}
        <span className={styles.entitySub}>{entity.title}</span>
      </div>
      {entity.fields.map((field) => (
        <div
          key={field.name}
          className={clsx(styles.fieldRow, highlightField === field.name && styles.fieldRowHighlight)}
          onMouseEnter={() => onFieldHover(field.name)}
          onMouseLeave={() => onFieldHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onFieldHover(field.name);
            onSelect(entity.id);
          }}
        >
          <span className={styles.fieldName}>{field.name}</span>
          <span className={styles.fieldMeta}>{fieldBadge(field)}</span>
        </div>
      ))}
    </button>
  );
}

function RelationColumn({fromCard, toCard, verb, compact}) {
  return (
    <div className={clsx(styles.relationCol, compact && styles.relationColCompact)} aria-hidden>
      <div className={styles.cardStack}>
        <span className={styles.cardMark}>{fromCard}</span>
        <div className={styles.relationLine} />
        <span className={styles.relationVerb}>{verb}</span>
        <div className={styles.relationLine} />
        <span className={styles.cardMark}>{toCard}</span>
      </div>
    </div>
  );
}

function OneToManyDiagram({scenario, activeEntity, highlightField, onSelect, onFieldHover}) {
  const [left, right] = scenario.entities;

  return (
    <div className={styles.diagramInner}>
      <EntityBox
        entity={left}
        active={activeEntity === left.id}
        highlightField={activeEntity === left.id ? highlightField : null}
        onSelect={onSelect}
        onFieldHover={onFieldHover}
      />
      <RelationColumn
        fromCard={scenario.relation.fromCard}
        toCard={scenario.relation.toCard}
        verb={scenario.relation.verb}
      />
      <EntityBox
        entity={right}
        active={activeEntity === right.id}
        highlightField={activeEntity === right.id ? highlightField : null}
        onSelect={onSelect}
        onFieldHover={onFieldHover}
      />
    </div>
  );
}

function ManyToManyDiagram({scenario, activeEntity, highlightField, onSelect, onFieldHover}) {
  const [student, enrollment, course] = scenario.entities;

  return (
    <div className={clsx(styles.diagramInner, styles.diagramInnerMn)}>
      <EntityBox
        entity={student}
        active={activeEntity === student.id}
        highlightField={activeEntity === student.id ? highlightField : null}
        onSelect={onSelect}
        onFieldHover={onFieldHover}
      />
      <RelationColumn fromCard="1" toCard="N" verb="имеет" compact />
      <EntityBox
        entity={enrollment}
        active={activeEntity === enrollment.id}
        highlightField={activeEntity === enrollment.id ? highlightField : null}
        onSelect={onSelect}
        onFieldHover={onFieldHover}
      />
      <RelationColumn fromCard="1" toCard="N" verb="включает" compact />
      <EntityBox
        entity={course}
        active={activeEntity === course.id}
        highlightField={activeEntity === course.id ? highlightField : null}
        onSelect={onSelect}
        onFieldHover={onFieldHover}
      />
      <span className={styles.mnLabel}>M:N через промежуточную сущность</span>
    </div>
  );
}

function ERDDemoInner() {
  const [scenarioId, setScenarioId] = useState('shop');
  const [activeEntity, setActiveEntity] = useState(null);
  const [highlightField, setHighlightField] = useState(null);
  const {copy, isCopied} = useCopyToClipboard();

  const scenario = useMemo(() => getScenario(scenarioId), [scenarioId]);

  const selectScenario = useCallback((id) => {
    setScenarioId(id);
    setActiveEntity(null);
    setHighlightField(null);
  }, []);

  const fkHint = useMemo(() => {
    if (!highlightField || !activeEntity) return null;
    const entity = scenario.entities.find((e) => e.id === activeEntity);
    const field = entity?.fields.find((f) => f.name === highlightField);
    if (!field?.fk || !field.ref) return null;
    const refEntity = scenario.entities.find((e) => e.id === field.ref);
    return `${field.name} → ${refEntity?.name}.${field.refField}`;
  }, [activeEntity, highlightField, scenario]);

  const cardinalityNote = useMemo(() => {
    if (scenario.cardinality === 'M:N') {
      return 'В Mermaid: }o--o{ — многие ко многим; промежуточная таблица — отдельная сущность с двумя FK.';
    }
    return 'В Mermaid: ||--o{ — один ко многим (одна линия у "одного", "воронья лапка" у "многих").';
  }, [scenario.cardinality]);

  return (
    <DemoShell>
      <DemoCard
        title="ERD — диаграмма &quot;сущность–связь&quot;"
        subtitle="Сущности, атрибуты и кардинальность: наведите на поле FK или переключите сценарий"
      >
        <div className={styles.scenarioRow} role="tablist">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={scenarioId === s.id}
              className={clsx(
                'it-demo__btn',
                'it-demo__btn--sm',
                scenarioId === s.id ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
              )}
              onClick={() => selectScenario(s.id)}
            >
              {s.label}
            </button>
          ))}
          <span className="it-demo__badge" style={{alignSelf: 'center'}}>
            {scenario.cardinality}
          </span>
        </div>

        <p className="it-demo__subtitle" style={{margin: '0 0 0.75rem'}}>
          <strong>{scenario.title}</strong> — {scenario.cardinalityDesc}
        </p>

        <div className={styles.diagramWrap}>
          {scenario.cardinality === 'M:N' ? (
            <ManyToManyDiagram
              scenario={scenario}
              activeEntity={activeEntity}
              highlightField={highlightField}
              onSelect={setActiveEntity}
              onFieldHover={setHighlightField}
            />
          ) : (
            <OneToManyDiagram
              scenario={scenario}
              activeEntity={activeEntity}
              highlightField={highlightField}
              onSelect={setActiveEntity}
              onFieldHover={setHighlightField}
            />
          )}
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.legendPk}>PK</span> первичный ключ
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendFk}>FK</span> внешний ключ
            </span>
            <span className={styles.legendItem}>Прямоугольник — сущность (таблица)</span>
            {fkHint && (
              <span className={styles.legendItem} style={{color: 'var(--ifm-color-primary)', fontWeight: 600}}>
                Связь: {fkHint}
              </span>
            )}
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div>
            <div className="it-demo__row" style={{marginBottom: '0.5rem'}}>
              <span style={{fontSize: '0.82rem', fontWeight: 600}}>Mermaid</span>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                onClick={() => copy(scenario.mermaid, 'mermaid')}
              >
                {isCopied('mermaid') ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
            <pre className={styles.codePre}>{scenario.mermaid}</pre>
            <p className="it-demo__subtitle" style={{margin: '0.5rem 0 0', fontSize: '0.78rem'}}>
              {cardinalityNote}
            </p>
          </div>
          <div>
            <span style={{fontSize: '0.82rem', fontWeight: 600}}>SQL (DDL)</span>
            <pre className={styles.codePre} style={{marginTop: '0.5rem'}}>
              {scenario.sql}
            </pre>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ERDDemoInner;
