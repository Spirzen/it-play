import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DEV_ROLES, TEAM_HANDOFFS} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function GameDevTeamPlayInner() {
  const [roleId, setRoleId] = useState('design');
  const role = DEV_ROLES.find((r) => r.id === roleId) ?? DEV_ROLES[0];
  const handoffs = useMemo(
    () => TEAM_HANDOFFS.filter((h) => h.from === roleId || h.to === roleId),
    [roleId],
  );

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Команда разработки игры"
        subtitle="Роли, зона ответственности и артефакты на стыках дисциплин"
      >
        <div className={styles.engineGrid}>
          {DEV_ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(styles.engineCard, roleId === r.id && styles.engineCardActive)}
              onClick={() => setRoleId(r.id)}
            >
              <strong>{r.label}</strong>
              <p className={styles.hint} style={{margin: '0.2rem 0 0'}}>
                {r.focus}
              </p>
            </button>
          ))}
        </div>

        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p className={styles.panelTitle}>{role.label}</p>
          <p className={styles.hint}>
            <strong>Фокус:</strong> {role.focus}
          </p>
          <p className={styles.hint}>
            <strong>Handoff’ы ({handoffs.length}):</strong>
          </p>
          <ul className={styles.handoffList}>
            {handoffs.map((h) => (
              <li key={`${h.from}-${h.to}`} className={styles.handoffItem}>
                {h.from === roleId ? (
                  <>
                    → <strong>{DEV_ROLES.find((x) => x.id === h.to)?.label}</strong>: {h.artifact}
                  </>
                ) : (
                  <>
                    ← <strong>{DEV_ROLES.find((x) => x.id === h.from)?.label}</strong>: {h.artifact}
                  </>
                )}
                <br />
                <span style={{color: 'var(--ifm-color-danger)'}}>Риск: {h.risk}</span>
              </li>
            ))}
          </ul>
          {handoffs.length === 0 && (
            <p className={styles.hint}>Выберите роль с активными связями в схеме handoff.</p>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameDevTeamPlayInner;
