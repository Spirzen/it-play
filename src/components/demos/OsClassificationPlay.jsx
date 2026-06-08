import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './osPlays.module.css';

const CLASSIFICATIONS = [
  {
    id: 'single-user',
    title: 'Однопользовательские',
    desc: 'Один активный пользователь за сеанс.',
    examples: 'Windows 11 Home на ПК',
  },
  {
    id: 'multi-user',
    title: 'Многопользовательские',
    desc: 'Несколько учётных записей и сессий.',
    examples: 'Linux-сервер, macOS, Unix',
  },
  {
    id: 'single-task',
    title: 'Однозадачные',
    desc: 'Одна программа в фокусе (исторически).',
    examples: 'MS-DOS',
  },
  {
    id: 'multi-task',
    title: 'Многозадачные',
    desc: 'Параллельно много процессов.',
    examples: 'Все современные ОС',
  },
  {
    id: 'rtos',
    title: 'Реального времени',
    desc: 'Гарантированные дедлайны.',
    examples: 'FreeRTOS, QNX, VxWorks',
  },
  {
    id: 'network',
    title: 'Сетевые',
    desc: 'Ресурсы и доступ по сети.',
    examples: 'Windows Server, Novell (истор.)',
  },
  {
    id: 'embedded',
    title: 'Встраиваемые',
    desc: 'Мало RAM/flash, узкая задача.',
    examples: 'Zephyr, Embedded Linux',
  },
];

const FAMILIES = [
  {
    id: 'windows',
    name: 'Windows',
    dev: 'Microsoft',
    license: 'Проприетарная',
    kernel: 'Windows NT',
    arch: 'x86, x64, ARM64',
    use: 'ПК, офис, игры, серверы',
    color: '#0078d4',
  },
  {
    id: 'linux',
    name: 'Linux',
    dev: 'Сообщество',
    license: 'Open Source (GPL)',
    kernel: 'Linux',
    arch: 'x86, x64, ARM…',
    use: 'Серверы, облако, встраиваемые',
    color: '#e95420',
  },
  {
    id: 'macos',
    name: 'macOS',
    dev: 'Apple',
    license: 'Проприетарная',
    kernel: 'XNU (гибрид)',
    arch: 'ARM64 (Apple Silicon)',
    use: 'Mac, творческие профессии',
    color: '#555',
  },
  {
    id: 'android',
    name: 'Android',
    dev: 'Google',
    license: 'AOSP + закрытые GMS',
    kernel: 'Linux',
    arch: 'ARM',
    use: 'Смартфоны (~70% рынка)',
    color: '#3ddc84',
  },
  {
    id: 'ios',
    name: 'iOS / iPadOS',
    dev: 'Apple',
    license: 'Проприетарная',
    kernel: 'Darwin',
    arch: 'ARM64',
    use: 'iPhone, iPad',
    color: '#147efb',
  },
  {
    id: 'bsd',
    name: 'FreeBSD / OpenBSD',
    dev: 'Сообщество BSD',
    license: 'Пермиссивная',
    kernel: 'BSD',
    arch: 'x64, ARM…',
    use: 'Серверы, TrueNAS, файрволы',
    color: '#ab2b28',
  },
];

function OsClassificationPlayInner() {
  const [classId, setClassId] = useState('multi-task');
  const [familyId, setFamilyId] = useState('windows');

  const klass = CLASSIFICATIONS.find((c) => c.id === classId) ?? CLASSIFICATIONS[3];
  const family = FAMILIES.find((f) => f.id === familyId) ?? FAMILIES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Классификация ОС"
        subtitle="По задачам, пользователям и архитектуре — не путать с &quot;семейством&quot; (Windows vs Unix)."
      >
        <div className={styles.classGrid}>
          {CLASSIFICATIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.classCard, classId === c.id && styles.classCardActive)}
              onClick={() => setClassId(c.id)}
            >
              <p className={styles.classTitle}>{c.title}</p>
              <p className={styles.classExamples}>{c.desc}</p>
            </button>
          ))}
        </div>
        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p style={{margin: 0, fontWeight: 600}}>{klass.title}</p>
          <p className={styles.hint}>{klass.desc}</p>
          <p className={styles.mono}>Пример: {klass.examples}</p>
        </div>
      </DemoCard>

      <DemoCard
        title="Крупнейшие семейства"
        subtitle="Сравните лицензию, ядро и типичное применение — как в таблице статьи."
      >
        <div className={styles.tabs}>
          {FAMILIES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(styles.tab, familyId === f.id && styles.tabActive)}
              onClick={() => setFamilyId(f.id)}
              style={familyId === f.id ? {borderColor: f.color, color: f.color} : undefined}
            >
              {f.name}
            </button>
          ))}
        </div>
        <table className={styles.osTable}>
          <tbody>
            <tr>
              <th>Разработчик</th>
              <td>{family.dev}</td>
            </tr>
            <tr>
              <th>Лицензия</th>
              <td>{family.license}</td>
            </tr>
            <tr>
              <th>Ядро</th>
              <td>{family.kernel}</td>
            </tr>
            <tr>
              <th>Архитектуры</th>
              <td>{family.arch}</td>
            </tr>
            <tr>
              <th>Применение</th>
              <td>{family.use}</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.hint}>
          Unix-подобные: Linux, macOS, Android, BSD — общие идеи (процессы, права, CLI), разные политики
          и экосистемы.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OsClassificationPlayInner;
