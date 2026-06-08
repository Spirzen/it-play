import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PROFILER_FILTERS, PROFILERS} from '@/components/shared/kb/toolsTestingData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/ProfilerCatalogPlay.module.css';

function simulateProfile(intensity) {
  const cpu = Math.min(98, 25 + intensity * 0.07 + Math.random() * 8);
  const mem = Math.min(95, 40 + intensity * 0.04);
  const hotspots = [
    {fn: 'process_request()', pct: Math.round(cpu * 0.35)},
    {fn: 'db_query()', pct: Math.round(cpu * 0.22)},
    {fn: 'json_encode()', pct: Math.round(cpu * 0.12)},
    {fn: 'cache_get()', pct: Math.round(cpu * 0.08)},
  ];
  return {cpu: Math.round(cpu), mem: Math.round(mem), hotspots};
}

function ProfilerCatalogPlayInner() {
  const [cat, setCat] = useState('all');
  const [picked, setPicked] = useState('pyspy');
  const [intensity, setIntensity] = useState(500);
  const [running, setRunning] = useState(false);

  const filtered = useMemo(
    () => PROFILERS.filter((p) => cat === 'all' || p.cat === cat),
    [cat],
  );
  const tool = PROFILERS.find((p) => p.id === picked) ?? filtered[0] ?? PROFILERS[0];
  const profile = useMemo(() => simulateProfile(intensity), [intensity, running]);

  const runSample = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 400);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Профилировщики"
        subtitle="Выберите инструмент и смоделируйте нагрузку CPU (учебный пример)"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {PROFILER_FILTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, cat === c.id && toolStyles.chipActive)}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.split}>
          <div className={styles.list}>
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                className={clsx(styles.item, picked === p.id && styles.itemActive)}
                onClick={() => setPicked(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div>
            <h4 style={{margin: '0 0 0.35rem'}}>{tool.name}</h4>
            <p style={{margin: 0, fontSize: '0.84rem'}}>
              {tool.lang} · {tool.metric}
            </p>
            <p style={{fontSize: '0.8rem', opacity: 0.85}}>{tool.install}</p>
          </div>
        </div>

        <div className={styles.sliderRow}>
          <label>Интенсивность нагрузки: {intensity}</label>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={intensity}
            onChange={(e) => setIntensity(+e.target.value)}
          />
        </div>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runSample}>
          {running ? 'Снятие профиля…' : 'Снять учебный снимок'}
        </button>

        <div className={styles.meters}>
          <div>
            <span>CPU</span>
            <div className={styles.bar}>
              <div className={styles.barFill} style={{width: `${profile.cpu}%`}} />
            </div>
            <small>{profile.cpu}%</small>
          </div>
          <div>
            <span>Память</span>
            <div className={styles.bar}>
              <div
                className={styles.barFillMem}
                style={{width: `${profile.mem}%`}}
              />
            </div>
            <small>{profile.mem}%</small>
          </div>
        </div>

        <p className="it-demo__label" style={{marginTop: '0.65rem'}}>
          Hot spots (flamegraph, упрощённо)
        </p>
        <div className={styles.flame}>
          {profile.hotspots.map((h) => (
            <div
              key={h.fn}
              className={styles.flameBar}
              style={{width: `${Math.max(18, h.pct)}%`}}
              title={`${h.fn}: ~${h.pct}%`}
            >
              {h.fn}
            </div>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ProfilerCatalogPlayInner;
