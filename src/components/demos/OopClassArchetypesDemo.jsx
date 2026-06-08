import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/OopClassArchetypesDemo.module.css';

const ABSTRACT_TYPES = [
  {
    id: 'interface',
    name: 'Interface',
    role: 'Контракт без состояния',
    example: 'UserRepository',
    methods: ['findById()', 'save()'],
  },
  {
    id: 'abstract',
    name: 'Abstract class',
    role: 'Общая база с частичной реализацией',
    example: 'BaseEntity',
    methods: ['getId()', 'validate() abstract'],
  },
];

const CONCRETE_TYPES = [
  {id: 'entity', name: 'Entity', suffix: 'Order, User', color: '#3b82f6'},
  {id: 'service', name: 'Service', suffix: 'OrderService', color: '#10b981'},
  {id: 'dto', name: 'DTO', suffix: 'OrderDto', color: '#f59e0b'},
  {id: 'factory', name: 'Factory', suffix: 'PaymentFactory', color: '#8b5cf6'},
  {id: 'repository', name: 'Repository', suffix: 'OrderRepository', color: '#ec4899'},
  {id: 'controller', name: 'Controller', suffix: 'OrdersController', color: '#06b6d4'},
  {id: 'handler', name: 'Handler / Listener', suffix: 'OrderPaidHandler', color: '#64748b'},
];

const SCENARIO = {
  entity: ['Order', 'OrderLine'],
  service: ['OrderService creates Order'],
  repository: ['OrderRepository persists Order'],
  controller: ['OrdersController → OrderService'],
  dto: ['OrderDto for API response'],
};

function OopClassArchetypesDemoInner() {
  const [category, setCategory] = useState('concrete');
  const [selected, setSelected] = useState('service');
  const [className, setClassName] = useState('Order');

  const baseName = className.replace(
    /(Service|Repository|Dto|Controller|Factory|Handler|sController)$/i,
    '',
  ) || className;

  const resolvedName = {
    entity: baseName,
    service: `${baseName}Service`,
    dto: `${baseName}Dto`,
    factory: `${baseName}Factory`,
    repository: `${baseName}Repository`,
    controller: `${baseName}sController`,
    handler: `${baseName}EventHandler`,
  }[selected];

  return (
    <DemoShell>
      <DemoCard
        title="Типы классов в ООП-проектировании"
        subtitle="Абстрактные и конкретные архетипы ответственности — выберите роль и имя"
      >
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, category === 'abstract' && styles.tabOn)}
            onClick={() => setCategory('abstract')}
          >
            Абстрактные
          </button>
          <button
            type="button"
            className={clsx(styles.tab, category === 'concrete' && styles.tabOn)}
            onClick={() => setCategory('concrete')}
          >
            Конкретные
          </button>
        </div>

        {category === 'abstract' ? (
          <div className={styles.cards}>
            {ABSTRACT_TYPES.map((t) => (
              <div key={t.id} className={styles.card}>
                <h4>{t.name}</h4>
                <p>{t.role}</p>
                <code>{t.example}</code>
                <ul>
                  {t.methods.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={styles.chips}>
              {CONCRETE_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={clsx(styles.chip, selected === t.id && styles.chipOn)}
                  style={selected === t.id ? {borderColor: t.color, background: `${t.color}22`} : undefined}
                  onClick={() => setSelected(t.id)}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div className={styles.builder}>
              <label>
                Имя сущности
                <input value={className} onChange={(e) => setClassName(e.target.value)} />
              </label>
              <div
                className={styles.preview}
                style={{
                  borderColor: CONCRETE_TYPES.find((t) => t.id === selected)?.color,
                }}
              >
                <div className={styles.previewHead}>
                  {CONCRETE_TYPES.find((t) => t.id === selected)?.name}
                </div>
                <code>class {resolvedName}</code>
              </div>
            </div>

            <p className={styles.scenario}>
              В сценарии "оформление заказа": {(SCENARIO[selected] || ['—']).join(' → ')}
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default OopClassArchetypesDemoInner;
