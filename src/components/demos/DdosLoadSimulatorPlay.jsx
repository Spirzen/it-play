import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayLog,
  PlayMetrics,
  PlaySection,
  PlaySlider,
  PlayStack,
  PlayStatusBadge,
  PlayTabs,
  SN_COLORS,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const ATTACKS = [
  {id: 'syn', label: 'SYN-flood (L4)', baseLoad: 40, connCap: 128},
  {id: 'http', label: 'HTTP flood (L7)', baseLoad: 25, connCap: 200},
  {id: 'udp', label: 'UDP flood (L3)', baseLoad: 55, connCap: 100},
];

const DEFENSES = [
  {id: 'none', label: 'Без защиты', factor: 1},
  {id: 'rate', label: 'Rate limit', factor: 0.55},
  {id: 'cdn', label: 'CDN edge', factor: 0.35},
  {id: 'syn', label: 'SYN cookies', factor: 0.45},
];

export default function DdosLoadSimulatorPlay() {
  const [attack, setAttack] = useState('syn');
  const [bots, setBots] = useState(500);
  const [defense, setDefense] = useState('none');

  const atk = ATTACKS.find((a) => a.id === attack);
  const def = DEFENSES.find((d) => d.id === defense);

  const metrics = useMemo(() => {
    const effectiveBots = bots * def.factor;
    const loadPct = Math.min(100, Math.round((effectiveBots / 1000) * atk.baseLoad + effectiveBots / atk.connCap));
    const latency = Math.round(20 + loadPct * 4.5);
    const legitOk = Math.max(0, 100 - loadPct);
    const status = loadPct > 85 ? 'DOWN' : loadPct > 60 ? 'DEGRADED' : 'OK';
    return {loadPct, latency, legitOk, status, effectiveBots: Math.round(effectiveBots)};
  }, [attack, bots, defense, atk, def]);

  const statusTone = metrics.status === 'DOWN' ? 'bad' : metrics.status === 'DEGRADED' ? 'warn' : 'ok';

  const logs = [
    `Атака: ${atk.label}, ботов: ${bots}, защита: ${def.label}`,
    `Эффективная нагрузка: ${metrics.effectiveBots} req/s экв.`,
    metrics.status === 'DOWN'
      ? '❌ Сервер исчерпал таблицу соединений — легитимные клиенты получают timeout'
      : metrics.status === 'DEGRADED'
        ? '⚠️ Очередь растёт — p95 latency выше SLA'
        : '✅ Сервер обрабатывает трафик в норме',
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Симулятор DDoS-нагрузки" subtitle="Ботнет vs лимиты сервера и mitigations">
        <PlayStack>
          <PlaySection label="Тип атаки">
            <PlayTabs tabs={ATTACKS} active={attack} onChange={setAttack} />
          </PlaySection>

          <PlaySection label="Защита">
            <PlayTabs tabs={DEFENSES} active={defense} onChange={setDefense} />
          </PlaySection>

          <PlaySlider label="Ботов / интенсивность" value={bots} min={50} max={5000} step={50} onChange={setBots} />

          <PlayStatusBadge tone={statusTone}>Статус: {metrics.status}</PlayStatusBadge>

          <PlayMetrics
            grid
            items={[
              {
                label: 'Нагрузка сервера',
                value: metrics.loadPct,
                max: 100,
                display: `${metrics.loadPct}%`,
                color: metrics.loadPct > 85 ? SN_COLORS.danger : metrics.loadPct > 60 ? SN_COLORS.warning : SN_COLORS.accent,
              },
              {label: 'Latency (p95)', value: metrics.latency, max: 500, display: `${metrics.latency} ms`},
              {
                label: 'Успех легитимных',
                value: metrics.legitOk,
                max: 100,
                display: `${metrics.legitOk}%`,
                color: SN_COLORS.success,
              },
            ]}
          />

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
