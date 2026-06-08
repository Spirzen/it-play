import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {TERRAFORM_PRESETS} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function TerraformPlanPlayInner() {
  const [presetId, setPresetId] = useState(TERRAFORM_PRESETS[0].id);
  const [phase, setPhase] = useState('plan');

  const preset = TERRAFORM_PRESETS.find((p) => p.id === presetId) ?? TERRAFORM_PRESETS[0];

  const planText = useMemo(() => {
    const lines = ['Terraform will perform the following actions:', ''];
    preset.plan.forEach((row) => {
      const sym =
        row.action === 'create' ? '+' : row.action === 'update' ? '~' : ' ';
      lines.push(`  ${sym} ${row.resource}`);
      if (row.change) lines.push(`      ${row.change}`);
    });
    const changes = preset.plan.filter((r) => r.action !== 'no-op').length;
    lines.push('', `Plan: ${changes} to add/change, 0 to destroy.`);
    return lines.join('\n');
  }, [preset]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Terraform: plan → apply"
        subtitle="Декларативный HCL и план изменений перед применением в облако"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TERRAFORM_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, presetId === p.id && toolStyles.chipActive)}
              onClick={() => {
                setPresetId(p.id);
                setPhase('plan');
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.grid2}>
          <div>
            <label className="it-demo__label">main.tf (HCL)</label>
            <pre className={styles.mono}>{preset.hcl}</pre>
          </div>
          <div>
            <label className="it-demo__label">
              {phase === 'plan' ? 'terraform plan' : 'terraform apply — выполнено'}
            </label>
            <pre className={styles.mono}>{planText}</pre>
            {preset.plan.map((row) => (
              <div
                key={row.resource}
                className={clsx(
                  styles.planLine,
                  row.action === 'create' && styles.planCreate,
                  row.action === 'update' && styles.planUpdate,
                  row.action === 'no-op' && styles.planNoop,
                )}
              >
                {row.action === 'create' && '+ create '}
                {row.action === 'update' && '~ update '}
                {row.action === 'no-op' && '  no-op  '}
                {row.resource}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => setPhase('plan')}
          >
            terraform plan
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={() => setPhase('apply')}
          >
            terraform apply -auto-approve
          </button>
        </div>
        {phase === 'apply' && (
          <p className="it-demo__hint" style={{marginBottom: 0}}>
            Состояние записано в terraform.tfstate; повторный plan покажет no-op для неизменённых
            ресурсов.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default TerraformPlanPlayInner;
