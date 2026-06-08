import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './dataToolsPlays.module.css';

const STRATEGIES = [
  {
    id: 'full',
    label: 'Полный',
    color: '#3498db',
    copies: ['Пн 100%', 'Вт 100%', 'Ср 100%'],
    restore: '1 шаг: взять последний полный бэкап',
    tools: 'pg_dump --format=custom, tar, restic backup',
    size: 'Большой объём каждый раз',
  },
  {
    id: 'incremental',
    label: 'Инкрементный',
    color: '#2ecc71',
    copies: ['Пн 100%', 'Вт +5%', 'Ср +3%', 'Чт +8%'],
    restore: 'Полный + все инкременты по цепочке',
    tools: 'rsync --link-dest, restic, Borg',
    size: 'Минимум трафика, дольше восстановление',
  },
  {
    id: 'differential',
    label: 'Дифференциальный',
    color: '#e67e22',
    copies: ['Пн 100%', 'Вт Δ20%', 'Ср Δ25%', 'Чт Δ30%'],
    restore: 'Полный + последний дифференциальный',
    tools: 'SQL Server DIFFERENTIAL, enterprise backup suites',
    size: 'Баланс объёма и скорости restore',
  },
  {
    id: 'snapshot',
    label: 'Снапшот',
    color: '#9b59b6',
    copies: ['10:00 COW', '10:05 COW', '10:10 COW'],
    restore: 'Откат тома за секунды (LVM/ZFS/BTRFS)',
    tools: 'LVM snapshot, ZFS, EBS snapshot, pg_basebackup',
    size: 'Почти мгновенно; нужна поддержка СХД/ФС',
  },
];

function BackupStrategyPlayInner() {
  const [active, setActive] = useState('incremental');
  const s = STRATEGIES.find((x) => x.id === active) ?? STRATEGIES[1];
  const [day, setDay] = useState(3);

  return (
    <DemoShell>
      <DemoCard
        title="Стратегии резервного копирования"
        subtitle="Полный, инкрементный, дифференциальный и снапшот — что копируется и сколько шагов до восстановления"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem', flexWrap: 'wrap'}}>
          {STRATEGIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => {
                setActive(item.id);
                setDay(0);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label">
          День цикла: {['Пн', 'Вт', 'Ср', 'Чт'][day]}
        </label>
        <input
          type="range"
          min={0}
          max={3}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className={styles.range}
          style={{width: '100%', marginBottom: '0.75rem'}}
        />

        <div className={styles.backupTimeline}>
          {s.copies.map((label, i) => (
            <div
              key={i}
              className={clsx(styles.backupBlock, i <= day && styles.backupBlockLit)}
              style={{borderColor: i <= day ? s.color : undefined}}
            >
              <span className={styles.backupDay}>{['Пн', 'Вт', 'Ср', 'Чт'][i]}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.twoCol}>
          <div className={styles.noteGood}>
            <strong>Восстановление</strong>
            <p>{s.restore}</p>
          </div>
          <div className={styles.noteWarn}>
            <strong>Инструменты</strong>
            <p>{s.tools}</p>
          </div>
        </div>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Объём: {s.size}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default BackupStrategyPlayInner;
