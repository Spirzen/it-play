import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import {
  ActionBar,
  ChipRow,
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
  Section,
  StatusBanner,
  StepPipeline,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const STEPS = [
  {id: 'ingest', label: '1. Получить'},
  {id: 'validate', label: '2. Проверить'},
  {id: 'transform', label: '3. Преобразовать'},
  {id: 'rules', label: '4. Правила'},
  {id: 'persist', label: '5. Сохранить'},
  {id: 'log', label: '6. Лог'},
];

const SCENARIOS = {
  ok: {broken: null, detail: 'Заказ прошёл все этапы — запись в БД и событие в очередь.', tone: 'ok'},
  badEmail: {broken: 'validate', detail: 'Валидация отклонила email — пайплайн остановлен до transform.', tone: 'error'},
  badRules: {broken: 'rules', detail: 'Бизнес-правило: сумма отрицательна — сохранение заблокировано.', tone: 'error'},
};

export default function DataPipelinePlay() {
  const [scenario, setScenario] = useState('ok');
  const [active, setActive] = useState('ingest');
  const cfg = SCENARIOS[scenario];

  return (
    <PlayRoot title="Конвейер обработки данных" subtitle="Шесть этапов — выберите сценарий и шаг">
      <Section title="Сценарий">
        <div className={styles.grid2}>
          {Object.entries(SCENARIOS).map(([id, s]) => (
            <button
              key={id}
              type="button"
              className={clsx(styles.quizOption, scenario === id && styles.quizOptionGood)}
              onClick={() => setScenario(id)}
            >
              {id === 'ok' ? 'Успешный заказ' : id === 'badEmail' ? 'Невалидный email' : 'Нарушение правила'}
            </button>
          ))}
        </div>
      </Section>
      <StepPipeline steps={STEPS} activeId={active} onSelect={setActive} brokenStep={cfg.broken} />
      <Panel title={STEPS.find((s) => s.id === active)?.label}>
        <p className={styles.panelMuted}>{cfg.detail}</p>
        {cfg.broken === active && <StatusBanner tone="error">Ошибка на этом этапе — downstream не выполняется</StatusBanner>}
      </Panel>
      <MetricGrid
        items={[
          {label: 'Статус', value: cfg.broken ? 'FAILED' : 'OK', tone: cfg.broken ? 'error' : 'success'},
          {label: 'Этап сбоя', value: cfg.broken ?? '—'},
        ]}
      />
    </PlayRoot>
  );
}
