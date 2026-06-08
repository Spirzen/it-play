import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/ProgrammingTasksPlay.module.css';

const CATEGORIES = [
  {
    id: 'create',
    label: 'Создание кода',
    icon: '✏️',
    color: '#1565c0',
    items: [
      {title: 'Маппинг данных', example: 'JSON API → объект заказа', tools: ['Валидация типов', 'Переименование полей']},
      {title: 'I/O', example: 'Чтение CSV, HTTP POST', tools: ['Кодировки', 'Таймауты', 'Повторы']},
      {title: 'Бизнес-логика', example: 'Расчёт скидки по правилам', tools: ['Правила', 'Валидация']},
    ],
  },
  {
    id: 'fix',
    label: 'Анализ и исправление',
    icon: '🔍',
    color: '#6a1b9a',
    items: [
      {title: 'Отладка', example: 'Breakpoint на строке 176', tools: ['Стек вызовов', 'Watch']},
      {title: 'Поиск багов', example: 'Что если передать null?', tools: ['Code review', 'Статический анализ']},
      {title: 'Линтер / компилятор', example: 'warning: unused variable', tools: ['ESLint', 'Roslyn']},
    ],
  },
  {
    id: 'improve',
    label: 'Модернизация',
    icon: '⚡',
    color: '#ef6c00',
    items: [
      {title: 'Оптимизация', example: '85% времени в одном методе', tools: ['Профайлер', 'Кэш']},
      {title: 'Реинжиниринг', example: 'Замена монолита на сервисы', tools: ['Canary', 'Параллельный прогон']},
      {title: 'Reverse engineering', example: 'Восстановить API legacy', tools: ['Wireshark', 'Дизассемблер']},
    ],
  },
  {
    id: 'support',
    label: 'Сопровождение',
    icon: '🛠️',
    color: '#2e7d32',
    items: [
      {title: 'Рефакторинг', example: 'Extract Method без смены поведения', tools: ['Тесты', 'IDE']},
      {title: 'i18n / l10n', example: 'Ключ greeting.welcome', tools: ['Ресурсы', 'Форматы дат']},
      {title: 'Модульные тесты', example: 'WhenBalanceNegative_Throws…', tools: ['Mock', 'Stub']},
    ],
  },
  {
    id: 'hard',
    label: 'Сложные дефекты',
    icon: '⚠️',
    color: '#c62828',
    items: [
      {title: 'Утечка памяти', example: 'Рост heap без GC', tools: ['Heap dump', 'Сравнение снимков']},
      {title: 'Гонка', example: 'counter++ из двух потоков', tools: ['ThreadSanitizer', 'Lock']},
      {title: 'Переполнение буфера', example: 'strcpy без границ', tools: ['ASan', 'Безопасные API']},
    ],
  },
];

function ProgrammingTasksPlayInner() {
  const [catId, setCatId] = useState('create');
  const [itemIdx, setItemIdx] = useState(0);
  const cat = CATEGORIES.find((c) => c.id === catId) ?? CATEGORIES[0];
  const item = cat.items[itemIdx] ?? cat.items[0];

  const selectCat = (id) => {
    setCatId(id);
    setItemIdx(0);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Карта задач программиста"
        subtitle="Выберите категорию — увидите типичные подзадачи, пример и инструменты"
      >
        <div className={styles.catBar}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.catBtn, catId === c.id && styles.catBtnActive)}
              style={
                catId === c.id
                  ? {borderColor: c.color, background: `color-mix(in srgb, ${c.color} 14%, transparent)`}
                  : undefined
              }
              onClick={() => selectCat(c.id)}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        <div className={styles.subTabs}>
          {cat.items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              className={clsx('it-demo__btn it-demo__btn--sm', itemIdx !== i && 'it-demo__btn--secondary')}
              onClick={() => setItemIdx(i)}
            >
              {it.title}
            </button>
          ))}
        </div>

        <div className={styles.card} style={{borderLeftColor: cat.color}}>
          <h5 className={styles.cardTitle}>{item.title}</h5>
          <p className={styles.example}>
            <strong>Пример:</strong> {item.example}
          </p>
          <div className={styles.tools}>
            {item.tools.map((t) => (
              <span key={t} className={styles.chip}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ProgrammingTasksPlayInner;
