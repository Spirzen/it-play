import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BLENDER_PANELS,
  SCENE_TREE,
  SHADER_NODES,
  SHADER_EDGES,
  VIEW_MODES,
  describePanel,
  drawBlenderViewport,
} from '@/components/shared/kb/blenderWorkspaceEngine';
import styles from '@/components/demos/BlenderWorkspacePlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const VP_SIZE = 280;

function BlenderWorkspacePlayInner() {
  const canvasRef = useRef(null);
  const [panel, setPanel] = useState('viewport');
  const [viewMode, setViewMode] = useState('solid');
  const [rotY, setRotY] = useState(0.55);
  const [rotX, setRotX] = useState(0.35);
  const [selected, setSelected] = useState('mesh');

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBlenderViewport(ctx, VP_SIZE, VP_SIZE, rotY, rotX, viewMode);
  }, [rotY, rotX, viewMode]);

  useEffect(() => {
    if (panel === 'viewport') paint();
  }, [panel, paint]);

  const renderTree = (nodes, depth = 0) =>
    nodes.map((node) => (
      <div key={node.id} style={{paddingLeft: depth * 14}}>
        <button
          type="button"
          className={clsx(styles.treeRow, selected === node.id && styles.treeRowActive)}
          onClick={() => setSelected(node.id)}
        >
          <span>{node.icon ?? (node.type === 'collection' ? '📁' : '•')}</span>
          {node.label}
        </button>
        {node.children?.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    ));

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Blender: сцена и рабочие области"
        subtitle="Viewport, Outliner и Shader Editor — как устроен типичный .blend-проект"
      >
        <div className={styles.toolbar}>
          <span className={styles.toolbarBrand}>Blender</span>
          {BLENDER_PANELS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.tab, panel === p.id && styles.tabActive)}
              onClick={() => setPanel(p.id)}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        {panel === 'viewport' && (
          <>
            <div className={toolStyles.chips}>
              {VIEW_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={clsx(toolStyles.chip, viewMode === m.id && toolStyles.chipActive)}
                  onClick={() => setViewMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className={styles.viewportWrap}>
              <canvas
                ref={canvasRef}
                width={VP_SIZE}
                height={VP_SIZE}
                className={styles.viewport}
                aria-label="3D Viewport Blender"
              />
            </div>
            <div className={styles.sliders}>
              <label className={styles.sliderLabel}>
                Orbit Y
                <input
                  type="range"
                  min={0}
                  max={6.28}
                  step={0.02}
                  value={rotY}
                  onChange={(e) => setRotY(Number(e.target.value))}
                />
              </label>
              <label className={styles.sliderLabel}>
                Orbit X
                <input
                  type="range"
                  min={-1.2}
                  max={1.2}
                  step={0.02}
                  value={rotX}
                  onChange={(e) => setRotX(Number(e.target.value))}
                />
              </label>
            </div>
          </>
        )}

        {panel === 'outliner' && (
          <div className={styles.outliner}>{renderTree(SCENE_TREE)}</div>
        )}

        {panel === 'shader' && (
          <div className={styles.nodeGraph}>
            {SHADER_NODES.map((n) => (
              <div
                key={n.id}
                className={clsx(styles.shaderNode, styles[`node_${n.type}`])}
                style={{gridColumn: n.x + 1}}
              >
                {n.label}
              </div>
            ))}
            <p className={styles.hint}>
              Цепочка: {SHADER_EDGES.map(([a, b]) => `${a} → ${b}`).join(', ')}
            </p>
          </div>
        )}

        <p className={styles.hint}>{describePanel(panel)}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default BlenderWorkspacePlayInner;
