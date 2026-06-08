import React, {useCallback, useEffect, useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/NetworkTrafficMonitorDemo.module.css';

const INITIAL_CONNS = [
  {proto: 'TCP', remote: '185.220.101.42:443', state: 'ESTABLISHED', bytes: 12400},
  {proto: 'TCP', remote: '10.0.0.5:5432', state: 'ESTABLISHED', bytes: 892000},
  {proto: 'UDP', remote: '8.8.8.8:53', state: '—', bytes: 420},
  {proto: 'TCP', remote: '203.0.113.7:80', state: 'TIME_WAIT', bytes: 2100},
];

const PROTO_SHARE = [
  {name: 'HTTPS', pct: 62, color: '#1565c0'},
  {name: 'DNS', pct: 8, color: '#00838f'},
  {name: 'DB', pct: 18, color: '#6a1b9a'},
  {name: 'Другое', pct: 12, color: '#78909c'},
];

function NetworkTrafficMonitorDemoInner() {
  const [inMbps, setInMbps] = useState(42);
  const [outMbps, setOutMbps] = useState(18);
  const [conns, setConns] = useState(INITIAL_CONNS);
  const [live, setLive] = useState(false);

  const tick = useCallback(() => {
    setInMbps((v) => Math.max(5, Math.min(950, v + (Math.random() - 0.45) * 40)));
    setOutMbps((v) => Math.max(2, Math.min(400, v + (Math.random() - 0.5) * 25)));
    if (Math.random() < 0.15) {
      setConns((prev) => [
        {
          proto: Math.random() > 0.2 ? 'TCP' : 'UDP',
          remote: `${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.1.1:${[80, 443, 5432][Math.floor(Math.random() * 3)]}`,
          state: 'ESTABLISHED',
          bytes: Math.floor(Math.random() * 500000),
        },
        ...prev.slice(0, 5),
      ]);
    }
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(tick, 1200);
    return () => clearInterval(id);
  }, [live, tick]);

  const maxMbps = 1000;

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Мониторинг сетевого трафика"
        subtitle="Входящий и исходящий поток, соединения и доля протоколов — как в iftop, nethogs и SNMP">
        <div className={styles.controls}>
          <button type="button" className={styles.btn} onClick={() => setLive((l) => !l)}>
            {live ? '⏸ Пауза' : '▶ Живой поток'}
          </button>
          <button type="button" className={styles.btn} style={{background: 'var(--nt-out)'}} onClick={tick}>
            Обновить
          </button>
        </div>

        <div className={styles.flow}>
          <div className={styles.flowBox}>
            <strong style={{color: 'var(--nt-in)'}}>📥 Входящий</strong>
            <div style={{fontSize: '1.25rem', fontWeight: 700}}>{inMbps.toFixed(1)} Мбит/с</div>
            <div style={{fontSize: '0.72rem', color: 'var(--nt-muted)'}}>Internet → хост</div>
          </div>
          <span className={styles.flowArrow}>⇄</span>
          <div className={styles.flowBox}>
            <strong style={{color: 'var(--nt-out)'}}>📤 Исходящий</strong>
            <div style={{fontSize: '1.25rem', fontWeight: 700}}>{outMbps.toFixed(1)} Мбит/с</div>
            <div style={{fontSize: '0.72rem', color: 'var(--nt-muted)'}}>хост → Internet</div>
          </div>
        </div>

        <div className={styles.bars}>
          <div className={styles.barRow}>
            <span>In</span>
            <div className={styles.barTrack}>
              <div className={styles.barIn} style={{width: `${(inMbps / maxMbps) * 100}%`}} />
            </div>
            <span>{inMbps.toFixed(0)}</span>
          </div>
          <div className={styles.barRow}>
            <span>Out</span>
            <div className={styles.barTrack}>
              <div className={styles.barOut} style={{width: `${(outMbps / maxMbps) * 100}%`}} />
            </div>
            <span>{outMbps.toFixed(0)}</span>
          </div>
        </div>

        <div className={styles.proto}>
          {PROTO_SHARE.map((p) => (
            <span key={p.name} className={styles.protoChip} style={{borderColor: p.color, color: p.color}}>
              {p.name} {p.pct}%
            </span>
          ))}
        </div>

        <table className={styles.connTable} style={{marginTop: '0.75rem'}}>
          <thead>
            <tr>
              <th>Протокол</th>
              <th>Удалённый адрес</th>
              <th>Состояние</th>
              <th>Байт</th>
            </tr>
          </thead>
          <tbody>
            {conns.map((c, i) => (
              <tr key={`${c.remote}-${i}`}>
                <td>{c.proto}</td>
                <td>{c.remote}</td>
                <td>{c.state}</td>
                <td>{c.bytes.toLocaleString('ru')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={styles.hint}>
          Рост входящего без исходящего может означать сканирование или DDoS. Асимметрия in/out при веб-сервере нормальна.
          TCP retransmits и packet loss смотрят отдельно — здесь упрощённая модель пропускной способности.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default NetworkTrafficMonitorDemoInner;
