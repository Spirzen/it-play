import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  TABS,
  ECOSYSTEM_LAYERS,
  CONFIG_COMPARE,
  DEP_NODES,
  NODE_TYPE_META,
  ARCH_PRESETS,
  SESSION_FLOW_STEPS,
  CONNECT_SYSTEMS,
  flattenArchFiles,
  getArchPreset,
  activeDepEdges,
  defaultEnabledNodes,
  bundleSummary,
} from '@/components/shared/kb/oneCEcosystemEngine';
import styles from '@/components/demos/OneCEcosystemPlay.module.css';

function ArchTreeNode({node, depth, selectedPath, onSelect, defaultOpen}) {
  const [open, setOpen] = useState(defaultOpen ?? depth < 2);

  if (node.type === 'dir') {
    const name = node.path.split('/').filter(Boolean).pop() || node.path;
    return (
      <li>
        <div
          className={styles.treeDir}
          style={{paddingLeft: `${0.25 + depth * 0.6}rem`}}
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          aria-expanded={open}
        >
          <span aria-hidden>{open ? '▼' : '▶'}</span>
          <span aria-hidden>📁</span>
          <span>{name}</span>
        </div>
        {open && node.children?.length > 0 && (
          <ul className={styles.tree}>
            {node.children.map((child) => (
              <ArchTreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  const fileName = node.path.split('/').pop();
  return (
    <li>
      <button
        type="button"
        className={clsx(styles.treeBtn, selectedPath === node.path && styles.treeBtnActive)}
        style={{paddingLeft: `${0.25 + depth * 0.6}rem`}}
        onClick={() => onSelect(node.path)}
      >
        <span aria-hidden>📄</span>
        {fileName}
      </button>
    </li>
  );
}

function OneCEcosystemPlayInner() {
  const [tab, setTab] = useState('stack');
  const [layerId, setLayerId] = useState(ECOSYSTEM_LAYERS[0].id);
  const [enabledNodes, setEnabledNodes] = useState(defaultEnabledNodes);
  const [pickedNode, setPickedNode] = useState('form');
  const [archId, setArchId] = useState('ut-monolith');
  const [selectedPath, setSelectedPath] = useState(null);
  const [flowStepId, setFlowStepId] = useState(SESSION_FLOW_STEPS[0].id);
  const [connectId, setConnectId] = useState('extension');

  const layer = ECOSYSTEM_LAYERS.find((l) => l.id === layerId) ?? ECOSYSTEM_LAYERS[0];
  const arch = getArchPreset(archId);
  const files = useMemo(() => flattenArchFiles(arch.tree), [arch]);
  const flowStep = SESSION_FLOW_STEPS.find((s) => s.id === flowStepId) ?? SESSION_FLOW_STEPS[0];
  const connect = CONNECT_SYSTEMS.find((c) => c.id === connectId) ?? CONNECT_SYSTEMS[0];

  const edges = useMemo(() => activeDepEdges(enabledNodes), [enabledNodes]);
  const bundle = useMemo(() => bundleSummary(enabledNodes), [enabledNodes]);
  const picked = DEP_NODES.find((n) => n.id === pickedNode);

  useEffect(() => {
    const first = files[0];
    setSelectedPath(first?.path ?? null);
  }, [archId, files]);

  const toggleNode = useCallback((id) => {
    if (id === 'form') return;
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExtension = useCallback((on) => {
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (on) {
        next.add('extension');
        next.add('http');
      } else {
        next.delete('extension');
      }
      return next;
    });
  }, []);

  const selectedFile = files.find((f) => f.path === selectedPath);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Экосистема 1С:Предприятие"
        subtitle="Слои стека, граф метаданных и модулей, структура конфигурации, проведение документа и способы подключения расширений"
      >
        <div className="it-demo__tabs" role="tablist" aria-label="Режимы демо">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'stack' && (
          <>
            <div className={styles.stackCol}>
              {[...ECOSYSTEM_LAYERS].reverse().map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={clsx(styles.stackLayer, layerId === l.id && styles.stackLayerActive)}
                  style={{'--layer-color': l.color}}
                  onClick={() => setLayerId(l.id)}
                >
                  <span className={styles.stackIcon} aria-hidden>
                    {l.icon}
                  </span>
                  <div>
                    <span className={styles.stackTag}>{l.tag}</span>
                    <p className={styles.stackTitle}>{l.label}</p>
                    <ul className={styles.stackItems}>
                      {l.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </button>
              ))}
            </div>
            <div className={styles.detailPanel} style={{'--layer-color': layer.color}}>
              <strong>{layer.label}</strong> — {layer.detail}
            </div>
            {layerId === 'configs' && (
              <div className={styles.fwCompare} aria-label="Сравнение типовых конфигураций">
                {CONFIG_COMPARE.map((cfg) => (
                  <div key={cfg.id} className={styles.fwCard} style={{'--fw-color': cfg.color}}>
                    <strong>{cfg.label}</strong>
                    <br />
                    Масштаб: {'⭐'.repeat(cfg.scale)} · Доработки: {'⭐'.repeat(cfg.custom)}
                    <br />
                    Облако: {'⭐'.repeat(cfg.cloud)} · {cfg.fit}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'deps' && (
          <>
            <div className={styles.toggleRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={enabledNodes.has('extension')}
                  onChange={(e) => toggleExtension(e.target.checked)}
                />
                Расширение CRM (доп. HTTP и модули)
              </label>
            </div>
            <div className={styles.graphLegend}>
              {Object.entries(NODE_TYPE_META).map(([key, meta]) => (
                <span key={key} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{'--c': meta.stroke}} />
                  {meta.label}
                </span>
              ))}
            </div>
            <div className={styles.graphWrap}>
              <svg className={styles.graphSvg} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet">
                {edges.map(([from, to]) => {
                  const a = DEP_NODES.find((n) => n.id === from);
                  const b = DEP_NODES.find((n) => n.id === to);
                  if (!a || !b) return null;
                  const lazy = a.type === 'lazy' || b.type === 'lazy';
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      className={clsx(styles.graphEdge, lazy && styles.graphEdgeLazy)}
                    />
                  );
                })}
              </svg>
              <div className={styles.graphNodes}>
                {DEP_NODES.map((n) => {
                  const meta = NODE_TYPE_META[n.type];
                  const on = enabledNodes.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      className={clsx(
                        styles.graphNode,
                        !on && styles.graphNodeOff,
                        pickedNode === n.id && styles.graphNodeActive,
                      )}
                      style={{
                        left: `${(n.x / 400) * 100}%`,
                        top: `${(n.y / 240) * 100}%`,
                        '--node-stroke': meta.stroke,
                      }}
                      onClick={() => {
                        setPickedNode(n.id);
                        if (n.id !== 'form') toggleNode(n.id);
                      }}
                      title={on ? 'Клик — исключить из графа' : 'Клик — включить'}
                    >
                      {n.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className={styles.hint}>
              {picked && (
                <>
                  <strong>{picked.label}</strong> ({NODE_TYPE_META[picked.type].label}).{' '}
                </>
              )}
              Клик по узлу переключает участие в схеме. Отключите "Расширение" — исчезнут связи с HTTP-сервисом
              доработки.
            </p>
            <div className={styles.bundleBox}>
              {bundle.chunks.map((c) => (
                <span key={c} className={styles.bundleChip}>
                  {c}
                </span>
              ))}
              <span className={styles.bundleChip}>Механизмов платформы: {bundle.platformCount}</span>
            </div>
          </>
        )}

        {tab === 'structure' && (
          <>
            <div className="it-demo__tabs" style={{marginBottom: '0.5rem'}}>
              {ARCH_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx('it-demo__tab', archId === p.id && 'it-demo__tab--active')}
                  onClick={() => setArchId(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className={styles.hint} style={{marginTop: 0}}>
              {arch.toolchain}
            </p>
            <div className={styles.explorer}>
              <ul className={styles.tree}>
                {arch.tree.map((node) => (
                  <ArchTreeNode
                    key={node.path}
                    node={node}
                    depth={0}
                    selectedPath={selectedPath}
                    onSelect={setSelectedPath}
                    defaultOpen
                  />
                ))}
              </ul>
              <div className={styles.detailPanel}>
                {selectedFile ? (
                  <>
                    <strong>{selectedFile.path.split('/').pop()}</strong>
                    <p style={{margin: '0.35rem 0'}}>{selectedFile.role}</p>
                    <p style={{margin: 0}}>{selectedFile.hint}</p>
                  </>
                ) : (
                  <p style={{margin: 0}}>Выберите элемент в дереве конфигурации</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'session' && (
          <>
            <div className={styles.flow}>
              {SESSION_FLOW_STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span className={styles.flowArrow} aria-hidden>
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    className={clsx(styles.flowStep, flowStepId === s.id && styles.flowStepActive)}
                    onClick={() => setFlowStepId(s.id)}
                  >
                    {s.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <pre className={styles.codeBlock}>{flowStep.cmd}</pre>
            <p className={styles.hint}>{flowStep.detail}</p>
          </>
        )}

        {tab === 'connect' && (
          <>
            <div className={styles.modGrid}>
              {CONNECT_SYSTEMS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={clsx(styles.modCard, connectId === m.id && styles.modCardActive)}
                  style={{'--mod-color': m.color}}
                  onClick={() => setConnectId(m.id)}
                >
                  <span className={styles.modEra}>{m.era}</span>
                  <p className={styles.modLabel}>{m.label}</p>
                </button>
              ))}
            </div>
            <pre className={styles.codeBlock}>{connect.syntax}</pre>
            <p className={styles.hint}>
              <strong>Особенности:</strong> {connect.traits.join(' · ')}
            </p>
            <p className={styles.hint}>
              <strong>Инструменты:</strong> {connect.tools}
            </p>
            <p className={styles.hint}>
              <strong>Где встречается:</strong> {connect.use}
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default OneCEcosystemPlayInner;
