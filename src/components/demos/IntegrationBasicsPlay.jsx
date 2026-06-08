import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/shared/kb/testingDemo.module.css';

const SYSTEMS = [
  {id: 'shop', label: 'Интернет-магазин', role: 'инициатор заказа'},
  {id: 'pay', label: 'Платёжный шлюз', role: 'списание средств'},
  {id: 'wms', label: 'Склад (WMS)', role: 'сборка товара'},
  {id: 'delivery', label: 'Доставка', role: 'маршрут и трек-номер'},
];

const FLOW = [
  {from: 'shop', to: 'pay', msg: 'POST /payments {orderId, amount}', ok: true},
  {from: 'pay', to: 'shop', msg: '201 {status: "paid"}', ok: true},
  {from: 'shop', to: 'wms', msg: 'order.created → очередь', ok: true},
  {from: 'wms', to: 'delivery', msg: 'shipment.ready {weight, address}', ok: true},
  {from: 'delivery', to: 'shop', msg: 'webhook: delivered', ok: true},
];

function IntegrationBasicsPlayInner() {
  const [step, setStep] = useState(-1);
  const visible = step >= 0 ? FLOW.slice(0, step + 1) : [];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Интеграция в бизнес-процессе"
        subtitle="Один заказ — четыре автономные системы и согласованный обмен данными"
      >
        <div className={styles.grid3} style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
          {SYSTEMS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.card, step >= i && styles.cardActive)}
              onClick={() => setStep(i)}
            >
              <span className={styles.cardLabel}>{s.label}</span>
              <p className={styles.cardHint}>{s.role}</p>
            </button>
          ))}
        </div>

        {visible.map((m, i) => (
          <div key={i} className={clsx(styles.msg, m.ok ? styles.msgOk : styles.msgFail)}>
            <span>✓</span>
            <span>
              {SYSTEMS.find((s) => s.id === m.from)?.label} →{' '}
              {SYSTEMS.find((s) => s.id === m.to)?.label}: {m.msg}
            </span>
          </div>
        ))}

        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={() => setStep((s) => (s >= FLOW.length - 1 ? -1 : s + 1))}
        >
          {step < 0 ? 'Оформить заказ' : step < FLOW.length - 1 ? 'Следующий этап' : 'Сброс'}
        </button>
        <p className={styles.cardHint}>
          Интеграция связывает "информационные острова": каждая система знает только свой контракт обмена.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default IntegrationBasicsPlayInner;
