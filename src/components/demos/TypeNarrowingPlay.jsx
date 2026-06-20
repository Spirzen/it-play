import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpBadge,
  LpChip,
  LpChipRow,
  LpCode,
  LpLog,
  LpPanel,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const SCENARIOS = [
  {
    id: 'typeof',
    label: 'typeof',
    code: `function fmt(v: string | number) {
  if (typeof v === "string") {
    return v.toUpperCase();
  }
  return v.toFixed(2);
}`,
    branch: 'typeof v === "string"',
    before: 'string | number',
    after: 'string',
    field: 'v.toUpperCase()',
    invalidField: 'v.toFixed(2)',
  },
  {
    id: 'discriminated',
    label: 'discriminated union',
    code: `type State =
  | { status: "loading" }
  | { status: "ok"; data: User };

function render(s: State) {
  if (s.status === "ok") {
    return s.data.name;
  }
  return "…";
}`,
    branch: 's.status === "ok"',
    before: '{ status: "loading" } | { status: "ok"; data: User }',
    after: '{ status: "ok"; data: User }',
    field: 's.data.name',
    invalidField: 's.data (loading-ветка)',
  },
  {
    id: 'in',
    label: 'operator in',
    code: `type Cat = { meow: () => void };
type Dog = { bark: () => void };

function speak(pet: Cat | Dog) {
  if ("meow" in pet) {
    pet.meow();
  }
}`,
    branch: '"meow" in pet',
    before: 'Cat | Dog',
    after: 'Cat',
    field: 'pet.meow()',
    invalidField: 'pet.bark()',
  },
];

function TypeNarrowingPlayInner() {
  const [scenarioId, setScenarioId] = useState('typeof');
  const [branchTaken, setBranchTaken] = useState(false);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const typePanel = useMemo(() => {
    if (!branchTaken) {
      return {type: scenario.before, ok: scenario.field, bad: scenario.invalidField};
    }
    return {type: scenario.after, ok: scenario.field, bad: scenario.invalidField};
  }, [branchTaken, scenario]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Сужение типов (narrowing)"
        subtitle="После проверки компилятор знает, какая ветка union активна"
      >
        <LpStack>
          <LpSection label="Сценарий">
            <LpChipRow>
              {SCENARIOS.map((s) => (
                <LpChip
                  key={s.id}
                  active={scenarioId === s.id}
                  onClick={() => {
                    setScenarioId(s.id);
                    setBranchTaken(false);
                  }}
                >
                  {s.label}
                </LpChip>
              ))}
            </LpChipRow>
          </LpSection>

          <div className={styles.split}>
            <LpSection label="Исходный код">
              <LpCode>{scenario.code}</LpCode>
              <LpActionBar>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
                  onClick={() => setBranchTaken(true)}
                >
                  Выполнить: {scenario.branch}
                </button>
                {branchTaken && (
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                    onClick={() => setBranchTaken(false)}
                  >
                    До проверки
                  </button>
                )}
              </LpActionBar>
            </LpSection>

            <LpSection label="Панель типов">
              <LpPanel>
                <div className={styles.typePanel}>
                  <div>
                    <span className={styles.typeMuted}>Тип переменной</span>
                    <div className={clsx(styles.typeLine, branchTaken && styles.typeOk)}>{typePanel.type}</div>
                  </div>
                  <div className={styles.accessRow}>
                    <LpBadge variant="ok">✓ {typePanel.ok}</LpBadge>
                    <LpBadge variant={branchTaken ? 'ok' : 'err'}>
                      {branchTaken ? '✓' : '✗'} {typePanel.bad}
                      {branchTaken ? ' — доступно' : ' — ошибка до narrowing'}
                    </LpBadge>
                  </div>
                </div>
              </LpPanel>
              <LpLog variant={branchTaken ? 'success' : 'info'}>
                {branchTaken
                  ? 'Компилятор сузил union — поля другой ветки недоступны.'
                  : 'До проверки union включает все варианты — не все поля общие.'}
              </LpLog>
            </LpSection>
          </div>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default TypeNarrowingPlayInner;
