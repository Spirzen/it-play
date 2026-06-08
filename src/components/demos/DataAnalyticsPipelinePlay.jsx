import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/DataAnalyticsPipelinePlay.module.css';

const PIPELINE = [
  {
    id: 'prep',
    label: 'Подготовка',
    text: 'Очистка, заполнение пропусков, нормализация и кодирование признаков.',
  },
  {
    id: 'eda',
    label: 'EDA',
    text: 'Сводки, распределения и корреляции для понимания данных.',
  },
  {
    id: 'model',
    label: 'Моделирование',
    text: 'Регрессия, классификация, кластеризация, ассоциативные правила.',
  },
  {
    id: 'valid',
    label: 'Валидация',
    text: 'Кросс-валидация и тестовая выборка для оценки обобщения.',
  },
  {
    id: 'interp',
    label: 'Интерпретация',
    text: 'Перевод метрик в бизнес-выводы и ограничения применимости.',
  },
];

const OLTP = [
  'Короткие транзакции INSERT/UPDATE',
  'Нормализованная схема (3НФ+)',
  'Миллисекунды задержки',
  'Операторы и клиентские системы',
];

const OLAP = [
  'Тяжёлые SELECT с агрегацией',
  'Звезда / снежинка, денормализация',
  'Секунды–минуты на запрос',
  'Аналитики и менеджеры',
];

function DataAnalyticsPipelinePlayInner() {
  const [mode, setMode] = useState('pipeline');
  const [stepIdx, setStepIdx] = useState(0);
  const [focus, setFocus] = useState('oltp');

  const step = PIPELINE[stepIdx];

  return (
    <DemoShell>
      <DemoCard
        title="Аналитический конвейер и OLTP / OLAP"
        subtitle="Пройдите этапы анализа данных или сравните операционную и аналитическую нагрузку"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          <button
            type="button"
            className={clsx(toolStyles.chip, mode === 'pipeline' && toolStyles.chipActive)}
            onClick={() => setMode('pipeline')}
          >
            Конвейер анализа
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, mode === 'oltp' && toolStyles.chipActive)}
            onClick={() => setMode('oltp')}
          >
            OLTP vs OLAP
          </button>
        </div>

        {mode === 'pipeline' ? (
          <>
            <div className={styles.pipeline}>
              {PIPELINE.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span className={styles.arrow} aria-hidden>
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    className={clsx(styles.node, i === stepIdx && styles.nodeActive)}
                    onClick={() => setStepIdx(i)}
                  >
                    {s.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <p className={styles.detail}>
              <strong>{step.label}:</strong> {step.text}
            </p>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={() => setStepIdx((i) => (i + 1) % PIPELINE.length)}
            >
              Следующий этап
            </button>
          </>
        ) : (
          <>
            <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
              <button
                type="button"
                className={clsx(toolStyles.chip, focus === 'oltp' && toolStyles.chipActive)}
                onClick={() => setFocus('oltp')}
              >
                OLTP
              </button>
              <button
                type="button"
                className={clsx(toolStyles.chip, focus === 'olap' && toolStyles.chipActive)}
                onClick={() => setFocus('olap')}
              >
                OLAP
              </button>
            </div>
            <div className={styles.compare}>
              <div className={clsx(styles.col, focus === 'oltp' && styles.colActive)}>
                <h5>OLTP</h5>
                <ul>
                  {OLTP.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className={clsx(styles.col, focus === 'olap' && styles.colActive)}>
                <h5>OLAP</h5>
                <ul>
                  {OLAP.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default DataAnalyticsPipelinePlayInner;
