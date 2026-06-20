import React, {useState} from 'react';
import clsx from 'clsx';
import {
  ActionBar,
  Hint,
  PlayRoot,
  Section,
  StatusBanner,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const QUIZ = [
  {
    q: 'Частые вставки в середину списка из миллиона элементов',
    options: ['Динамический массив', 'Связный список / deque', 'B-дерево', 'Bloom filter'],
    correct: 1,
    explain: 'Массив сдвигает O(n) элементов; deque/list — O(1) на концах.',
  },
  {
    q: 'LRU cache с быстрым get/put',
    options: ['Очередь FIFO', 'HashMap + двусвязный список', 'Стек', 'Матрица смежности'],
    correct: 1,
    explain: 'HashMap для O(1) lookup + list для порядка использования.',
  },
  {
    q: 'Очередь задач с приоритетом',
    options: ['Stack', 'Binary heap', 'CSV файл', 'Set'],
    correct: 1,
    explain: 'Куча даёт O(log n) insert/extract-max.',
  },
];

export default function StructurePickerQuiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const item = QUIZ[idx];

  return (
    <PlayRoot title="Выбор структуры данных" subtitle="Сценарий → структура (из FAQ раздела)">
      <Section title={`Вопрос ${idx + 1} / ${QUIZ.length}`}>
        <p style={{margin: 0, fontWeight: 600, lineHeight: 1.45}}>{item.q}</p>
      </Section>
      {item.options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          disabled={picked != null}
          className={clsx(
            styles.quizOption,
            picked != null && i === item.correct && styles.quizOptionGood,
            picked != null && picked === i && i !== item.correct && styles.quizOptionBad,
          )}
          onClick={() => setPicked(i)}
        >
          {opt}
        </button>
      ))}
      {picked != null && (
        <>
          {picked === item.correct ? (
            <StatusBanner tone="ok">Верно!</StatusBanner>
          ) : (
            <StatusBanner tone="error">Не совсем — см. пояснение ниже.</StatusBanner>
          )}
          <Hint>{item.explain}</Hint>
          <ActionBar>
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => { setPicked(null); setIdx((i) => (i + 1) % QUIZ.length); }}>
              Следующий вопрос
            </button>
          </ActionBar>
        </>
      )}
    </PlayRoot>
  );
}
