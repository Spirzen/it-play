import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DomainModelPlay.module.css';

const PARTS = [
  {id: 'entity', label: 'Entity (Order)', desc: 'Имеет id, жизненный цикл, меняется во времени.'},
  {id: 'vo', label: 'Value Object (Money)', desc: 'Сумма + валюта; сравнивается по значению, без id.'},
  {id: 'agg', label: 'Aggregate Root', desc: 'Order — единая точка входа; LineItem только через Order.'},
];

function DomainModelPlayInner() {
  const [focus, setFocus] = useState('entity');
  const [total, setTotal] = useState(1200);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="DDD: заказ Order" subtitle="Entity, Value Object и граница агрегата">
        <div className={styles.types}>
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.typeBtn, focus === p.id && styles.typeBtnOn)}
              onClick={() => setFocus(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className={styles.desc}>{PARTS.find((p) => p.id === focus)?.desc}</p>
        <div className={styles.order}>
          <header>Order #42 (Aggregate Root)</header>
          <p>LineItem: Курс × 1</p>
          <p className={styles.vo}>Money VO: {total} RUB</p>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={focus !== 'agg'}
            onClick={() => setTotal((t) => t + 100)}
          >
            order.addLine() (+100)
          </button>
        </div>
        <p className={styles.footer}>
          {focus !== 'agg'
            ? 'Изменение только через Aggregate Root — выберите "Aggregate Root".'
            : 'Инвариант агрегата: сумма пересчитывается внутри Order.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DomainModelPlayInner;
