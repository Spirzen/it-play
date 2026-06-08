import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CloudServiceStackPlay.module.css';

const MODELS = [
  {
    id: 'onprem',
    label: 'On-Premises',
    tag: 'Коробка',
    you: ['Приложение', 'Данные', 'ОС', 'Серверы', 'Сеть', 'ЦОД'],
    vendor: [],
  },
  {
    id: 'iaas',
    label: 'IaaS',
    tag: 'EC2, Azure VM',
    you: ['Приложение', 'Данные', 'ОС', 'Сред выполнения'],
    vendor: ['Серверы', 'Сеть', 'Хранилище', 'Виртуализация'],
  },
  {
    id: 'paas',
    label: 'PaaS',
    tag: 'Heroku, App Engine',
    you: ['Приложение', 'Данные'],
    vendor: ['ОС', 'Серверы', 'Сеть', 'Runtime', 'Масштабирование'],
  },
  {
    id: 'saas',
    label: 'SaaS',
    tag: 'M365, Google Workspace',
    you: ['Настройки', 'Контент пользователя'],
    vendor: ['Приложение', 'Данные (у вендора)', 'Инфраструктура', 'Обновления'],
  },
];

function CloudServiceStackPlayInner() {
  const [model, setModel] = useState('saas');

  const m = MODELS.find((x) => x.id === model) ?? MODELS[3];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Модели поставки ПО"
        subtitle="Кто управляет приложением, платформой и инфраструктурой"
      >
        <div className={styles.chips}>
          {MODELS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(styles.chip, model === item.id && styles.chipActive)}
              onClick={() => setModel(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.tag}>
          Примеры: <strong>{m.tag}</strong>
        </p>

        <div className={styles.matrix}>
          <div className={styles.col}>
            <h4>Вы управляете</h4>
            <ul>
              {m.you.map((row) => (
                <li key={row} className={styles.you}>
                  {row}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Провайдер / вендор</h4>
            <ul>
              {m.vendor.length === 0 ? (
                <li className={styles.none}>— всё на вашей стороне</li>
              ) : (
                m.vendor.map((row) => (
                  <li key={row} className={styles.vendor}>
                    {row}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className={styles.stackViz}>
          {['Приложение', 'Данные', 'Runtime', 'ОС', 'Инфраструктура'].map((layer) => {
            const yours = m.you.some((x) => x.toLowerCase().includes(layer.toLowerCase().slice(0, 4)));
            const theirs = m.vendor.some((x) =>
              x.toLowerCase().includes(layer.toLowerCase().slice(0, 4)),
            );
            const owner = theirs && !yours ? 'vendor' : 'you';
            return (
              <div key={layer} className={clsx(styles.stackRow, styles[`owner_${owner}`])}>
                <span>{layer}</span>
                <span>{owner === 'you' ? 'ваша зона' : 'облако / вендор'}</span>
              </div>
            );
          })}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CloudServiceStackPlayInner;
