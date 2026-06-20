import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectPanel,
  ProjectSlider,
  ProjectMetrics,
  ProjectFlagSplit,
  ProjectMeter,
  ProjectMessage,
  ProjectBtnRow,
} from '@/components/shared/kb/projectPlayKit';

function FeatureFlagRolloutPlayInner() {
  const [rollout, setRollout] = useState(0);
  const [killed, setKilled] = useState(false);
  const [flagDebt, setFlagDebt] = useState(2);

  const errorRate = useMemo(() => {
    if (killed || rollout === 0) return 0;
    if (rollout < 10) return 0.1;
    if (rollout < 30) return 0.4;
    if (rollout < 60) return 1.2;
    return 2.8;
  }, [rollout, killed]);

  const usersOnNew = killed ? 0 : rollout;
  const status = killed
    ? 'Kill switch: фича выключена, трафик на старый checkout.'
    : rollout === 0
      ? 'Флаг off — все на legacy-потоке.'
      : rollout < 100
        ? `Gradual rollout: ${rollout}% на new_payment_flow.`
        : '100% rollout — пора снять флаг и удалить legacy-код.';

  const kill = () => {
    setKilled(true);
    setRollout(0);
  };

  const reset = () => {
    setRollout(0);
    setKilled(false);
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Feature flags" subtitle="Gradual rollout и kill switch">
        <ProjectStack>
          <ProjectPanel title="new_payment_flow">
            <p className={s.panelMuted} style={{marginTop: '0.15rem'}}>
              {status}
            </p>
          </ProjectPanel>

          <ProjectSlider
            label={`Rollout: ${usersOnNew}% пользователей`}
            value={killed ? 0 : rollout}
            min={0}
            max={100}
            step={5}
            disabled={killed}
            onChange={(e) => {
              setKilled(false);
              setRollout(+e.target.value);
            }}
          />

          <ProjectFlagSplit newPct={usersOnNew} killed={killed} />

          <ProjectMetrics
            items={[
              {
                label: 'Ошибки checkout',
                value: `${errorRate.toFixed(1)}%`,
                tone: errorRate > 1 ? 'error' : 'success',
              },
              {label: 'Legacy path', value: `${100 - usersOnNew}%`},
              {label: 'Flag debt (активных)', value: flagDebt},
            ]}
          />

          <ProjectMeter label="Нагрузка на new flow" value={usersOnNew} tone={errorRate > 1 ? 'warn' : undefined} />

          {errorRate > 1 && !killed && (
            <ProjectMessage tone="err">Error rate растёт — типичный сценарий для kill switch до hotfix.</ProjectMessage>
          )}

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={kill} disabled={killed || rollout === 0}>
              Kill switch
            </button>
            <button
              type="button"
              className="it-demo__btn"
              onClick={() => setFlagDebt((d) => Math.max(0, d - 1))}
              disabled={rollout < 100}
            >
              Снять флаг (−1 debt)
            </button>
            <button type="button" className="it-demo__btn" onClick={reset}>
              Сброс
            </button>
          </ProjectBtnRow>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default FeatureFlagRolloutPlayInner;
