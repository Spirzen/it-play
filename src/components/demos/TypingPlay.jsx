import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from './dataBasicsPlay.module.css';

const MODES = [
  {
    id: 'static',
    lang: 'Java',
    code: 'int balance = 100;\nbalance = "текст"; // ошибка компиляции',
    result: 'Компилятор: incompatible types: String cannot be converted to int',
    when: 'Проверка на этапе компиляции',
  },
  {
    id: 'dynamic',
    lang: 'Python',
    code: 'x = 100\nx = "текст"  # OK во время выполнения',
    result: 'Тип привязан к значению: сначала int, потом str',
    when: 'Проверка при выполнении; гибко, но ошибки позже',
  },
];

const CONVERSIONS = [
  {
    id: 'widen',
    label: 'Расширяющее',
    from: 'int',
    to: 'double',
    safe: true,
    example: 'int a = 5;\ndouble b = a;  // 5.0',
  },
  {
    id: 'narrow',
    label: 'Сужающее',
    from: 'double',
    to: 'int',
    safe: false,
    example: 'double d = 3.99;\nint n = (int) d;  // 3, дробь отброшена',
  },
  {
    id: 'parse',
    label: 'Строка → число',
    from: 'string',
    to: 'int',
    safe: false,
    example: 'int n = Integer.parseInt("123");\n// "abc" → исключение',
  },
];

function TypingPlayInner() {
  const [modeId, setModeId] = useState('static');
  const [convId, setConvId] = useState('widen');
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const conv = CONVERSIONS.find((c) => c.id === convId) ?? CONVERSIONS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Статическая и динамическая типизация" subtitle="Когда система узнаёт о несовместимости типов.">
        <div className={styles.tabs}>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.tab, modeId === m.id && styles.tabActive)}
              onClick={() => setModeId(m.id)}
            >
              {m.lang}
            </button>
          ))}
        </div>
        <pre className={styles.mono}>{mode.code}</pre>
        <p className={styles.hint}>
          <strong>{mode.when}:</strong> {mode.result}
        </p>
      </DemoCard>

      <DemoCard title="Преобразование типов" subtitle="Расширяющее обычно неявное; сужающее требует явного cast и осторожности.">
        <div className={styles.tabs}>
          {CONVERSIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.tab, convId === c.id && styles.tabActive)}
              onClick={() => setConvId(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.flowRow}>
          <span className={clsx(styles.flowNode, styles.flowNodeActive)}>{conv.from}</span>
          <span className={styles.flowArrow}>→</span>
          <span className={clsx(styles.flowNode, styles.flowNodeActive)}>{conv.to}</span>
          <span
            className="it-demo__badge"
            style={{
              background: conv.safe ? 'color-mix(in srgb, #2e7d32 20%, transparent)' : 'color-mix(in srgb, #c62828 20%, transparent)',
            }}
          >
            {conv.safe ? 'безопасно' : 'риск потерь'}
          </span>
        </div>
        <pre className={styles.mono}>{conv.example}</pre>
        <p className={styles.hint}>
          Python — динамический и <em>сильный</em>: <code>{'"5" + 2'}</code> даёт TypeError. JavaScript — динамический и{' '}
          <em>слабый</em>: <code>{'"5" + 2 → "52"'}</code>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TypingPlayInner;
