import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DevPrinciplesPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const PRINCIPLES = [
  {
    id: 'dry',
    label: 'DRY',
    bad: `if (user.role === 'admin') sendEmail(user);
if (user.role === 'admin') logAction(user);
if (user.role === 'admin') audit(user);`,
    good: `function forAdmin(user, fn) {
  if (user.role === 'admin') fn(user);
}
forAdmin(user, sendEmail);
forAdmin(user, logAction);`,
    hint: 'Повтор условия — вынесите в одну функцию или политику.',
  },
  {
    id: 'yagni',
    label: 'YAGNI',
    bad: `class UserService {
  save() {}
  exportToPdf() {}  // "на будущее"
  syncWithCrm() {}
}`,
    good: `class UserService {
  save() {}
}`,
    hint: 'Не добавляйте методы, пока нет требования в задаче.',
  },
  {
    id: 'naming',
    label: 'Имена',
    bad: `const d = new Date();
const x = calc(a, b);`,
    good: `const orderCreatedAt = new Date();
const totalPrice = calculateOrderTotal(items, taxRate);`,
    hint: 'Имя должно объяснять роль без комментария.',
  },
];

function DevPrinciplesPlayInner() {
  const [id, setId] = useState('dry');
  const [goodMode, setGoodMode] = useState(false);
  const p = PRINCIPLES.find((x) => x.id === id) ?? PRINCIPLES[0];

  return (
    <DemoShell>
      <DemoCard
        title="Принципы разработки на практике"
        subtitle="Сравните типичное нарушение и исправленный фрагмент"
      >
        <div className={toolStyles.chips}>
          {PRINCIPLES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, id === item.id && toolStyles.chipActive)}
              onClick={() => {
                setId(item.id);
                setGoodMode(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.toggle}>
          <button
            type="button"
            className={clsx(styles.modeBtn, !goodMode && styles.modeBad)}
            onClick={() => setGoodMode(false)}
          >
            До
          </button>
          <button
            type="button"
            className={clsx(styles.modeBtn, goodMode && styles.modeGood)}
            onClick={() => setGoodMode(true)}
          >
            После
          </button>
        </div>

        <pre className={clsx(styles.code, goodMode ? styles.codeGood : styles.codeBad)}>
          {goodMode ? p.good : p.bad}
        </pre>
        <p className="it-demo__hint" style={{margin: 0}}>
          {p.hint}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DevPrinciplesPlayInner;
