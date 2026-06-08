import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/LanguageAbstractionPlay.module.css';

const LEVELS = [
  {
    id: 'human',
    label: 'Человек',
    height: 100,
    color: '#2e7d32',
    traits: ['Логика на естественном языке', 'Без синтаксиса компилятора'],
    sample: 'Если возраст больше 18 — пропустить, иначе отказать.',
    managed: null,
  },
  {
    id: 'python',
    label: 'Python',
    height: 78,
    color: '#1565c0',
    traits: ['Динамические типы', 'Сборщик мусора', 'Интерпретация / байт-код'],
    sample: `age = 19\nif age > 18:\n    allow_entry()\nelse:\n    deny_entry()`,
    managed: 'CPython — рантайм управляет памятью и объектами',
  },
  {
    id: 'cpp',
    label: 'C++',
    height: 55,
    color: '#6a1b9a',
    traits: ['Средний уровень: ООП + указатели', 'Компиляция в машинный код', 'Контроль памяти при необходимости'],
    sample: `int age = 19;\nif (age > 18) allow();\nelse deny();`,
    managed: 'Неуправляемый код; CLR/JVM не участвуют',
  },
  {
    id: 'c',
    label: 'C',
    height: 32,
    color: '#c62828',
    traits: ['Явные типы', 'malloc/free', 'Прямой доступ к памяти'],
    sample: `int age = 19;\nif (age > 18) allow();\nelse deny();`,
    managed: 'Нет среды выполнения — только ОС и libc',
  },
  {
    id: 'asm',
    label: 'Машина',
    height: 8,
    color: '#37474f',
    traits: ['Регистры, флаги, переходы', 'Один такт — одна микрооперация'],
    sample: `cmp eax, 18\njg  allow_label\njmp deny_label`,
    managed: null,
  },
];

function LanguageAbstractionPlayInner() {
  const [levelId, setLevelId] = useState('python');
  const [showManaged, setShowManaged] = useState(true);
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[1];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Башня абстракции языков"
        subtitle="Чем выше уровень — тем проще писать; чем ниже — тем ближе к железу"
      >
        <div className={styles.tower}>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.tier, levelId === l.id && styles.tierActive)}
              style={{
                flexGrow: l.height,
                borderColor: l.color,
                background: levelId === l.id
                  ? `color-mix(in srgb, ${l.color} 22%, var(--ifm-background-surface-color))`
                  : undefined,
              }}
              onClick={() => setLevelId(l.id)}
            >
              <span className={styles.tierLabel}>{l.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.detail}>
          <ul className={styles.traits}>
            {level.traits.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <pre className={styles.code}>{level.sample}</pre>
          {showManaged && level.managed && (
            <p className={styles.managed}>
              <strong>Управляемость:</strong> {level.managed}
            </p>
          )}
          {showManaged && level.managed === null && level.id !== 'human' && (
            <p className={styles.managed}>
              <strong>Управляемость:</strong> не применимо на этом уровне представления.
            </p>
          )}
        </div>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showManaged}
            onChange={(e) => setShowManaged(e.target.checked)}
          />
          Показать слой runtime / управления памятью
        </label>
      </DemoCard>
    </DemoShell>
  );
}

export default LanguageAbstractionPlayInner;
