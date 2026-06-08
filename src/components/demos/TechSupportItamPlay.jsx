import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ITAM_LIFECYCLE, licenseBalance} from '@/components/shared/kb/techSupportEngines';
import styles from '@/components/shared/kb/techSupportDemo.module.css';

function TechSupportItamPlayInner() {
  const [stageId, setStageId] = useState('use');
  const [owned, setOwned] = useState(100);
  const [installed, setInstalled] = useState(105);

  const stage = ITAM_LIFECYCLE.find((s) => s.id === stageId) ?? ITAM_LIFECYCLE[0];
  const balance = useMemo(() => licenseBalance(owned, installed), [owned, installed]);

  const tcoExample = useMemo(() => {
    const purchase = 80000;
    const support = 15000;
    const power = 3000;
    const dispose = 1000;
    return purchase + support + power + dispose;
  }, []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="ITAM — жизненный цикл ИТ-активов"
        subtitle="От планирования до списания и лицензионный баланс"
      >
        <p className="it-demo__label">Этапы жизненного цикла</p>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem'}}>
          {ITAM_LIFECYCLE.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                'it-demo__btn',
                stageId === s.id ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
              )}
              style={{fontSize: '0.72rem'}}
              onClick={() => setStageId(s.id)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className={styles.detailBox}>
          <p className={styles.detailTitle}>
            {stage.icon} {stage.label}
          </p>
          <p className={styles.detailText}>{stage.detail}</p>
        </div>

        <p className="it-demo__label">Лицензионный баланс (пример Adobe)</p>
        <div className={styles.sliderRow}>
          <label>
            <span>Куплено лицензий</span>
            <strong>{owned}</strong>
          </label>
          <input
            type="range"
            min={50}
            max={150}
            value={owned}
            onChange={(e) => setOwned(Number(e.target.value))}
          />
        </div>
        <div className={styles.sliderRow}>
          <label>
            <span>Установлено</span>
            <strong>{installed}</strong>
          </label>
          <input
            type="range"
            min={50}
            max={150}
            value={installed}
            onChange={(e) => setInstalled(Number(e.target.value))}
          />
        </div>
        <p
          className={styles.detailText}
          style={{
            fontWeight: 700,
            color: balance.ok ? '#2e7d32' : '#c62828',
            textAlign: 'center',
          }}
        >
          {balance.message}
        </p>

        <div className={styles.detailBox}>
          <p className={styles.detailTitle}>TCO ноутбука (из статьи)</p>
          <p className={styles.detailText}>
            Покупка 80 000 + поддержка 15 000 + электричество 3 000 + утилизация 1 000 ={' '}
            <strong>{tcoExample.toLocaleString('ru-RU')} ₽</strong> за цикл владения.
          </p>
        </div>

        <p className={styles.footer}>
          ITAM — основа для CMDB, Change Management и быстрой диагностики инцидентов по CI.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportItamPlayInner;
