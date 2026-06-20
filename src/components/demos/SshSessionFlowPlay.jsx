import React, {useCallback, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PlayControls, PlayNodeRow, PlayPanel, PlayStack} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const STEPS = [
  {
    title: 'Клиент открывает TCP',
    subtitle: 'PuTTY / ssh → порт 22',
    detail: 'putty.exe устанавливает TCP-соединение с server.example.com:22',
    nodes: [
      {key: 'pc', icon: '💻', label: 'Windows'},
      {key: 'net', icon: '🌐', label: 'Интернет'},
      {key: 'srv', icon: '🖥️', label: 'VPS'},
    ],
    active: 'pc',
  },
  {
    title: 'SSH handshake + обмен ключами',
    subtitle: 'Шифрование канала',
    detail: 'Версии протокола, host key, выбор cipher — дальше весь трафик зашифрован',
    nodes: [
      {key: 'pc', icon: '💻', label: 'Клиент', done: true},
      {key: 'net', icon: '🔐', label: 'TLS-like'},
      {key: 'srv', icon: '🖥️', label: 'sshd'},
    ],
    active: 'net',
  },
  {
    title: 'Аутентификация',
    subtitle: 'Пароль или ключ',
    detail: 'sshd проверяет ~/.ssh/authorized_keys или PAM-пароль',
    nodes: [
      {key: 'pc', icon: '🔑', label: 'Ключ .ppk'},
      {key: 'net', icon: '🔐', label: 'Канал'},
      {key: 'srv', icon: '✅', label: 'sshd OK'},
    ],
    active: 'srv',
  },
  {
    title: 'Запуск оболочки',
    subtitle: '/bin/bash на сервере',
    detail: 'Приглашение user@server:~$ — команды выполняются НА сервере, не на вашем ПК',
    nodes: [
      {key: 'pc', icon: '📺', label: 'Окно PuTTY'},
      {key: 'net', icon: '🔐', label: 'SSH'},
      {key: 'srv', icon: '🐚', label: 'bash'},
    ],
    active: 'srv',
  },
  {
    title: 'Команда ls',
    subtitle: 'Пример сеанса',
    detail: 'ls → sshd → bash → readdir() → список каталогов обратно в окно',
    nodes: [
      {key: 'pc', icon: '⌨️', label: 'ls'},
      {key: 'net', icon: '📦', label: 'пакеты'},
      {key: 'srv', icon: '📂', label: '/home/user'},
    ],
    active: 'net',
  },
];

export default function SshSessionFlowPlay() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const reset = useCallback(() => setStep(0), []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="SSH: от Open до команды на сервере"
        subtitle="PuTTY — только клиент; bash работает на удалённой машине"
      >
        <PlayStack>
          <PlayNodeRow
            nodes={current.nodes.map((n, idx) => {
              const activeIdx = current.nodes.findIndex((x) => x.key === current.active);
              return {
                ...n,
                done: n.done || idx < activeIdx,
              };
            })}
            activeKey={current.active}
          />
          <PlayPanel badge={`Этап ${step + 1}`} title={current.title} subtitle={current.subtitle}>
            <p className={styles.panelBody}>{current.detail}</p>
          </PlayPanel>
          <PlayControls
            step={step}
            total={STEPS.length}
            onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            onPrev={() => setStep((s) => Math.max(0, s - 1))}
            onReset={reset}
          />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
