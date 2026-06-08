import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AntivirusDetectionPlay.module.css';

const SAMPLES = [
  {name: 'report.pdf', hash: 'a1b2c3d4', sig: 'known', behavior: 'read'},
  {name: 'invoice.exe', hash: 'eicar-test', sig: 'eicar', behavior: 'spawn'},
  {name: 'update_v2.exe', hash: '9f88aa01', sig: 'unknown', behavior: 'inject'},
  {name: 'photo.jpg', hash: 'ff001122', sig: 'known', behavior: 'read'},
];

const TABS = [
  {id: 'signature', label: 'Сигнатуры'},
  {id: 'heuristic', label: 'Эвристика'},
  {id: 'sandbox', label: 'Песочница'},
];

function analyze(mode, sample) {
  const lines = [`Файл: ${sample.name}`, `SHA-256: ${sample.hash}…`];
  if (mode === 'signature') {
    if (sample.sig === 'eicar') {
      lines.push('→ Совпадение с EICAR-TEST в базе сигнатур');
      return {level: 'bad', text: 'Вредонос обнаружен (сигнатура EICAR).', lines};
    }
    if (sample.sig === 'known') {
      lines.push('→ Хеш в whitelist / нет совпадений в blacklist');
      return {level: 'clean', text: 'Файл в базе известных чистых образцов.', lines};
    }
    lines.push('→ Сигнатура не найдена — zero-day не виден');
    return {level: 'warn', text: 'Неизвестный файл: сигнатурный движок молчит.', lines};
  }
  if (mode === 'heuristic') {
    if (sample.behavior === 'inject') {
      lines.push('→ Подозрение: WriteProcessMemory, скрытие окна');
      return {level: 'bad', text: 'Эвристика: поведение типично для трояна.', lines};
    }
    if (sample.behavior === 'spawn') {
      lines.push('→ Подозрение: автозапуск из Temp, сетевой beacon');
      return {level: 'warn', text: 'Подозрительное поведение — карантин рекомендован.', lines};
    }
    lines.push('→ Нет аномалий в профиле поведения');
    return {level: 'clean', text: 'Эвристика: действия в норме.', lines};
  }
  lines.push('→ Запуск в изолированной VM (30 с наблюдения)');
  if (sample.behavior === 'inject' || sample.behavior === 'spawn') {
    lines.push('→ Сеть: POST на 198.51.100.66:443 каждые 5 с');
    return {level: 'bad', text: 'Песочница: зафиксирован C2-трафик — блокировка.', lines};
  }
  lines.push('→ Только чтение файлов, без сети');
  return {level: 'clean', text: 'Песочница: вредоносной активности нет.', lines};
}

function AntivirusDetectionPlayInner() {
  const [tab, setTab] = useState('signature');
  const [sampleId, setSampleId] = useState(SAMPLES[0].name);
  const sample = SAMPLES.find((s) => s.name === sampleId) ?? SAMPLES[0];
  const result = useMemo(() => analyze(tab, sample), [tab, sample]);

  return (
    <DemoShell>
      <DemoCard
        title="Как антивирус принимает решение"
        subtitle="Сравните сигнатурный, эвристический анализ и песочницу на одном файле"
      >
        <div className="it-demo__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.samples}>
          {SAMPLES.map((s) => (
            <button
              key={s.name}
              type="button"
              className={clsx(
                'it-demo__btn it-demo__btn--sm',
                sampleId === s.name ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
              )}
              onClick={() => setSampleId(s.name)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <p
          className={clsx(
            styles.verdict,
            result.level === 'clean' && styles.verdictClean,
            result.level === 'warn' && styles.verdictWarn,
            result.level === 'bad' && styles.verdictBad,
          )}
        >
          {result.text}
        </p>
        <pre className={styles.log}>{result.lines.join('\n')}</pre>
      </DemoCard>
    </DemoShell>
  );
}

export default AntivirusDetectionPlayInner;
