import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DEVOPS_VS_SYSADMIN} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function DevOpsRoleComparePlayInner() {
  const [idx, setIdx] = useState(0);
  const row = DEVOPS_VS_SYSADMIN[idx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="DevOps vs системный администратор"
        subtitle="Одна ситуация — два взгляда на изменения и инфраструктуру"
      >
        <div className={styles.chips}>
          {DEVOPS_VS_SYSADMIN.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={clsx(styles.chip, idx === i && styles.chipActive)}
              onClick={() => setIdx(i)}
            >
              {r.topic}
            </button>
          ))}
        </div>
        <h5 style={{margin: '0 0 0.5rem', fontSize: '0.9rem'}}>{row.topic}</h5>
        <div className={styles.compareGrid}>
          <div className={clsx(styles.roleCard, styles.roleSys)}>
            <strong>Сисадмин</strong>
            <p style={{margin: '0.35rem 0 0', fontSize: '0.82rem'}}>{row.sysadmin}</p>
          </div>
          <div className={clsx(styles.roleCard, styles.roleDevops)}>
            <strong>DevOps-инженер</strong>
            <p style={{margin: '0.35rem 0 0', fontSize: '0.82rem'}}>{row.devops}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DevOpsRoleComparePlayInner;
