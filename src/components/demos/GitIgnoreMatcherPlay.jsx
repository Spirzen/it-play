import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdHint, CdStack, CdTextarea, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';
import {matchGitIgnore} from '@/components/shared/kb/gitIgnoreEngine';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const DEFAULT_IGNORE = `node_modules/
*.log
dist/
!.env.example
build/*.tmp
`;

const DEFAULT_PATHS = `node_modules/lodash/index.js
src/app.ts
debug.log
dist/bundle.js
.env.example
build/cache.tmp
README.md
`;

function GitIgnoreMatcherPlayInner() {
  const [rules, setRules] = useState(DEFAULT_IGNORE);
  const [paths, setPaths] = useState(DEFAULT_PATHS);

  const lines = paths.split('\n').filter(Boolean);
  const results = lines.map((p) => ({path: p, ...matchGitIgnore(rules, p)}));

  return (
    <DemoShell>
      <DemoCard title=".gitignore matcher" subtitle="Проверка путей по правилам игнорирования">
        <CdStack>
          <div className={styles.gitIgnoreGrid}>
            <div>
              <p className={styles.sectionLabel}>.gitignore</p>
              <CdTextarea value={rules} onChange={(e) => setRules(e.target.value)} rows={8} />
            </div>
            <div>
              <p className={styles.sectionLabel}>Пути для проверки</p>
              <CdTextarea value={paths} onChange={(e) => setPaths(e.target.value)} rows={8} />
            </div>
          </div>

          <div className={styles.matchTable}>
            {results.map((r) => (
              <div key={r.path} className={styles.matchRow}>
                <span className={styles.matchPath}>{r.path}</span>
                <CdVerdict tone={r.ignored ? 'warning' : 'success'} compact>
                  {r.ignored ? `ignore (${r.rule || 'rule'})` : 'track'}
                </CdVerdict>
              </div>
            ))}
          </div>

          <CdHint>Negation (!) отменяет более общее правило. Порядок строк в .gitignore важен.</CdHint>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default GitIgnoreMatcherPlayInner;
