import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SAMPLE_PROJECTS} from '@/components/shared/kb/petProjectPlannerEngine';
import styles from '@/components/demos/DeveloperPortfolioPlay.module.css';

const EXTRA_SKILLS = {
  calc: ['Вёрстка', 'Базовый JS'],
  todo: ['CRUD', 'Хранение в браузере'],
  api: ['REST', 'SQL/ORM', 'Деплой'],
  cli: ['CLI args', 'Файлы', 'Тесты'],
};

function DeveloperPortfolioPlayInner() {
  const [projectId, setProjectId] = useState('todo');
  const [completed, setCompleted] = useState(new Set(['calc']));
  const project = SAMPLE_PROJECTS.find((p) => p.id === projectId) ?? SAMPLE_PROJECTS[1];

  const skills = useMemo(
    () => [...new Set(SAMPLE_PROJECTS.filter((p) => completed.has(p.id)).flatMap((p) => p.skills))],
    [completed],
  );

  const toggleDone = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор портфолио"
        subtitle="Отмечайте реализованные пет-проекты — накапливаются навыки для резюме"
      >
        <div className={styles.grid}>
          {SAMPLE_PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(
                styles.card,
                projectId === p.id && styles.cardActive,
                completed.has(p.id) && styles.cardDone,
              )}
              onClick={() => setProjectId(p.id)}
            >
              <span className={styles.cardTitle}>{p.name}</span>
              <span className={styles.cardStack}>{p.stack}</span>
              <label
                className={styles.doneLabel}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={completed.has(p.id)}
                  onChange={() => toggleDone(p.id)}
                />
                Сделано
              </label>
            </button>
          ))}
        </div>

        <div className={styles.detail}>
          <h5 className={styles.detailTitle}>{project.name}</h5>
          <p>
            Стек: <strong>{project.stack}</strong>
          </p>
          <p>Фокус навыков: {project.skills.join(', ')}</p>
          {EXTRA_SKILLS[project.id] && (
            <p className="it-demo__hint" style={{margin: 0}}>
              Дополнительно прокачайте: {EXTRA_SKILLS[project.id].join(', ')}
            </p>
          )}
        </div>

        <div className={styles.skills}>
          <span className="it-demo__label">Навыки в портфолио ({skills.length})</span>
          <div className={styles.skillTags}>
            {skills.length ? (
              skills.map((s) => (
                <span key={s} className={styles.tag}>
                  {s}
                </span>
              ))
            ) : (
              <span className="it-demo__hint">Отметьте хотя бы один проект как "Сделано"</span>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DeveloperPortfolioPlayInner;
