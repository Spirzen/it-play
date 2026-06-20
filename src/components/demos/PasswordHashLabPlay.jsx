import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayCode,
  PlayField,
  PlayLog,
  PlayMetrics,
  PlaySlider,
  PlayStack,
  PlayToggle,
  SN_COLORS,
  estimateCrackSeconds,
  simpleHash,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

function formatTime(sec) {
  if (sec < 1) return '< 1 сек';
  if (sec < 60) return `${Math.round(sec)} сек`;
  if (sec < 3600) return `${Math.round(sec / 60)} мин`;
  if (sec < 86400) return `${Math.round(sec / 3600)} ч`;
  return `${Math.round(sec / 86400)} дн`;
}

export default function PasswordHashLabPlay() {
  const [password, setPassword] = useState('P@ssw0rd!');
  const [salt, setSalt] = useState('a3f9');
  const [reuseSites, setReuseSites] = useState(1);
  const [leaked, setLeaked] = useState(false);

  const stats = useMemo(() => {
    const charset = /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) ? 62 : 26;
    const crackSec = estimateCrackSeconds(password.length, charset);
    const hashNoSalt = simpleHash(password);
    const hashSalted = simpleHash(password, salt);
    return {charset, crackSec, hashNoSalt, hashSalted};
  }, [password, salt]);

  const logs = [
    `Пароль: ${password.replace(/./g, '•')} (${password.length} симв.)`,
    `Хеш без соли: ${stats.hashNoSalt}`,
    `Хеш с солью "${salt}": ${stats.hashSalted}`,
    `Оценка перебора (~1e9/с): ${formatTime(stats.crackSec)}`,
    reuseSites > 1 ? `⚠️ Один пароль на ${reuseSites} сайтах — credential stuffing` : '✓ Уникальный пароль для сервиса',
    leaked ? '💥 Утечка БД: без соли rainbow table находит совпадения быстрее' : 'БД не утекала',
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Лаборатория паролей и хешей" subtitle="Соль, время перебора и повторное использование">
        <PlayStack>
          <PlayField label="Пароль">
            <input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
          </PlayField>
          <PlayField label="Соль (salt)">
            <input value={salt} onChange={(e) => setSalt(e.target.value)} />
          </PlayField>
          <PlaySlider label="Сайтов с тем же паролем" value={reuseSites} min={1} max={10} onChange={setReuseSites} />
          <PlayToggle label="Симулировать утечку базы" checked={leaked} onChange={setLeaked} />

          <PlayCode>{`bcrypt("${password}", rounds=12, salt="${salt}") → ${stats.hashSalted}…`}</PlayCode>

          <PlayMetrics
            grid
            items={[
              {label: 'Сложность перебора', value: Math.min(100, password.length * 8), max: 100},
              {
                label: 'Риск stuffing',
                value: reuseSites * 10,
                max: 100,
                color: reuseSites > 2 ? SN_COLORS.danger : SN_COLORS.warning,
              },
            ]}
          />

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
