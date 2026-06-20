import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpArrow,
  LpCode,
  LpLog,
  LpSection,
  LpStack,
  LpStep,
  LpTimeline,
  LpToggleRow,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const TS_SOURCE = `function greet(name: string, age: number): string {
  return \`Hello, \${name}! You are \${age}\`;
}

const userId: string | null = getUser();
if (userId === null) {
  throw new Error("Not found");
}`;

const JS_OUTPUT = `function greet(name, age) {
  return \`Hello, \${name}! You are \${age}\`;
}

const userId = getUser();
if (userId === null) {
  throw new Error("Not found");
}`;

const PHASES = ['Parse .ts', 'Type check', 'Erase types', 'Emit .js'];

function TsCompilerPlayInner() {
  const [strict, setStrict] = useState(true);
  const [phase, setPhase] = useState(-1);
  const [hasError, setHasError] = useState(false);
  const [busy, setBusy] = useState(false);

  const compile = async () => {
    if (busy) return;
    setBusy(true);
    setPhase(-1);
    setHasError(false);
    for (let i = 0; i < PHASES.length; i++) {
      setPhase(i);
      await new Promise((r) => setTimeout(r, 400));
      if (strict && i === 1) {
        setHasError(true);
        setBusy(false);
        return;
      }
    }
    setPhase(PHASES.length);
    setBusy(false);
  };

  const reset = () => {
    setPhase(-1);
    setHasError(false);
    setBusy(false);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="TypeScript → JavaScript"
        subtitle="tsc проверяет типы, затем удаляет аннотации из emit"
      >
        <LpStack>
          <LpToggleRow>
            <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} />
            <span>
              <strong>strictNullChecks</strong> — <code>userId: string | null</code>
            </span>
          </LpToggleRow>

          <div className={styles.split}>
            <LpSection label="index.ts">
              <LpCode>{TS_SOURCE}</LpCode>
            </LpSection>
            <LpSection label="dist/index.js">
              <LpCode className={phase < PHASES.length && !hasError ? styles.codePlaceholder : undefined}>
                {hasError
                  ? '// tsc: error TS18047 — userId is possibly null'
                  : phase >= PHASES.length
                    ? JS_OUTPUT
                    : '// …'}
              </LpCode>
            </LpSection>
          </div>

          <LpTimeline>
            {PHASES.map((p, i) => (
              <React.Fragment key={p}>
                {i > 0 && <LpArrow />}
                <LpStep active={phase === i} done={phase > i} error={hasError && i === 1}>
                  {p}
                </LpStep>
              </React.Fragment>
            ))}
          </LpTimeline>

          <LpActionBar>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
              onClick={compile}
              disabled={busy}
            >
              {busy ? 'Компиляция…' : 'tsc --emit'}
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          </LpActionBar>

          <LpLog variant={hasError ? 'error' : phase >= PHASES.length ? 'success' : 'info'}>
            {hasError
              ? 'При strictNullChecks tsc останавливается до emit.'
              : phase >= PHASES.length
                ? 'Аннотации исчезли — runtime видит обычный JavaScript.'
                : 'Запустите tsc и пройдите фазы компиляции.'}
          </LpLog>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default TsCompilerPlayInner;
