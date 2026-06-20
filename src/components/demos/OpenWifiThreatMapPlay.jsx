import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayFeedback,
  PlayLog,
  PlayNodeRow,
  PlayStack,
  PlayStatusBadge,
  PlayTabs,
  PlayToggle,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const NETWORKS = [
  {id: 'home', label: 'Дом (WPA3)', secure: true},
  {id: 'cafe', label: 'Кафе (open)', secure: false},
  {id: 'evil', label: 'Evil twin', secure: false, fake: true},
];

const RISK_META = {
  low: {tone: 'success', badge: 'ok', label: 'Низкий'},
  medium: {tone: 'warn', badge: 'warn', label: 'Средний'},
  high: {tone: 'warn', badge: 'warn', label: 'Высокий'},
  critical: {tone: 'danger', badge: 'bad', label: 'Критический'},
};

export default function OpenWifiThreatMapPlay() {
  const [network, setNetwork] = useState('cafe');
  const [vpn, setVpn] = useState(false);
  const [httpsOnly, setHttpsOnly] = useState(true);

  const net = NETWORKS.find((n) => n.id === network);

  const result = useMemo(() => {
    if (net.secure) return {risk: 'low', sniff: false, mitm: false};
    const sniff = !vpn;
    const mitm = net.fake || (!httpsOnly && !vpn);
    const risk = mitm ? 'critical' : sniff ? 'high' : httpsOnly ? 'medium' : 'high';
    return {risk, sniff, mitm};
  }, [net, vpn, httpsOnly]);

  const riskMeta = RISK_META[result.risk];

  const logs = [
    `Сеть: ${net.label}${net.fake ? ' (подмена SSID)' : ''}`,
    vpn ? '✓ VPN-туннель шифрует трафик после точки доступа' : '✗ Без VPN радиоканал открыт для соседних адаптеров',
    httpsOnly ? '✓ Только HTTPS — cookie/session в TLS' : '⚠️ HTTP-сайты передают данные открытым текстом',
    result.sniff ? '👁 Злоумышленник видит метаданные и незашифрованный HTTP' : '🔒 Sniffing затруднён',
    result.mitm ? '🚨 MITM возможен: подмена DNS/сертификата или captive portal' : 'MITM маловероятен при HTTPS+HSTS',
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Карта угроз открытого Wi‑Fi" subtitle="Open network, evil twin, VPN и HTTPS">
        <PlayStack>
          <PlayTabs tabs={NETWORKS} active={network} onChange={setNetwork} />

          <PlayToggle label="VPN включён" hint="Шифрует трафик после точки доступа" checked={vpn} onChange={setVpn} />
          <PlayToggle label="Только HTTPS-сайты" hint="Cookie и session внутри TLS" checked={httpsOnly} onChange={setHttpsOnly} />

          <PlayNodeRow
            nodes={[
              {key: 'you', icon: '📱', label: 'Вы'},
              {key: 'ap', icon: net.fake ? '🎭' : '📡', label: net.label, warn: !net.secure},
              {key: 'att', icon: result.sniff ? '🕵️' : '⛔', label: 'Наблюдатель', warn: result.sniff},
              {key: 'web', icon: '🌐', label: 'Сайт'},
            ]}
            activeKey="ap"
          />

          <PlayStatusBadge tone={riskMeta.badge}>Риск: {riskMeta.label}</PlayStatusBadge>

          <PlayFeedback tone={riskMeta.tone}>
            {result.mitm
              ? 'Активная атака возможна — используйте VPN и проверяйте сертификаты.'
              : result.sniff
                ? 'Пассивный перехват метаданных вероятен без VPN.'
                : 'При WPA3 и доверенной сети риск минимален.'}
          </PlayFeedback>

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
