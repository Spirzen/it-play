import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CLASSIFICATIONS,
  DATA_ASSETS,
  ROLES,
  accessAllowed,
  classLevel,
  governanceScore,
} from '@/components/shared/kb/dataGovernanceEngine';
import styles from '@/components/demos/DataGovernancePlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function DataGovernancePlayInner() {
  const [roleId, setRoleId] = useState('steward');
  const [activeAsset, setActiveAsset] = useState('hr');
  const [assignments, setAssignments] = useState(() =>
    Object.fromEntries(DATA_ASSETS.map((a) => [a.id, a.minClass])),
  );

  const asset = DATA_ASSETS.find((a) => a.id === activeAsset) ?? DATA_ASSETS[0];
  const assignedClass = assignments[asset.id] ?? asset.minClass;
  const minOk = classLevel(assignedClass) >= classLevel(asset.minClass);
  const accessOk = accessAllowed(roleId, assignedClass);
  const score = useMemo(() => governanceScore(assignments, roleId), [assignments, roleId]);

  const setClass = (classId) => {
    setAssignments((prev) => ({...prev, [asset.id]: classId}));
  };

  return (
    <DemoShell>
      <DemoCard
        title="Data Governance: классификация и доступ"
        subtitle="Назначьте уровень конфиденциальности активам данных и проверьте, согласуется ли доступ роли с политикой"
      >
        <label className="it-demo__label">Роль сотрудника</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.85rem'}}>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(toolStyles.chip, roleId === r.id && toolStyles.chipActive)}
              onClick={() => setRoleId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <div>
            <p className="it-demo__label">Корпоративные активы</p>
            <div className={styles.assetList}>
              {DATA_ASSETS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={clsx(styles.assetCard, activeAsset === a.id && styles.assetCardActive)}
                  onClick={() => setActiveAsset(a.id)}
                >
                  <strong>{a.name}</strong>
                  <div className={styles.assetMeta}>
                    {a.category} · владелец: {a.owner}
                  </div>
                  <div className={styles.assetMeta}>
                    Минимум: {CLASSIFICATIONS.find((c) => c.id === a.minClass)?.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="it-demo__label">Классификация: {asset.name}</p>
            <div className={styles.classRow}>
              {CLASSIFICATIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={clsx(
                    styles.classBtn,
                    assignedClass === c.id && styles.classBtnActive,
                  )}
                  style={
                    assignedClass === c.id
                      ? {background: c.color, borderColor: c.color}
                      : {borderColor: c.color, color: c.color}
                  }
                  onClick={() => setClass(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div
              className={clsx(
                styles.verdict,
                minOk && accessOk ? styles.verdictOk : styles.verdictBad,
              )}
            >
              {!minOk && (
                <p style={{margin: 0}}>
                  Класс ниже требуемого минимума ({CLASSIFICATIONS.find((x) => x.id === asset.minClass)?.label}).
                </p>
              )}
              {minOk && !accessOk && (
                <p style={{margin: 0}}>
                  Роль "{ROLES.find((r) => r.id === roleId)?.label}" не имеет права на этот уровень данных.
                </p>
              )}
              {minOk && accessOk && (
                <p style={{margin: 0}}>
                  Политика соблюдена: классификация и RBAC согласованы для {asset.name}.
                </p>
              )}
            </div>

            <div className={styles.meters}>
              <div className={styles.meter}>
                <label>Соответствие политике — {score.compliancePct}%</label>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{width: `${score.compliancePct}%`, background: '#1565c0'}}
                  />
                </div>
              </div>
              <div className={styles.meter}>
                <label>Индекс качества данных — {score.qualityPct}%</label>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{width: `${score.qualityPct}%`, background: '#2e7d32'}}
                  />
                </div>
              </div>
            </div>
            <p className="it-demo__hint" style={{marginTop: '0.65rem'}}>
              Согласовано активов: {score.compliant} из {score.total}. Data Governance задаёт правила;
              Data Management выполняет операции по ним.
            </p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DataGovernancePlayInner;
