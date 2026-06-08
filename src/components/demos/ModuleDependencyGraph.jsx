import React, {useCallback, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  LEGEND,
  MODE_LABELS,
  MODULES,
  getDependenciesForMode,
  getGraphEdges,
  getModuleInsight,
  getTypeMeta,
} from '@/components/shared/kb/moduleGraphEngine';
import styles from '@/components/demos/ModuleDependencyGraph.module.css';

const VIEW = {w: 400, h: 290};

function edgePath(from, to) {
  const a = MODULES.find((m) => m.id === from);
  const b = MODULES.find((m) => m.id === to);
  if (!a || !b) return '';
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = a.x + dx * 0.5;
  const cy = a.y + dy * 0.35;
  return `M ${a.x} ${a.y + 18} Q ${cx} ${cy} ${b.x} ${b.y - 18}`;
}

function edgeClass(type) {
  if (type === 'violation') return styles.edgeViolation;
  if (type === 'abstraction') return styles.edgeAbstraction;
  return styles.edgeDirect;
}

function depTagClass(type) {
  if (type === 'violation') return styles.depViolation;
  if (type === 'abstraction') return styles.depAbstraction;
  return styles.depDirect;
}

function ModuleDependencyGraphInner() {
  const [mode, setMode] = useState('monolith');
  const [activeNode, setActiveNode] = useState(null);

  const edges = useMemo(() => getGraphEdges(mode), [mode]);
  const insight = activeNode ? getModuleInsight(mode, activeNode) : null;
  const activeModule = MODULES.find((m) => m.id === activeNode);

  const toggleNode = useCallback((id) => {
    setActiveNode((prev) => (prev === id ? null : id));
  }, []);

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Архитектура зависимостей модулей</h4>
        <p className={styles.subtitle}>Сравнение монолита с прямыми связями и компонентной схемы с DIP</p>
      </div>

      <div className={styles.body}>
        <div className={styles.modeBar}>
          {(['monolith', 'dip']).map((key) => (
            <button
              key={key}
              type="button"
              className={clsx(styles.modeBtn, mode === key && styles.modeBtnActive)}
              onClick={() => {
                setMode(key);
                setActiveNode(null);
              }}
            >
              {MODE_LABELS[key].long}
            </button>
          ))}
        </div>

        <p className={styles.hint} style={{marginTop: 0, marginBottom: '0.75rem'}}>
          {MODE_LABELS[mode].hint}
        </p>

        <div className={styles.legend}>
          {LEGEND.map((item) => (
            <span key={item.type} className={styles.legendItem}>
              <span
                className={clsx(
                  styles.legendLine,
                  item.type === 'abstraction' && styles.legendLineDash,
                )}
                style={{
                  '--line-color':
                    item.type === 'violation'
                      ? 'var(--mg-violation)'
                      : item.type === 'abstraction'
                        ? 'var(--mg-abstraction)'
                        : 'var(--mg-direct)',
                }}
              />
              {item.label}
            </span>
          ))}
        </div>

        <div className={styles.graphWrap}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label="Граф зависимостей модулей"
          >
            <defs>
              <marker id="arrow-direct" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--mg-direct)" />
              </marker>
              <marker id="arrow-abstraction" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--mg-abstraction)" />
              </marker>
              <marker id="arrow-violation" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--mg-violation)" />
              </marker>
            </defs>

            {edges.map((edge) => (
              <path
                key={`${edge.from}-${edge.to}-${edge.type}`}
                d={edgePath(edge.from, edge.to)}
                className={clsx(styles.edge, edgeClass(edge.type))}
                markerEnd={`url(#arrow-${edge.type === 'violation' ? 'violation' : edge.type === 'abstraction' ? 'abstraction' : 'direct'})`}
                fill="none"
              />
            ))}

            {MODULES.map((mod) => {
              const meta = getTypeMeta(mod.type);
              const isActive = activeNode === mod.id;
              return (
                <g
                  key={mod.id}
                  className={clsx(styles.nodeG, isActive && styles.nodeGActive)}
                  style={{'--node-color': meta.color}}
                  onClick={() => toggleNode(mod.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleNode(mod.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={mod.fullName}
                >
                  <circle className={styles.nodeCircle} cx={mod.x} cy={mod.y} r={34} />
                  <text className={styles.nodeIcon} x={mod.x} y={mod.y - 4} textAnchor="middle">
                    {mod.icon}
                  </text>
                  <text className={styles.nodeLabel} x={mod.x} y={mod.y + 22} textAnchor="middle">
                    {mod.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className={styles.cards}>
          {MODULES.map((mod) => {
            const meta = getTypeMeta(mod.type);
            const deps = getDependenciesForMode(mode, mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                className={clsx(styles.card, activeNode === mod.id && styles.cardActive)}
                style={{'--card-accent': meta.color}}
                onClick={() => toggleNode(mod.id)}
              >
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>{mod.icon}</span>
                  <span className={styles.cardType}>{meta.label}</span>
                </div>
                <p className={styles.cardName}>{mod.fullName}</p>
                <p className={styles.cardDesc}>{mod.description}</p>
                {deps.length > 0 && (
                  <div className={styles.depTags}>
                    {deps.map((dep) => (
                      <span key={dep.target} className={clsx(styles.depTag, depTagClass(dep.type))}>
                        → {MODULES.find((m) => m.id === dep.target)?.name}
                        {dep.label ? ` · ${dep.label}` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {insight && activeModule && (
          <div className={styles.insight}>
            <div
              className={clsx(
                'it-demo__alert',
                insight.variant === 'error' ? 'it-demo__alert--error' : 'it-demo__alert--success',
              )}
            >
              <strong>
                {activeModule.icon} {activeModule.fullName}
              </strong>
              <p style={{margin: '0.5rem 0 0'}}>
                <strong>{insight.title}.</strong> {insight.body}
              </p>
            </div>
          </div>
        )}

        <p className={styles.hint}>Нажми на узел графа или карточку модуля для пояснения.</p>
      </div>
    </DemoShell>
  );
}

export default ModuleDependencyGraphInner;
