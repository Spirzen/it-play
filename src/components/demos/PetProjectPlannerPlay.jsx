import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PET_TYPES} from '@/components/shared/kb/petProjectPlannerEngine';
import styles from '@/components/demos/PetProjectPlannerPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function PetProjectPlannerPlayInner() {
  const [typeId, setTypeId] = useState('demo');
  const [checked, setChecked] = useState({});
  const t = PET_TYPES.find((x) => x.id === typeId) ?? PET_TYPES[1];

  const toggle = (item) => {
    setChecked((prev) => ({...prev, [item]: !prev[item]}));
  };

  const done = t.checklist.filter((c) => checked[c]).length;

  return (
    <DemoShell>
      <DemoCard
        title="Планирование пет-проекта"
        subtitle="Выберите тип, зафиксируйте MVP и отметьте критерии готовности"
      >
        <div className={toolStyles.chips}>
          {PET_TYPES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, typeId === item.id && toolStyles.chipActive)}
              onClick={() => {
                setTypeId(item.id);
                setChecked({});
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className={styles.goal}>
          <strong>Цель:</strong> {t.goal}
        </p>
        <p className="it-demo__hint" style={{marginTop: 0}}>
          Оценка MVP: {t.mvpHours}
        </p>

        <ul className={styles.checklist}>
          {t.checklist.map((item) => (
            <li key={item}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={!!checked[item]}
                  onChange={() => toggle(item)}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>

        <p className={styles.progress}>
          Готовность чеклиста: {done}/{t.checklist.length}
          {done === t.checklist.length && ' — можно выкладывать в портфолио!'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PetProjectPlannerPlayInner;
