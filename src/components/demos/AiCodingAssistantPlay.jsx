import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AiCodingAssistantPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const SCENARIOS = [
  {
    id: 'complete',
    label: 'Автодополнение',
    starter: 'def calculate_total_price(items):\n    total = 0\n    for item in items:\n        ',
    ghost: 'total += item.price * item.quantity\n    return total',
    note: 'IDE анализирует тип item и предлагает продолжение цикла.',
  },
  {
    id: 'refactor',
    label: 'Рефакторинг',
    starter: 'result = []\nfor x in data:\n    if x > 0:\n        result.append(x * 2)',
    ghost: '# предложение: result = [x * 2 for x in data if x > 0]',
    note: 'Ассистент предлагает list comprehension — проверьте читаемость и тесты.',
  },
  {
    id: 'test',
    label: 'Генерация теста',
    starter: 'def slugify(text):\n    return text.lower().replace(" ", "-")',
    ghost: '\n\ndef test_slugify():\n    assert slugify("Hello World") == "hello-world"',
    note: 'Сгенерированный тест нужно запустить и дополнить граничные случаи.',
  },
];

function AiCodingAssistantPlayInner() {
  const [scenarioId, setScenarioId] = useState('complete');
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const sc = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const pick = (id) => {
    setScenarioId(id);
    setAccepted(false);
    setRejected(false);
  };

  return (
    <DemoShell>
      <DemoCard
        title="AI в IDE: подсказка, не замена ревью"
        subtitle="Tab принимает ghost text; Esc отклоняет — всегда проверяйте результат"
      >
        <div className={toolStyles.chips}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, scenarioId === s.id && toolStyles.chipActive)}
              onClick={() => pick(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.editor}>
          <pre className={styles.codeUser}>{sc.starter}</pre>
          {!accepted && !rejected && (
            <pre className={styles.codeGhost} aria-label="Предложение AI">
              {sc.ghost}
            </pre>
          )}
          {accepted && <pre className={styles.codeAccepted}>{sc.ghost}</pre>}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={accepted || rejected}
            onClick={() => setAccepted(true)}
          >
            Tab — принять
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={accepted || rejected}
            onClick={() => setRejected(true)}
          >
            Esc — отклонить
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => pick(scenarioId)}
          >
            Сброс
          </button>
        </div>

        <p className="it-demo__hint" style={{margin: 0}}>
          {sc.note}
          {rejected && ' Отклонено: остаётся только ваш код.'}
          {accepted && ' Принято: проверьте линтер, тесты и утечки секретов перед коммитом.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AiCodingAssistantPlayInner;
