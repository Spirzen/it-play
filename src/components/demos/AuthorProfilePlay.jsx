import React, {useMemo, useState} from 'react';
import Link from '@/components/shared/KbLink';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  AUTHOR_ROLES,
  AUTHOR_ONLINE_TOOLS,
  CONTACTS,
  INTERESTS,
  PROJECT_STATS,
  ROLE_GROUPS,
  SKILL_AXES,
  SUPPORT_CHANNELS,
} from '@/components/shared/kb/authorProfileEngine';
import styles from '@/components/demos/AuthorProfilePlay.module.css';

const DEFAULT_ROLES = ['author', 'editor', 'teacher', 'dev', 'analyst'];

function AuthorProfilePlayInner() {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [interestId, setInterestId] = useState('it');
  const [copiedId, setCopiedId] = useState(null);

  const toggleRole = (id) => {
    setRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const activeRoles = useMemo(
    () => AUTHOR_ROLES.filter((r) => roles.includes(r.id)),
    [roles],
  );

  const groupsUsed = useMemo(
    () => [...new Set(activeRoles.map((r) => r.group))],
    [activeRoles],
  );

  const interest = INTERESTS.find((i) => i.id === interestId) ?? INTERESTS[0];

  const copyValue = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Профиль создателя &quot;Вселенная IT&quot;"
        subtitle="Роли в проекте, компетенции и способы поддержки — соберите свой взгляд на автора"
      >
        <div className={styles.hero}>
          <div className={styles.avatar} aria-hidden="true">
            ТТ
          </div>
          <div>
            <h4 className={styles.heroName}>Тагиров Тимур Владиславович</h4>
            <p className={styles.heroTag}>
              Систематизатор · преподаватель · технический писатель
            </p>
          </div>
        </div>

        <div className={styles.stats}>
          {PROJECT_STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <p className="it-demo__label">Роли в проекте (можно несколько)</p>
        <div className={styles.roleChips}>
          {AUTHOR_ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(styles.roleChip, roles.includes(r.id) && styles.roleChipOn)}
              style={
                roles.includes(r.id)
                  ? {'--role-color': ROLE_GROUPS[r.group].color}
                  : undefined
              }
              onClick={() => toggleRole(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {activeRoles.length > 0 ? (
          <p className={styles.roleSummary}>
            Выбрано: {activeRoles.map((r) => r.label).join(', ')}.
            {groupsUsed.length >= 2
              ? ' Профиль междисциплинарный — контент и инженерия в одном проекте.'
              : ' Сфокусированный профиль в одной зоне ответственности.'}
          </p>
        ) : (
          <p className="it-demo__hint">Выберите хотя бы одну роль</p>
        )}

        <div className={styles.skills}>
          <p className="it-demo__label">Компетенции (оценка автора)</p>
          {SKILL_AXES.map((axis) => (
            <div key={axis.id} className={styles.skillRow}>
              <span className={styles.skillLabel}>{axis.label}</span>
              <div className={styles.skillBar}>
                <div
                  className={styles.skillFill}
                  style={{width: `${axis.value}%`}}
                />
              </div>
              <span className={styles.skillVal}>{axis.value}</span>
            </div>
          ))}
        </div>

        <p className="it-demo__label">Увлечения</p>
        <div className={styles.interestChips}>
          {INTERESTS.map((i) => (
            <button
              key={i.id}
              type="button"
              className={clsx(
                styles.interestBtn,
                interestId === i.id && styles.interestBtnActive,
              )}
              onClick={() => setInterestId(i.id)}
            >
              <span aria-hidden="true">{i.emoji}</span> {i.label}
            </button>
          ))}
        </div>
        <p className={styles.interestNote}>
          {interest.emoji} <strong>{interest.label}</strong> — часть жизни автора вне
          энциклопедии; проект остаётся нейтральным и образовательным.
        </p>

        <div className={styles.support}>
          <p className="it-demo__label">Поддержка проекта</p>
          <div className={styles.supportGrid}>
            {SUPPORT_CHANNELS.map((ch) => (
              <div key={ch.id} className={styles.supportCard}>
                <span className={styles.supportLabel}>{ch.label}</span>
                {ch.href ? (
                  <a href={ch.href} target="_blank" rel="noopener noreferrer">
                    {ch.value}
                  </a>
                ) : (
                  <code className={styles.supportCode}>{ch.value}</code>
                )}
                {ch.copy && (
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
                    onClick={() => copyValue(ch.id, ch.value)}
                  >
                    {copiedId === ch.id ? '✓' : 'Копировать'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.onlineTools}>
          <p className="it-demo__label">Онлайн-инструменты (spirzen.github.io)</p>
          <ul className={styles.onlineToolsList}>
            {AUTHOR_ONLINE_TOOLS.map((tool) => (
              <li key={tool.id}>
                <a href={tool.href} target="_blank" rel="noopener noreferrer">
                  {tool.shortName}
                </a>
                <span className={styles.onlineToolsDesc}> — {tool.tagline}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.contacts}>
          {CONTACTS.map((c) => (
            <a key={c.label} href={c.href} className={styles.contactLink}>
              {c.label}: {c.text}
            </a>
          ))}
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Манифест и лицензия: <Link to="/about/manifest">Манифест</Link>,{' '}
          <Link to="/about/license">Лицензия</Link>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AuthorProfilePlayInner;
