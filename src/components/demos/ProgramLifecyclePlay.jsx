import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './programPlays.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const VERSION = {major: 2, minor: 1, patch: 4};

const CHANGE_TYPES = [
  {id: 'patch', label: 'PATCH (багфикс)', bump: [0, 0, 1], example: 'Исправлена ошибка округления'},
  {id: 'minor', label: 'MINOR (фича)', bump: [0, 1, 0], example: 'Добавлена кнопка "Экспорт PDF"'},
  {id: 'major', label: 'MAJOR (ломающее)', bump: [1, 0, 0], example: 'Удалён старый API v1'},
];

const INSTALL_STEPS = [
  'Проверка требований (ОС, RAM, .NET)',
  'Распаковка файлов в Program Files',
  'Запись в реестр и ярлыки',
  'Установка зависимостей (VCRUNTIME)',
  'Регистрация службы (если нужно)',
  'Первый запуск и проверка',
];

function bumpVersion(v, [dm, dn, dp]) {
  return {
    major: v.major + dm,
    minor: v.minor + dn,
    patch: v.patch + dp,
  };
}

function formatVer(v) {
  return `v${v.major}.${v.minor}.${v.patch}`;
}

function ProgramLifecyclePlayInner() {
  const [version, setVersion] = useState(VERSION);
  const [changeLog, setChangeLog] = useState(['Стартовая версия v2.1.4']);
  const [installStep, setInstallStep] = useState(-1);

  const applyChange = (type) => {
    const next = bumpVersion(version, type.bump);
    setVersion(next);
    setChangeLog((prev) => [...prev, `${type.label}: ${type.example} → ${formatVer(next)}`]);
  };

  const runInstall = () => {
    setInstallStep(0);
    INSTALL_STEPS.forEach((_, i) => {
      setTimeout(() => setInstallStep(i), i * 700);
    });
    setTimeout(() => setInstallStep(INSTALL_STEPS.length), INSTALL_STEPS.length * 700);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Версии, обновления и установка"
        subtitle="SemVer фиксирует изменения; установщик копирует файлы и настраивает систему."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {CHANGE_TYPES.map((c) => (
            <button key={c.id} type="button" className={toolStyles.chip} onClick={() => applyChange(c)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.versionDisplay}>{formatVer(version)}</div>
        <ul style={{margin: '0 0 1rem', paddingLeft: '1.1rem', fontSize: '0.76rem', maxHeight: 100, overflow: 'auto'}}>
          {changeLog.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        <p className="it-demo__label">Симуляция установки</p>
        <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={runInstall} style={{marginBottom: '0.5rem'}}>
          ▶ Запустить setup.exe
        </button>
        <ol className={styles.installSteps}>
          {INSTALL_STEPS.map((label, i) => (
            <li
              key={label}
              className={clsx(
                styles.installStep,
                installStep > i && styles.installStepDone,
                installStep === i && styles.installStepCurrent,
              )}
            >
              <span className={styles.stepNum}>{i + 1}</span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
        <p className={styles.hint} style={{marginBottom: 0}}>
          Патч — маленькое исправление; обновление — плановый релиз; пересборка нужна после изменения исходного кода.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ProgramLifecyclePlayInner;
