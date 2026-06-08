import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/BuildProcessFlow.module.css';

const STEPS = [
  {
    id: 0,
    shortLabel: 'Исходник',
    title: 'Написание исходного кода',
    subtitle: 'Создание программы',
    description:
      'Разработчик пишет код на языке высокого уровня. Файлы .c, .cpp, .java, .go хранятся на диске — процессор их не выполняет напрямую.',
    developerAction: 'Написание в IDE или редакторе',
    systemAction: 'Сохранение файлов на диске',
    artifact: 'main.c',
    icon: '✍️',
    color: 'var(--build-code)',
  },
  {
    id: 1,
    shortLabel: 'Сборка',
    title: 'Запуск сборки',
    subtitle: 'Инициализация процесса',
    description:
      'Команда Build в IDE или вызов make / cmake из терминала запускает цепочку инструментов сборки.',
    developerAction: 'Ctrl+Shift+B, make, dotnet build',
    systemAction: 'Активация препроцессора и компилятора',
    artifact: 'build.log',
    icon: '▶️',
    color: 'var(--build-start)',
  },
  {
    id: 2,
    shortLabel: 'Препроц.',
    title: 'Препроцессинг',
    subtitle: 'Предварительная обработка',
    description:
      'Препроцессор обрабатывает #include, #define и условную компиляцию, удаляет комментарии. На выходе — расширенный исходник.',
    developerAction: 'Директивы #include, #define',
    systemAction: 'Подстановка макросов и заголовков',
    artifact: 'main.i',
    icon: '🔧',
    color: 'var(--build-pre)',
  },
  {
    id: 3,
    shortLabel: 'Компил.',
    title: 'Компиляция',
    subtitle: 'Трансляция в объектный код',
    description:
      'Компилятор проверяет синтаксис и типы, генерирует объектные файлы (.o / .obj) с машинными инструкциями.',
    developerAction: 'Исправление ошибок компиляции',
    systemAction: 'Лексический, синтаксический и семантический анализ',
    artifact: 'main.o',
    icon: '⚙️',
    color: 'var(--build-compile)',
  },
  {
    id: 4,
    shortLabel: 'Линковка',
    title: 'Линковка',
    subtitle: 'Исполняемый файл',
    description:
      'Линковщик объединяет объектные файлы и библиотеки, разрешает символы и формирует .exe, .elf или бинарник без расширения.',
    developerAction: 'Пути к .lib, .a, .so',
    systemAction: 'ld, link.exe — связывание секций',
    artifact: 'app.exe',
    icon: '🔗',
    color: 'var(--build-link)',
  },
  {
    id: 5,
    shortLabel: 'Релиз',
    title: 'Публикация',
    subtitle: 'Развёртывание',
    description:
      'Артефакт упаковывают и доставляют: Docker-образ, магазин приложений, установщик или сервер CI/CD.',
    developerAction: 'Pipeline, подпись, конфигурация',
    systemAction: 'Загрузка в целевое окружение',
    artifact: 'release.zip',
    icon: '🚀',
    color: 'var(--build-ship)',
  },
];

function BuildProcessFlowInner() {
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const canNext = step < STEPS.length - 1;
  const canPrev = step > 0;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Процесс сборки приложения" subtitle="От исходника до публикации — шесть этапов">
        <div
          className={styles.stepTrack}
          role="tablist"
          aria-label="Этапы сборки"
        >
          {STEPS.map((s, idx) => {
            const isActive = idx === step;
            const isDone = idx < step;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'step' : undefined}
                className={clsx(
                  styles.stepChip,
                  isActive && styles.stepChipActive,
                  isDone && styles.stepChipDone,
                )}
                style={{'--step-color': s.color}}
                onClick={() => setStep(idx)}
              >
                <span className={styles.stepIcon} aria-hidden>
                  {isDone ? '✓' : s.icon}
                </span>
                <span className={styles.stepLabel}>{s.shortLabel}</span>
                <span className={styles.stepIndex}>{idx + 1}/6</span>
              </button>
            );
          })}
        </div>

        <div className={styles.progressMeta}>
          <span>
            Этап <strong>{step + 1}</strong> из {STEPS.length}
          </span>
          <span>{current.subtitle}</span>
        </div>

        <div className="it-demo__progress" style={{marginBottom: '1rem'}}>
          <div
            className="it-demo__progress-bar"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: `linear-gradient(90deg, ${current.color}, var(--ifm-color-primary))`,
            }}
          />
        </div>

        <div
          className={styles.stageCard}
          style={{'--step-color': current.color}}
          role="tabpanel"
          aria-labelledby={`build-step-${step}`}
        >
          <div className={styles.stageHeader}>
            <span className={styles.stageIconWrap} aria-hidden>
              {current.icon}
            </span>
            <div className={styles.stageTitles}>
              <h3 className={styles.stageTitle} id={`build-step-${step}`}>
                {current.title}
              </h3>
              <p className={styles.stageSubtitle}>{current.subtitle}</p>
            </div>
          </div>
          <p className={styles.stageDescription}>{current.description}</p>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailCard}>
            <strong>Разработчик</strong>
            {current.developerAction}
          </div>
          <div className={styles.detailCard}>
            <strong>Система</strong>
            {current.systemAction}
          </div>
        </div>

        <div className={styles.artifactRow}>
          <span>Артефакт:</span>
          <code className={styles.artifact}>{current.artifact}</code>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={!canPrev}
            onClick={() => setStep((s) => s - 1)}
          >
            ← Назад
          </button>
          {step > 0 && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setStep(0)}>
              В начало
            </button>
          )}
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            style={
              canNext
                ? {background: current.color, borderColor: current.color}
                : undefined
            }
          >
            {canNext ? `Далее: ${STEPS[step + 1].shortLabel}` : 'Готово'}
          </button>
        </div>

        {(step === 3 || step === 4) && (
          <div className={styles.buildTypes}>
            <span className={styles.buildTypesTitle}>Типы сборки</span>
            <div className={styles.buildTypeRow}>
              <div className={styles.buildDebug}>
                <strong>Debug</strong> — отладочные символы, слабая оптимизация, удобна для пошаговой отладки.
              </div>
              <div className={styles.buildRelease}>
                <strong>Release</strong> — агрессивная оптимизация, меньший размер, без лишней отладочной информации.
              </div>
            </div>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default BuildProcessFlowInner;
