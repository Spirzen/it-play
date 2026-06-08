import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CodeStylePlay.module.css';

const TABS = [
  {id: 'read', label: 'Читаемость'},
  {id: 'format', label: 'Форматирование'},
  {id: 'naming', label: 'Именование'},
  {id: 'stepdown', label: 'Step-down'},
];

const READ_BAD = `x=func(a,b)+c*d`;
const READ_GOOD = `total_price = calculate_base_price(item_count, unit_price)\n  + shipping_cost * tax_rate`;

const FORMAT_RAW = `user_profile=create_user_profile(username="timur",email="timur@example.com",role="developer",preferences={"theme":"dark","notifications":True})`;

const FORMAT_CLEAN = `user_profile = create_user_profile(
    username="timur",
    email="timur@example.com",
    role="developer",
    preferences={"theme": "dark", "notifications": True},
)`;

const NAMING_BAD = {mra: 3, ua: true};
const NAMING_GOOD = {max_retry_attempts: 3, is_user_authenticated: true};

const STEPDOWN = [
  {name: 'place_order', level: 0, desc: 'Высокий уровень: сценарий заказа'},
  {name: 'validate_customer', level: 1, desc: 'Проверка клиента'},
  {name: 'validate_inventory', level: 1, desc: 'Проверка склада'},
  {name: 'charge_payment', level: 1, desc: 'Оплата'},
  {name: 'confirm_shipment', level: 1, desc: 'Отправка'},
];

function CodeStylePlayInner() {
  const [tab, setTab] = useState('read');
  const [formatted, setFormatted] = useState(false);
  const [useGoodNames, setUseGoodNames] = useState(true);
  const [highlightFn, setHighlightFn] = useState('place_order');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Стиль кода в действии"
        subtitle="Одинаковая логика — разное восприятие: читаемость, формат, имена, порядок функций"
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

        {tab === 'read' && (
          <div className={styles.split}>
            <div>
              <div className={styles.badgeBad}>Плохо</div>
              <pre className={styles.pre}>{READ_BAD}</pre>
            </div>
            <div>
              <div className={styles.badgeGood}>Хорошо</div>
              <pre className={styles.pre}>{READ_GOOD}</pre>
            </div>
          </div>
        )}

        {tab === 'format' && (
          <>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--sm"
              onClick={() => setFormatted((f) => !f)}
            >
              {formatted ? 'Показать "сырой" вариант' : 'Применить форматтер (как Prettier)'}
            </button>
            <pre className={styles.pre}>{formatted ? FORMAT_CLEAN : FORMAT_RAW}</pre>
            <p className="it-demo__hint">
              Переносы и пробелы не меняют смысл для интерпретатора, но снижают когнитивную нагрузку при
              чтении и ревью.
            </p>
          </>
        )}

        {tab === 'naming' && (
          <>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={useGoodNames}
                onChange={(e) => setUseGoodNames(e.target.checked)}
              />
              Осмысленные имена вместо аббревиатур
            </label>
            <pre className={styles.pre}>
              {JSON.stringify(useGoodNames ? NAMING_GOOD : NAMING_BAD, null, 2)}
            </pre>
          </>
        )}

        {tab === 'stepdown' && (
          <>
            <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>
              Файл читается сверху вниз: сначала общий сценарий, ниже — детали.
            </p>
            <div className={styles.stepList}>
              {STEPDOWN.map((fn) => (
                <button
                  key={fn.name}
                  type="button"
                  className={clsx(
                    styles.stepRow,
                    highlightFn === fn.name && styles.stepRowActive,
                  )}
                  style={{paddingLeft: `${0.5 + fn.level * 1.25}rem`}}
                  onClick={() => setHighlightFn(fn.name)}
                >
                  <code>{fn.name}()</code>
                  <span>{fn.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default CodeStylePlayInner;
