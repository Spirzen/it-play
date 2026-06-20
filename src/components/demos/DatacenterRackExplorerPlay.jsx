import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayLog,
  PlayMetrics,
  PlayPanel,
  PlaySlider,
  PlayStack,
  PlayToggle,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const UNITS = [
  {id: 'pdu', label: 'PDU', icon: '⚡', detail: 'Распределение питания по юнитам стойки'},
  {id: 'srv1', label: 'Srv-1', icon: '🖥️', detail: 'Compute-нода: 2×CPU, 256 GB RAM, NVMe'},
  {id: 'srv2', label: 'Srv-2', icon: '🖥️', detail: 'Compute-нода: резерв для N+1'},
  {id: 'stor', label: 'SAN', icon: '💾', detail: 'Общее хранилище — iSCSI/NFS к кластеру'},
  {id: 'tor', label: 'ToR', icon: '🔀', detail: 'Top-of-Rack: 25G к серверам, 100G uplink'},
  {id: 'spine', label: 'Spine', icon: '🕸️', detail: 'Spine-switch: агрегация ToR в fabric'},
  {id: 'cool', label: 'CRAC', icon: '❄️', detail: 'Охлаждение: hot/cold aisle, PUE'},
  {id: 'ups', label: 'UPS', icon: '🔋', detail: 'ИБП: автономия ~15 мин при полном отказе'},
];

export default function DatacenterRackExplorerPlay() {
  const [tier, setTier] = useState(3);
  const [failUps, setFailUps] = useState(false);
  const [selected, setSelected] = useState('srv1');

  const unit = UNITS.find((u) => u.id === selected) ?? UNITS[1];
  const uptime = failUps ? (tier >= 3 ? 99.5 : tier === 2 ? 95 : 80) : 99.99 - (4 - tier) * 0.5;
  const powerOk = !failUps || tier >= 2;

  const logs = [
    `Tier ${tier}: ${tier === 1 ? 'без резервирования' : tier === 2 ? 'N+1 UPS' : '2N питание + охлаждение'}`,
    failUps
      ? powerOk
        ? '⚠️ UPS A отказал — нагрузка на UPS B'
        : '❌ Blackout — серверы на батарее ≤ 15 мин'
      : '✓ Два ввода питания в норме',
    selected === 'tor'
      ? 'ToR-switch: 25G к каждому серверу, uplink 100G к spine'
      : `${unit.label}: ${unit.detail}`,
    `PUE ≈ 1.${tier === 3 ? '2' : '5'} — охлаждение CRAC + hot/cold aisle`,
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Стойка дата-центра" subtitle="Питание, сеть, охлаждение и Tier">
        <PlayStack>
          <PlaySlider label="Tier" value={tier} min={1} max={3} step={1} onChange={setTier} />
          <PlayToggle label="Симулировать отказ UPS" checked={failUps} onChange={setFailUps} />

          <div className={styles.rack}>
            {UNITS.map((u) => (
              <button
                key={u.id}
                type="button"
                className={clsx(
                  styles.rackUnit,
                  selected === u.id && styles.rackUnitSelected,
                  failUps && u.id === 'ups' && styles.rackUnitDown,
                  failUps && u.id === 'srv1' && !powerOk && styles.rackUnitHot,
                )}
                onClick={() => setSelected(u.id)}
              >
                {u.icon}
                <br />
                {u.label}
              </button>
            ))}
          </div>

          <PlayPanel title={unit.label} subtitle={unit.detail} />

          <PlayMetrics
            items={[
              {
                label: 'Доступность (оценка)',
                value: uptime,
                max: 100,
                display: `${uptime.toFixed(2)}%`,
              },
            ]}
          />

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
