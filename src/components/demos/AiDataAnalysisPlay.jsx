import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const TIERS = [
  {
    id: 'low',
    label: 'Низкий',
    tools: 'Sheets AI, Tableau AI',
    prompt: 'Покажи динамику выручки по регионам за полгода',
    result: 'Готовый график и краткая сводка без кода.',
  },
  {
    id: 'mid',
    label: 'Средний',
    tools: 'Power BI, Pandas AI',
    prompt: 'Какие три товара с наибольшим средним чеком?',
    result: 'Запрос к модели → сгенерированный pandas/SQL → таблица ответа.',
  },
  {
    id: 'high',
    label: 'Высокий',
    tools: 'Python + scikit-learn, локальные LLM',
    prompt: 'Обучи RandomForest на churn и выведи feature importance',
    result: 'Полный контроль пайплайна, метрики и артефакты модели.',
  },
];

const STEPS = ['Промпт', 'Понимание задачи', 'Код / запрос', 'Ответ'];

function AiDataAnalysisPlayInner() {
  const [tierId, setTierId] = useState('mid');
  const [step, setStep] = useState(0);
  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[1];

  const advance = () => setStep((s) => (s + 1) % STEPS.length);

  return (
    <DemoShell>
      <DemoCard
        title="ИИ в анализе данных"
        subtitle="Уровень инструмента и путь от вопроса к результату"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(toolStyles.chip, tierId === t.id && toolStyles.chipActive)}
              onClick={() => {
                setTierId(t.id);
                setStep(0);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p style={{fontSize: '0.84rem', margin: '0 0 0.5rem'}}>
          Инструменты: <strong>{tier.tools}</strong>
        </p>
        <div style={{display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem'}}>
          {STEPS.map((label, i) => (
            <span
              key={label}
              style={{
                fontSize: '0.78rem',
                padding: '0.2rem 0.45rem',
                borderRadius: 6,
                border: '1px solid var(--ifm-color-emphasis-300)',
                background: i === step ? 'rgba(var(--ifm-color-primary-rgb), 0.12)' : 'transparent',
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <p
          style={{
            fontSize: '0.86rem',
            padding: '0.55rem 0.65rem',
            borderRadius: 8,
            background: 'var(--ifm-color-emphasis-100)',
            margin: '0 0 0.65rem',
          }}
        >
          {step === 0 && <>Промпт: "{tier.prompt}"</>}
          {step === 1 && <>Семантика: агрегация, фильтр периода, группировка.</>}
          {step === 2 && <>Выполнение на датасете (авто-код или встроенная мера).</>}
          {step === 3 && <>{tier.result}</>}
        </p>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={advance}>
          Следующий шаг
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default AiDataAnalysisPlayInner;
