import React, {useState} from 'react';
import {MetricGrid, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

export default function AcidTransactionPlay() {
  const [balanceA, setBalanceA] = useState(1000);
  const [balanceB, setBalanceB] = useState(500);
  const [log, setLog] = useState([]);
  const [committed, setCommitted] = useState(true);

  const transfer = (amount) => {
    setLog([]);
    setCommitted(false);
    const steps = [
      `BEGIN`,
      `UPDATE accounts SET bal = bal - ${amount} WHERE id = 'A'`,
      `UPDATE accounts SET bal = bal + ${amount} WHERE id = 'B'`,
    ];
    if (balanceA < amount) {
      setLog([...steps, 'ERROR: insufficient funds', 'ROLLBACK']);
      setCommitted(true);
      return;
    }
    setBalanceA((a) => a - amount);
    setBalanceB((b) => b + amount);
    setLog([...steps, 'COMMIT']);
    setCommitted(true);
  };

  return (
    <PlayRoot title="ACID и транзакции" subtitle="Перевод между счетами — commit или rollback">
      <MetricGrid items={[{label: 'Account A', value: String(balanceA)}, {label: 'Account B', value: String(balanceB)}]} />
      <button type="button" className="it-demo__btn it-demo__btn--primary" disabled={!committed} onClick={() => transfer(200)}>
        Transfer 200
      </button>
      <button type="button" className="it-demo__btn it-demo__btn--secondary" disabled={!committed} onClick={() => transfer(5000)}>
        Transfer 5000 (fail)
      </button>
      <pre className="it-demo__output">{log.join('\n') || 'Нажмите transfer'}</pre>
    </PlayRoot>
  );
}
