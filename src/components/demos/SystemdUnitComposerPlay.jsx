import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PlayActionBar, PlayCode, PlayField, PlayLog, PlayStack} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

export default function SystemdUnitComposerPlay() {
  const [name, setName] = useState('myapp');
  const [execStart, setExecStart] = useState('/usr/bin/myapp --port 8080');
  const [after, setAfter] = useState('network-online.target');
  const [restart, setRestart] = useState('on-failure');
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);

  const unit = useMemo(
    () => `[Unit]
Description=${name} service
After=${after}

[Service]
Type=simple
ExecStart=${execStart}
Restart=${restart}

[Install]
WantedBy=multi-user.target`,
    [name, execStart, after, restart],
  );

  const logs = [
    enabled ? `✓ systemctl enable ${name}` : '○ unit not enabled',
    started ? `✓ systemctl start ${name} → active (running)` : '○ service inactive',
    started ? `journalctl -u ${name} -f` : 'ExecStart не запускался',
    restart === 'on-failure' && started ? 'При падении процесса systemd перезапустит через RestartSec' : '',
  ].filter(Boolean);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Конструктор systemd unit" subtitle="Соберите .service и проверьте enable/start">
        <PlayStack>
          <PlayField label="Имя службы">
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </PlayField>
          <PlayField label="ExecStart">
            <input value={execStart} onChange={(e) => setExecStart(e.target.value)} />
          </PlayField>
          <PlayField label="After">
            <select value={after} onChange={(e) => setAfter(e.target.value)}>
              <option>network-online.target</option>
              <option>postgresql.service</option>
              <option>docker.service</option>
            </select>
          </PlayField>
          <PlayField label="Restart">
            <select value={restart} onChange={(e) => setRestart(e.target.value)}>
              <option>on-failure</option>
              <option>always</option>
              <option>no</option>
            </select>
          </PlayField>

          <PlayCode>{unit}</PlayCode>

          <PlayActionBar>
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setEnabled(true)}>
              systemctl enable
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setStarted(true)}>
              systemctl start
            </button>
          </PlayActionBar>

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
