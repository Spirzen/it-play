import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {matchResumeToVacancy} from '@/components/shared/kb/careerInteractiveEngines';
import {scoreBadgeClass, scoreToneClass, styles} from '@/components/shared/kb/basicsPlayUi';

const SAMPLE_VACANCY = `Middle Python-разработчик. Django, PostgreSQL, REST API, Docker, Git, pytest, code review.`;
const SAMPLE_RESUME = `Python 2 года, Django, Flask, PostgreSQL, REST, Git, unit-тесты. Ищу middle backend.`;

function AtsResumeMatcherPlayInner() {
  const [vacancy, setVacancy] = useState(SAMPLE_VACANCY);
  const [resume, setResume] = useState(SAMPLE_RESUME);

  const result = useMemo(() => matchResumeToVacancy(vacancy, resume), [vacancy, resume]);

  return (
    <DemoShell>
      <DemoCard
        title="ATS: сопоставление резюме и вакансии"
        subtitle="Упрощённый скрининг по ключевым словам — как первый фильтр в ATS"
      >
        <div className={styles.grid2}>
          <div className={styles.panel}>
            <label className="it-demo__label" htmlFor="ats-vacancy">Текст вакансии</label>
            <textarea
              id="ats-vacancy"
              className="it-demo__input"
              value={vacancy}
              onChange={(e) => setVacancy(e.target.value)}
            />
          </div>
          <div className={styles.panel}>
            <label className="it-demo__label" htmlFor="ats-resume">Резюме</label>
            <textarea
              id="ats-resume"
              className="it-demo__input"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.scorePanel}>
          <div className={clsx(styles.scoreValue, scoreToneClass(result.score))}>{result.score}%</div>
          <span className={scoreBadgeClass(result.score)}>
            {result.score >= 70 ? 'Вероятен проход ATS' : result.score >= 40 ? 'Нужна доработка' : 'Высокий риск отсева'}
          </span>
          <p className="it-demo__hint" style={{textAlign: 'center', marginTop: '0.25rem'}}>
            Совпало {result.matched.length} из {result.vacKeys.length} ключевых слов
          </p>
        </div>

        <div className={styles.grid2}>
          <div>
            <p className="it-demo__label">Совпадения</p>
            <div className={styles.keywordCloud}>
              {result.matched.map((k) => (
                <span key={k} className={`${styles.keyword} ${styles.kwMatch}`}>{k}</span>
              ))}
              {!result.matched.length && <span className="it-demo__hint">—</span>}
            </div>
          </div>
          <div>
            <p className="it-demo__label">Добавьте в резюме</p>
            <div className={styles.keywordCloud}>
              {result.missing.slice(0, 14).map((k) => (
                <span key={k} className={`${styles.keyword} ${styles.kwMiss}`}>{k}</span>
              ))}
              {!result.missing.length && <span className="it-demo__hint">Все ключевые слова найдены</span>}
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default AtsResumeMatcherPlayInner;
