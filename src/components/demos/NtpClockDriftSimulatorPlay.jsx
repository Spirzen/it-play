import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayActionBar,
  PlayLog,
  PlayMetrics,
  PlayNodeRow,
  PlaySlider,
  PlayStack,
  SN_COLORS,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const SERVERS = ['auth', 'api', 'db'];

export default function NtpClockDriftSimulatorPlay() {
  const [driftSec, setDriftSec] = useState(120);
  const [synced, setSynced] = useState(false);

  const offset = synced ? 0 : driftSec;

  const metrics = useMemo(() => {
    const jwtValid = offset <= 30;
    const kerberosOk = offset <= 300;
    const logOrder = offset > 60 ? 'broken' : 'ok';
    return {jwtValid, kerberosOk, logOrder};
  }, [offset]);

  const logs = [
    `Смещение часов auth-сервера: ${offset > 0 ? '+' : ''}${offset} сек`,
    synced ? '✓ chrony/NTP синхронизирован (Stratum 2)' : '⚠️ Часы ушли — NTP не настроен или заблокирован',
    metrics.jwtValid ? '✓ JWT exp/iat в допустимом окне' : '❌ JWT отклонён: "token used before issued"',
    metrics.kerberosOk ? '✓ Kerberos (±5 мин)' : '❌ Kerberos KRB_AP_ERR_SKEW',
    metrics.logOrder === 'ok' ? '✓ События в логах упорядочены' : '⚠️ Корреляция логов auth/api перепутана',
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Дрейф часов и NTP" subtitle="JWT, Kerberos и порядок логов при рассинхронизации">
        <PlayStack>
          <PlaySlider
            label="Дрейф (сек)"
            value={driftSec}
            min={0}
            max={600}
            step={15}
            disabled={synced}
            onChange={setDriftSec}
          />

          <PlayActionBar>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setSynced((s) => !s)}>
              {synced ? 'Отключить NTP' : 'Синхронизировать (NTP)'}
            </button>
          </PlayActionBar>

          <PlayNodeRow
            nodes={SERVERS.map((s) => ({
              key: s,
              icon: s === 'auth' ? '🔐' : s === 'api' ? '⚙️' : '🗄️',
              label: `${s}${s === 'auth' && offset ? ` +${offset}s` : ''}`,
              warn: s === 'auth' && offset > 30,
              done: synced,
            }))}
            activeKey="auth"
          />

          <PlayMetrics
            grid
            items={[
              {
                label: 'JWT валидность',
                value: metrics.jwtValid ? 100 : 0,
                max: 100,
                color: metrics.jwtValid ? SN_COLORS.success : SN_COLORS.danger,
              },
              {
                label: 'Kerberos',
                value: metrics.kerberosOk ? 100 : 0,
                max: 100,
                color: metrics.kerberosOk ? SN_COLORS.success : SN_COLORS.danger,
              },
            ]}
          />

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
