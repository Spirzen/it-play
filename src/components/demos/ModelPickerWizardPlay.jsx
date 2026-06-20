import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/ModelPickerWizardPlay.module.css';

const STEPS = [
  {
    id: 'task',
    title: 'Задача',
    options: [
      {id: 'chat', label: 'Чат и тексты', icon: '💬'},
      {id: 'code', label: 'Генерация кода', icon: '⌨️'},
      {id: 'rag', label: 'Ответы по документам', icon: '📄'},
      {id: 'reason', label: 'Сложная аналитика', icon: '🧠'},
    ],
  },
  {
    id: 'lang',
    title: 'Язык',
    options: [
      {id: 'ru', label: 'Русский — приоритет', icon: '🇷🇺'},
      {id: 'en', label: 'В основном английский', icon: '🇬🇧'},
      {id: 'multi', label: 'Мультиязычность', icon: '🌐'},
    ],
  },
  {
    id: 'privacy',
    title: 'Данные',
    options: [
      {id: 'public', label: 'Нет ПДн', icon: '✓'},
      {id: 'pdn', label: 'ПДн / коммерческая тайна', icon: '🔒'},
      {id: 'zdr', label: 'Строгий контур (ZDR)', icon: '🏢'},
    ],
  },
  {
    id: 'budget',
    title: 'Бюджет',
    options: [
      {id: 'free', label: 'Минимальный / free', icon: '💸'},
      {id: 'mid', label: 'Средний (API)', icon: '💳'},
      {id: 'high', label: 'Качество важнее цены', icon: '⭐'},
    ],
  },
];

function recommend(answers) {
  const {task, lang, privacy, budget} = answers;
  if (privacy === 'zdr' || privacy === 'pdn') {
    if (lang === 'ru') return {name: 'GigaChat / YandexGPT (on-prem)', why: 'Контур РФ и контроль данных.'};
    return {name: 'Llama / Mistral в Ollama', why: 'Локальный инференс без утечки в облако.'};
  }
  if (task === 'code' && budget !== 'free') return {name: 'Claude / GPT-4o / DeepSeek Coder', why: 'Сильные coding-модели с API.'};
  if (task === 'reason') return {name: 'o-series / DeepSeek-R1 / Claude reasoning', why: 'Модели с цепочкой рассуждений.'};
  if (task === 'rag' && budget === 'mid') return {name: 'GPT-4o mini / Claude Haiku + RAG', why: 'Баланс цены и качества на длинном контексте.'};
  if (lang === 'ru' && budget === 'free') return {name: 'GigaChat Free / YandexGPT lite', why: 'Русский язык без оплаты API.'};
  if (budget === 'free') return {name: 'ChatGPT free / Gemini / локальная Llama', why: 'Старт без бюджета.'};
  if (budget === 'high') return {name: 'GPT-4o / Claude Opus / Gemini Pro', why: 'Максимум качества в облаке.'};
  return {name: 'GPT-4o mini / Claude Haiku / DeepSeek', why: 'Универсальный API среднего сегмента.'};
}

function ModelPickerWizardPlayInner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = STEPS[step];
  const result = useMemo(() => (step >= STEPS.length ? recommend(answers) : null), [step, answers]);

  const pick = (optionId) => {
    setAnswers((a) => ({...a, [current.id]: optionId}));
    setStep((s) => s + 1);
  };

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Выбор LLM" subtitle="Мастер из 4 шагов — рекомендация по вашему сценарию">
        {!result ? (
          <div className={shared.stack}>
            <div className={shared.progressTrack}>
              <div className={shared.progressFill} style={{width: `${((step + 1) / STEPS.length) * 100}%`}} />
            </div>
            <p className={shared.sectionTitle}>
              Шаг {step + 1} / {STEPS.length} · {current.title}
            </p>
            <div className={styles.options}>
              {current.options.map((o) => (
                <button key={o.id} type="button" className={styles.option} onClick={() => pick(o.id)}>
                  <span className={styles.optionIcon} aria-hidden>{o.icon}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={shared.panelAccent}>
            <p className={styles.resultTitle}>Рекомендация</p>
            <p className={styles.resultName}>{result.name}</p>
            <p className={shared.hint}>{result.why}</p>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => { setStep(0); setAnswers({}); }}>
              Пройти снова
            </button>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ModelPickerWizardPlayInner;
