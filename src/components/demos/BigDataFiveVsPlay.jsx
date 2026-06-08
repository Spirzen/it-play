import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const VS = [
  {
    id: 'volume',
    label: 'Volume',
    ru: 'Объём',
    text: 'Петабайты и экзабайты — масштаб превышает возможности одной СУБД.',
    example: 'Соцсети: миллионы постов и медиа каждую секунду.',
  },
  {
    id: 'velocity',
    label: 'Velocity',
    ru: 'Скорость',
    text: 'Потоковая обработка вместо ночных пакетов.',
    example: 'Фрод-детекция: решение за миллисекунды на транзакцию.',
  },
  {
    id: 'variety',
    label: 'Variety',
    ru: 'Разнородность',
    text: 'JSON, логи, видео, сенсоры — без единой жёсткой схемы.',
    example: 'NoSQL и data lake для смешанных форматов.',
  },
  {
    id: 'veracity',
    label: 'Veracity',
    ru: 'Достоверность',
    text: 'Шум, пропуски и противоречия требуют очистки и валидации.',
    example: 'Датчики IoT: калибровка и фильтрация выбросов.',
  },
  {
    id: 'value',
    label: 'Value',
    ru: 'Ценность',
    text: 'Польза появляется только после интерпретации и внедрения.',
    example: 'Геоданные → оптимизация транспорта, не просто координаты.',
  },
];

function BigDataFiveVsPlayInner() {
  const [active, setActive] = useState('volume');
  const v = VS.find((x) => x.id === active) ?? VS[0];

  return (
    <DemoShell>
      <DemoCard title="V-модель Big Data" subtitle="Пять характеристик больших данных">
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem', flexWrap: 'wrap'}}>
          {VS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p style={{margin: '0 0 0.35rem', fontSize: '0.95rem'}}>
          <strong>
            {v.label} — {v.ru}
          </strong>
        </p>
        <p style={{margin: '0 0 0.5rem', fontSize: '0.88rem', lineHeight: 1.45}}>{v.text}</p>
        <p
          style={{
            margin: 0,
            fontSize: '0.84rem',
            padding: '0.55rem 0.65rem',
            borderRadius: 8,
            background: 'var(--ifm-color-emphasis-100)',
          }}
        >
          Пример: {v.example}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default BigDataFiveVsPlayInner;
