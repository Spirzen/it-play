import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GRADE_LEVELS} from '@/components/shared/kb/careerInteractiveEngines';
import {styles} from '@/components/shared/kb/basicsPlayUi';

function GradeLadderPlayInner() {
  const [gradeId, setGradeId] = useState('middle');
  const grade = GRADE_LEVELS.find((g) => g.id === gradeId) ?? GRADE_LEVELS[1];

  return (
    <DemoShell>
      <DemoCard
        title="Лестница грейдов"
        subtitle="Junior → Middle → Senior: автономия и типичные задачи"
      >
        <div className={styles.ladderTrack}>
          {GRADE_LEVELS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={clsx(styles.ladderStep, gradeId === g.id && styles.ladderStepActive)}
              onClick={() => setGradeId(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className={styles.panelAccent}>
          <p className="it-demo__label">Автономия — {grade.label}</p>
          <div className={styles.rangeRow} style={{gridTemplateColumns: '1fr 3rem'}}>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{width: `${grade.autonomy}%`}} />
            </div>
            <strong>{grade.autonomy}%</strong>
          </div>
        </div>

        <p className="it-demo__label" style={{marginTop: '0.75rem'}}>Типичные задачи</p>
        <ul className={styles.taskList}>
          {grade.tasks.map((t) => (
            <li key={t} className={styles.taskItem}>{t}</li>
          ))}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default GradeLadderPlayInner;
