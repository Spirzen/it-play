import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {MODES, flattenFiles, getMode} from '@/components/shared/kb/projectStructureEngine';
import styles from '@/components/demos/ProjectStructureExplorer.module.css';

function fileIcon(path) {
  const name = path.split('/').pop() ?? path;
  if (name.endsWith('.sln')) return {icon: '◆', className: styles.fileIconSln};
  if (name.endsWith('.csproj') || name.endsWith('.iml')) return {icon: '▣', className: styles.fileIconProj};
  if (
    name.endsWith('.json') ||
    name.endsWith('.xml') ||
    name === 'requirements.txt' ||
    name === 'package.json'
  ) {
    return {icon: '⚙', className: styles.fileIconConfig};
  }
  return {icon: '◇', className: styles.fileIconCode};
}

function TreeNode({node, depth, selectedPath, onSelect, defaultOpen}) {
  const [open, setOpen] = useState(defaultOpen ?? depth < 2);

  if (node.type === 'dir') {
    const name = node.path.split('/').filter(Boolean).pop() || node.path;
    return (
      <li className={styles.treeItem}>
        <div
          className={styles.treeDir}
          style={{paddingLeft: `${0.5 + depth * 0.75}rem`}}
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
          <span className={styles.treeDirIcon} aria-hidden>
            {open ? '▼' : '▶'}
          </span>
          <span aria-hidden>📁</span>
          <span>{name}</span>
        </div>
        {open && node.children?.length > 0 && (
          <ul className={styles.treeList}>
            {node.children.map((child) => (
              <TreeNode
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
  const {icon, className: iconClass} = fileIcon(node.path);

  return (
    <li className={styles.treeItem}>
      <button
        type="button"
        className={clsx(styles.treeBtn, selectedPath === node.path && styles.treeBtnActive)}
        style={{paddingLeft: `${0.5 + depth * 0.75}rem`}}
        onClick={() => onSelect(node.path)}
      >
        <span className={iconClass} aria-hidden>
          {icon}
        </span>
        {fileName}
      </button>
    </li>
  );
}

function ProjectStructureExplorerInner() {
  const [modeId, setModeId] = useState('project');
  const [selectedPath, setSelectedPath] = useState(null);

  const mode = getMode(modeId);
  const files = useMemo(() => flattenFiles(mode.tree), [mode]);

  const selected = useMemo(
    () => files.find((f) => f.path === selectedPath) ?? null,
    [files, selectedPath],
  );

  useEffect(() => {
    const first = files[0];
    setSelectedPath(first?.path ?? null);
  }, [modeId, files]);

  const onModeChange = useCallback((id) => {
    setModeId(id);
  }, []);

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Как выглядит проект в IDE</h4>
        <p className={styles.subtitle}>
          Дерево файлов, файл проекта и решение — переключайте уровни организации кода
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.modeBar} role="tablist" aria-label="Уровень организации">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={modeId === m.id}
              className={clsx(styles.modeBtn, modeId === m.id && styles.modeBtnActive)}
              onClick={() => onModeChange(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={styles.workspaceBar}>
          <span className={styles.workspaceLabel}>Открыто в IDE:</span>
          <span className={styles.workspacePath}>{mode.workspace}</span>
        </div>

        <p className={styles.summary}>{mode.summary}</p>

        <div className={styles.layout}>
          <aside className={styles.treePanel} aria-label="Обозреватель файлов">
            <div className={styles.treeToolbar}>
              <span aria-hidden>📂</span> Explorer — {mode.short}
            </div>
            <div className={styles.treeScroll}>
              <ul className={styles.treeList}>
                {mode.tree.map((node) => (
                  <TreeNode
                    key={node.path}
                    node={node}
                    depth={0}
                    selectedPath={selectedPath}
                    onSelect={setSelectedPath}
                    defaultOpen
                  />
                ))}
              </ul>
            </div>
          </aside>

          <section className={styles.detailPanel} aria-label="Описание выбранного элемента">
            <div className={styles.detailHeader}>{selectedPath ?? '—'}</div>
            <div className={styles.detailBody}>
              {selected ? (
                <>
                  {selected.role && <span className={styles.detailRole}>{selected.role}</span>}
                  <p className={styles.detailHint}>{selected.hint}</p>
                </>
              ) : (
                <p className={styles.detailPlaceholder}>
                  Выберите файл в дереве слева — здесь появится пояснение, зачем этот элемент нужен в
                  структуре проекта.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{background: '#c586c0'}} />
            .sln — решение
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{background: '#4ec9b0'}} />
            .csproj — проект
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{background: '#9cdcfe'}} />
            конфигурация и зависимости
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{background: '#dcdcaa'}} />
            исходный код
          </span>
        </div>
      </div>
    </DemoShell>
  );
}

export default ProjectStructureExplorerInner;
