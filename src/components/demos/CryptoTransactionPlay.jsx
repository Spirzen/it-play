import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/shared/kb/testingDemo.module.css';

const STEPS = [
  {label: 'Инициация', text: 'Кошелёк: адрес получателя, сумма, комиссия gas'},
  {label: 'Подпись', text: 'Приватный ключ → ECDSA-подпись (публичный ключ не уходит в сеть)'},
  {label: 'Mempool', text: 'Узлы проверяют баланс, подпись, double-spend'},
  {label: 'Блок', text: 'Майнер/валидатор включает TX в блок → консенсус'},
  {label: 'Подтверждения', text: 'Каждый новый блок повышает необратимость перевода'},
];

function CryptoTransactionPlayInner() {
  const [step, setStep] = useState(-1);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Путь криптотранзакции"
        subtitle="От подписи в кошельке до записи в блокчейн"
      >
        {STEPS.map((s, i) => (
          <div
            key={s.label}
            className={clsx(styles.msg, step >= i ? styles.msgOk : '')}
            style={{opacity: step >= i ? 1 : 0.45}}
          >
            <span>{step > i ? '✓' : i + 1}</span>
            <span>
              <strong>{s.label}:</strong> {s.text}
            </span>
          </div>
        ))}
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={() => setStep((s) => (s >= STEPS.length - 1 ? -1 : s + 1))}
        >
          {step < 0 ? 'Отправить 0.01 BTC' : step < STEPS.length - 1 ? 'Далее' : 'Сброс'}
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default CryptoTransactionPlayInner;
