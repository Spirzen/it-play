import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {STAR_FIELDS, buildStarAnswer, starCompleteness} from '@/components/shared/kb/careerInteractiveEngines';
import {styles} from '@/components/shared/kb/basicsPlayUi';

function StarAnswerBuilderPlayInner() {
  const [fields, setFields] = useState({
    situation: 'В команде из 5 человек релиз срывался из-за неясных требований к API.',
    task: 'Нужно было согласовать контракт REST до конца спринта.',
    action: 'Провёл воркшоп с аналитиком, оформил OpenAPI-черновик, согласовал с фронтом.',
    result: 'Релиз вышел в срок, количество доработок после QA снизилось на 30%.',
  });

  const preview = useMemo(() => buildStarAnswer(fields), [fields]);
  const completeness = useMemo(() => starCompleteness(fields), [fields]);
  const setField = (id, value) => setFields((f) => ({...f, [id]: value}));

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор ответа STAR"
        subtitle="Situation → Task → Action → Result для поведенческих вопросов"
      >
        <div className={styles.starGrid}>
          {STAR_FIELDS.map((f) => (
            <div key={f.id}>
              <label className="it-demo__label" htmlFor={`star-${f.id}`}>{f.label}</label>
              <textarea
                id={`star-${f.id}`}
                className="it-demo__input"
                style={{minHeight: '4.5rem'}}
                value={fields[f.id]}
                onChange={(e) => setField(f.id, e.target.value)}
                placeholder={f.hint}
              />
            </div>
          ))}
        </div>

        <div className={styles.completenessRow}>
          <span className="it-demo__label" style={{margin: 0}}>Полнота</span>
          <div className={styles.barTrack} style={{flex: 1}}>
            <div className={styles.barFill} style={{width: `${completeness}%`}} />
          </div>
          <strong>{completeness}%</strong>
        </div>

        <div className={styles.previewBox}>
          {preview || 'Заполните все блоки — ответ появится здесь.'}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default StarAnswerBuilderPlayInner;
