import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/HypervisorPlay.module.css';

const TYPES = [
  {
    id: 'type1',
    label: 'Тип 1 (bare-metal)',
    layers: ['hardware', 'hypervisor', 'vm', 'guest'],
  },
  {
    id: 'type2',
    label: 'Тип 2 (hosted)',
    layers: ['hardware', 'hostos', 'hypervisor', 'vm', 'guest'],
  },
];

const LAYER_LABELS = {
  hardware: 'Физическое железо',
  hostos: 'Хост-ОС (Windows / Linux)',
  hypervisor: 'Гипервизор',
  vm: 'Виртуальная машина',
  guest: 'Гостевая ОС',
};

const TRAP_STEPS = [
  {from: 'guest', to: 'hypervisor', msg: 'Гость: "открыть файл" → ловушка (trap)'},
  {from: 'hypervisor', to: 'hostos', msg: 'Гипервизор: эмуляция или проброс на хост'},
  {from: 'hostos', to: 'guest', msg: 'Ответ возвращается в гостевую ОС'},
];

function HypervisorPlayInner() {
  const [hvType, setHvType] = useState('type2');
  const [cpu, setCpu] = useState(2);
  const [ram, setRam] = useState(4);
  const [trapStep, setTrapStep] = useState(-1);

  const typeMeta = TYPES.find((t) => t.id === hvType) ?? TYPES[1];
  const trap = trapStep >= 0 ? TRAP_STEPS[trapStep] : null;

  const runTrap = () => {
    setTrapStep(0);
    TRAP_STEPS.forEach((_, i) => {
      window.setTimeout(() => setTrapStep(i), i * 900);
    });
    window.setTimeout(() => setTrapStep(-1), TRAP_STEPS.length * 900 + 400);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Гипервизор и виртуальные машины"
        subtitle="Слои Type 1 / Type 2, выделение ресурсов и перехват запросов гостя"
      >
        <div className="it-demo__tabs">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx('it-demo__tab', hvType === t.id && 'it-demo__tab--active')}
              onClick={() => setHvType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.stack}>
          {typeMeta.layers.map((layer) => (
            <div
              key={layer}
              className={clsx(
                styles.layer,
                styles[`layer_${layer}`],
                trap && (trap.from === layer || trap.to === layer) && styles.layerPulse,
              )}
            >
              {LAYER_LABELS[layer]}
            </div>
          ))}
        </div>

        {trap && <p className={styles.trapMsg}>{trap.msg}</p>}

        <div className={styles.sliders}>
          <label>
            <span className="it-demo__label">vCPU для ВМ</span>
            <input
              type="range"
              min={1}
              max={8}
              value={cpu}
              onChange={(e) => setCpu(Number(e.target.value))}
            />
            <strong>{cpu}</strong>
          </label>
          <label>
            <span className="it-demo__label">RAM (ГБ)</span>
            <input
              type="range"
              min={1}
              max={16}
              value={ram}
              onChange={(e) => setRam(Number(e.target.value))}
            />
            <strong>{ram} ГБ</strong>
          </label>
        </div>
        <p className={styles.alloc}>
          Хост резервирует {cpu} ядра и {ram} ГБ — остальное остаётся для host OS и других ВМ.
        </p>

        <div className="it-demo__actions">
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runTrap}>
            Симулировать syscall из гостя
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default HypervisorPlayInner;
