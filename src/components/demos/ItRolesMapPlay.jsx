import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  IT_ROLES,
  SDLC_PHASES,
  scoreRolePlacement,
} from '@/components/shared/kb/careerInteractiveEngines';
import {styles} from '@/components/shared/kb/basicsPlayUi';

function ItRolesMapPlayInner() {
  const [placements, setPlacements] = useState({});
  const [dragRole, setDragRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const placeRole = (phaseId, roleId) => {
    if (!roleId) return;
    setPlacements((prev) => {
      const next = {...prev};
      Object.keys(next).forEach((ph) => {
        next[ph] = next[ph].filter((id) => id !== roleId);
      });
      next[phaseId] = [...(next[phaseId] ?? []), roleId];
      return next;
    });
    setSelectedRole(null);
  };

  const reset = () => {
    setPlacements({});
    setSelectedRole(null);
    setDragRole(null);
  };

  const placedIds = useMemo(() => new Set(Object.values(placements).flat()), [placements]);
  const unplaced = IT_ROLES.filter((r) => !placedIds.has(r.id));

  const score = useMemo(() => {
    let fit = 0;
    let total = 0;
    Object.entries(placements).forEach(([phaseId, roles]) => {
      roles.forEach((roleId) => {
        total += 1;
        if (scoreRolePlacement(roleId, phaseId) === 'fit') fit += 1;
      });
    });
    return total ? Math.round((fit / total) * 100) : null;
  }, [placements]);

  const onPhaseClick = (phaseId) => {
    if (selectedRole) placeRole(phaseId, selectedRole);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Карта IT-ролей в жизненном цикле"
        subtitle="Перетащите или нажмите роль, затем этап — в IT много профессий без ежедневного кода"
      >
        <div className={styles.toolbar}>
          <span className="it-demo__hint" style={{margin: 0}}>
            {selectedRole ? 'Выберите этап для размещения роли' : 'Перетащите карточку на этап'}
          </span>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
            Сбросить
          </button>
        </div>

        <div className={styles.rolePool}>
          <div className={styles.rolePoolTitle}>Роли</div>
          <div className={styles.roleTags}>
            {unplaced.map((role) => (
              <button
                key={role.id}
                type="button"
                className={clsx(
                  styles.roleTag,
                  selectedRole === role.id && styles.roleTagSelected,
                )}
                draggable
                onDragStart={() => setDragRole(role.id)}
                onDragEnd={() => setDragRole(null)}
                onClick={() => setSelectedRole((id) => (id === role.id ? null : role.id))}
              >
                {role.label}
              </button>
            ))}
            {unplaced.length === 0 && (
              <span className="it-demo__hint">Все роли распределены</span>
            )}
          </div>
        </div>

        <div className={styles.phaseGrid}>
          {SDLC_PHASES.map((phase) => (
            <div key={phase.id} className={styles.phaseCard}>
              <div className={styles.phaseHeader}>
                <div className={styles.phaseTitle}>{phase.label}</div>
                <div className={styles.phaseHint}>{phase.hint}</div>
              </div>
              <div
                className={clsx(styles.dropZone, (dragRole || selectedRole) && styles.dropZoneOver)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => placeRole(phase.id, dragRole)}
                onClick={() => onPhaseClick(phase.id)}
                onKeyDown={(e) => e.key === 'Enter' && onPhaseClick(phase.id)}
                role="button"
                tabIndex={0}
              >
                {(placements[phase.id] ?? []).map((roleId) => {
                  const role = IT_ROLES.find((r) => r.id === roleId);
                  const fit = scoreRolePlacement(roleId, phase.id);
                  return (
                    <span
                      key={roleId}
                      className={clsx(
                        styles.roleTag,
                        fit === 'fit' ? styles.roleTagFit : styles.roleTagStretch,
                      )}
                      title={fit === 'fit' ? 'Типичная зона роли' : 'Возможно, но реже'}
                    >
                      {role?.label}
                    </span>
                  );
                })}
                {!(placements[phase.id] ?? []).length && (
                  <span className={styles.dropZoneEmpty}>Пусто</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {score !== null && (
          <div className={styles.scoreBanner}>
            <span>
              Совпадение с типичными зонами: <strong>{score}%</strong>
            </span>
            <span className="it-demo__hint">Зелёная полоска — частая зона роли</span>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ItRolesMapPlayInner;
