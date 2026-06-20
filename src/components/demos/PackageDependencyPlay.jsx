import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpChip,
  LpChipRow,
  LpLog,
  LpSection,
  LpStack,
  LpToggleRow,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const MANAGERS = {
  npm: {
    name: 'npm',
    lock: 'package-lock.json',
    tree: [
      {name: 'my-app@1.0', deps: ['react@18', 'axios@1'], depth: 0},
      {name: 'react@18', deps: ['loose-envify@1'], depth: 1},
      {name: 'axios@1', deps: [], depth: 1},
      {name: 'loose-envify@1', deps: [], depth: 2},
    ],
  },
  pip: {
    name: 'pip',
    lock: 'requirements.txt',
    tree: [
      {name: 'myapp==1.0', deps: ['django>=4', 'requests'], depth: 0},
      {name: 'django>=4', deps: ['sqlparse'], depth: 1},
      {name: 'requests', deps: ['urllib3', 'certifi'], depth: 1},
      {name: 'sqlparse', deps: [], depth: 2},
      {name: 'urllib3', deps: [], depth: 2},
      {name: 'certifi', deps: [], depth: 2},
    ],
  },
  cargo: {
    name: 'Cargo',
    lock: 'Cargo.lock',
    tree: [
      {name: 'my_crate 0.1', deps: ['serde 1', 'tokio 1'], depth: 0},
      {name: 'serde 1', deps: [], depth: 1},
      {name: 'tokio 1', deps: ['mio', 'pin-project-lite'], depth: 1},
      {name: 'mio', deps: [], depth: 2},
      {name: 'pin-project-lite', deps: [], depth: 2},
    ],
  },
};

function PackageDependencyPlayInner() {
  const [manager, setManager] = useState('npm');
  const [dedupe, setDedupe] = useState(false);
  const cfg = MANAGERS[manager];

  const flat = useMemo(() => {
    const names = new Set();
    const list = [];
    cfg.tree.forEach((pkg) => {
      if (!dedupe || !names.has(pkg.name)) {
        names.add(pkg.name);
        list.push(pkg);
      }
    });
    return list;
  }, [cfg, dedupe]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Граф зависимостей пакетов"
        subtitle="npm / pip / Cargo — lockfile фиксирует дерево"
      >
        <LpStack>
          <LpChipRow>
            {Object.keys(MANAGERS).map((m) => (
              <LpChip key={m} active={manager === m} onClick={() => setManager(m)}>
                {MANAGERS[m].name}
              </LpChip>
            ))}
          </LpChipRow>

          <LpToggleRow>
            <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} />
            <span>Скрыть дубликаты имён (dedupe)</span>
          </LpToggleRow>

          <p className={styles.typeMuted}>
            Lock-файл: <code>{cfg.lock}</code>
          </p>

          <LpSection label="Дерево зависимостей">
            <div className={styles.depTree}>
              {flat.map((pkg) => (
                <div
                  key={pkg.name}
                  className={clsx(
                    styles.depNode,
                    pkg.depth === 0 && styles.depNodeRoot,
                    pkg.depth === 1 && styles.depDepth1,
                    pkg.depth === 2 && styles.depDepth2,
                  )}
                >
                  <div className={styles.depName}>{pkg.name}</div>
                  <div className={styles.depMeta}>
                    {pkg.deps.length > 0 ? `→ ${pkg.deps.join(', ')}` : 'лист (нет deps)'}
                  </div>
                </div>
              ))}
            </div>
          </LpSection>

          <LpLog variant="info">
            {manager === 'npm' && 'npm install строит node_modules; lock фиксирует транзитивные версии.'}
            {manager === 'pip' && 'pip resolve может конфликтовать — venv изолирует проект.'}
            {manager === 'cargo' && 'Cargo.lock обязателен для бинарников — reproducible builds.'}
          </LpLog>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default PackageDependencyPlayInner;
