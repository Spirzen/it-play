import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/SystemDiscoveryDemo.module.css';

const CHECKLIST = [
  {id: 'docs', label: 'Прочитать документацию и схемы', done: false},
  {id: 'walk', label: 'Пройти ключевые сценарии в UI', done: false},
  {id: 'people', label: 'Интервью: заказчик, dev, QA, поддержка', done: false},
  {id: 'db', label: 'Изучить таблицы и связи в БД', done: false},
  {id: 'draw', label: 'Набросать схему сущностей и интеграций', done: false},
  {id: 'jira', label: 'Завести задачу на пробелы в документации', done: false},
];

const DECOMPOSITION = [
  {id: 'root', label: 'Система "Склад"', children: ['proc', 'data', 'ext']},
  {id: 'proc', label: 'Процессы: приёмка, отгрузка', children: []},
  {id: 'data', label: 'Данные: SKU, остатки, ячейки', children: []},
  {id: 'ext', label: 'Внешние: ERP, TMS', children: []},
];

function SystemDiscoveryDemoInner() {
  const [items, setItems] = useState(CHECKLIST);
  const [notes, setNotes] = useState('');
  const [expanded, setExpanded] = useState(['root', 'data']);

  const toggle = (id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? {...i, done: !i.done} : i)));
  };

  const progress = Math.round((items.filter((i) => i.done).length / items.length) * 100);

  return (
    <DemoShell>
      <DemoCard
        title="Исследование и декомпозиция системы"
        subtitle="Чек-лист знакомства с legacy и дерево декомпозиции"
      >
        <div className={styles.top}>
          <div className={styles.progress}>
            <div className={styles.bar} style={{width: `${progress}%`}} />
          </div>
          <span>{progress}% исследования</span>
        </div>

        <div className={styles.grid}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <label>
                  <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
                  <span className={clsx(item.done && styles.done)}>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className={styles.tree}>
            <h4>Декомпозиция</h4>
            {DECOMPOSITION.map((node) => (
              <div
                key={node.id}
                className={clsx(
                  styles.node,
                  node.id !== 'root' && styles.nodeChild,
                  expanded.includes(node.id) && styles.nodeOpen,
                )}
              >
                <button
                  type="button"
                  className={styles.nodeBtn}
                  onClick={() =>
                    setExpanded((prev) =>
                      prev.includes(node.id)
                        ? prev.filter((x) => x !== node.id)
                        : [...prev, node.id],
                    )
                  }
                >
                  {node.children.length ? (expanded.includes(node.id) ? '▼' : '▶') : '•'}{' '}
                  {node.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className={styles.notes}>
          Заметки и "глупые вопросы"
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Зачем три кнопки удаления? Что при отмене в середине процесса?"
          />
        </label>
      </DemoCard>
    </DemoShell>
  );
}

export default SystemDiscoveryDemoInner;
