import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {calcAdd} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function UnitTestPytestPlayInner() {
  const [op, setOp] = useState('add');
  const [useMock, setUseMock] = useState(false);
  const [ran, setRan] = useState(false);

  const result = calcAdd(2, 3, op);
  const passed = result === 5;

  const terminal = useMemo(() => {
    if (!ran) return '$ pytest tests/test_calculator.py\n# нажмите "Запустить pytest"';
    if (passed) {
      return [
        'tests/test_calculator.py .',
        '',
        '1 passed in 0.01s',
        useMock ? '(мок БД: fetch_user → Bob, без sqlite)' : '',
      ]
        .filter(Boolean)
        .join('\n');
    }
    return [
      'tests/test_calculator.py F',
      '',
      'FAILED test_add_positive_numbers',
      `> assert ${result} == 5`,
      `E assert ${result} == 5`,
    ].join('\n');
  }, [ran, passed, result, useMock]);

  const mockTerminal = useMock
    ? 'mock_db.fetch_user(1) → {"name": "Bob"}\nassert_called_once_with(1) ✓'
    : 'Реальная БД: медленно, зависит от сети и данных';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Первый pytest: изоляция и регрессия"
        subtitle="Меняйте реализацию add и смотрите, как тест ловит поломку"
      >
        <p className="it-demo__label">Реализация в app/calculator.py</p>
        <div className={styles.grid2}>
          <button
            type="button"
            className={clsx(styles.card, op === 'add' && styles.cardActive)}
            onClick={() => {
              setOp('add');
              setRan(false);
            }}
          >
            <span className={styles.cardLabel}>return a + b</span>
            <p className={styles.cardHint}>Корректная логика</p>
          </button>
          <button
            type="button"
            className={clsx(styles.card, op === 'sub' && styles.cardActive)}
            onClick={() => {
              setOp('sub');
              setRan(false);
            }}
          >
            <span className={styles.cardLabel}>return a - b</span>
            <p className={styles.cardHint}>Имитация регрессии</p>
          </button>
        </div>

        <div className={styles.codeBlock}>
          {`def test_add_positive_numbers():
    result = add(2, 3)
    assert result == 5  # факт: ${result}`}
        </div>

        <label style={{display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.78rem'}}>
          <input
            type="checkbox"
            checked={useMock}
            onChange={(e) => setUseMock(e.target.checked)}
          />
          @patch DatabaseConnection — мок вместо реальной БД
        </label>
        <p className={styles.cardHint}>{mockTerminal}</p>

        <div className={styles.terminal} role="log">
          <span className={passed && ran ? styles.pass : ran ? styles.fail : ''}>{terminal}</span>
        </div>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setRan(true)}
          >
            Запустить pytest
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setRan(false)}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UnitTestPytestPlayInner;
