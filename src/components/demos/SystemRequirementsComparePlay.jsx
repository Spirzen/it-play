import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/SystemRequirementsComparePlay.module.css';

const APPS = [
  {
    id: 'game',
    name: 'AAA-игра (2025)',
    min: {cpu: 6, ram: 8, gpu: 6, ssd: 1},
    rec: {cpu: 8, ram: 16, gpu: 8, ssd: 1},
  },
  {
    id: 'office',
    name: 'Офисный пакет',
    min: {cpu: 4, ram: 4, gpu: 2, ssd: 0},
    rec: {cpu: 6, ram: 8, gpu: 3, ssd: 1},
  },
  {
    id: 'os',
    name: 'Windows 11',
    min: {cpu: 4, ram: 4, gpu: 2, ssd: 1},
    rec: {cpu: 6, ram: 8, gpu: 4, ssd: 1},
  },
];

const LABELS = {
  cpu: 'CPU (уровень)',
  ram: 'RAM (ГБ)',
  gpu: 'GPU (уровень)',
  ssd: 'SSD (0/1)',
};

function verdict(yours, req) {
  const keys = Object.keys(req);
  const ok = keys.every((k) => yours[k] >= req[k]);
  const over = keys.filter((k) => yours[k] >= req[k] + (k === 'ram' ? 4 : 1)).length;
  if (!ok) return {level: 'fail', text: 'Ниже минимума — возможны сбои'};
  if (over >= 3) return {level: 'optimal', text: 'Выше рекомендуемых — комфортный запас'};
  return {level: 'rec', text: 'Соответствует рекомендуемым'};
}

function SystemRequirementsComparePlayInner() {
  const [appId, setAppId] = useState('game');
  const [specs, setSpecs] = useState({cpu: 6, ram: 16, gpu: 7, ssd: 1});

  const app = APPS.find((a) => a.id === appId) ?? APPS[0];
  const minVerdict = useMemo(() => verdict(specs, app.min), [specs, app]);
  const recVerdict = useMemo(() => verdict(specs, app.rec), [specs, app]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Сравнение с системными требованиями"
        subtitle="Подставьте параметры своего ПК и проверьте минимум / рекомендуемое"
      >
        <div className={styles.appRow}>
          {APPS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={clsx(styles.appBtn, appId === a.id && styles.appBtnActive)}
              onClick={() => setAppId(a.id)}
            >
              {a.name}
            </button>
          ))}
        </div>

        <div className={styles.sliders}>
          {Object.entries(specs).map(([key, val]) => (
            <label key={key}>
              <span className="it-demo__label">{LABELS[key]}</span>
              <input
                type="range"
                min={key === 'ssd' ? 0 : key === 'ram' ? 4 : 2}
                max={key === 'ssd' ? 1 : key === 'ram' ? 32 : 10}
                step={key === 'ssd' ? 1 : key === 'ram' ? 4 : 1}
                value={val}
                onChange={(e) =>
                  setSpecs((s) => ({...s, [key]: Number(e.target.value)}))
                }
              />
              <strong>{key === 'ssd' ? (val ? 'Да' : 'HDD') : val}</strong>
            </label>
          ))}
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Параметр</th>
              <th>Ваш ПК</th>
              <th>Минимум</th>
              <th>Рекомендуется</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(specs).map((key) => (
              <tr key={key}>
                <td>{LABELS[key]}</td>
                <td>{key === 'ssd' ? (specs[key] ? 'SSD' : 'HDD') : specs[key]}</td>
                <td>{key === 'ssd' ? (app.min[key] ? 'SSD' : '—') : app.min[key]}</td>
                <td>{key === 'ssd' ? (app.rec[key] ? 'SSD' : '—') : app.rec[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.verdicts}>
          <div className={clsx(styles.badge, styles[`badge_${minVerdict.level}`])}>
            Минимум: {minVerdict.text}
          </div>
          <div className={clsx(styles.badge, styles[`badge_${recVerdict.level}`])}>
            Рекомендуемое: {recVerdict.text}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SystemRequirementsComparePlayInner;
