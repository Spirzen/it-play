import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GIT_COMMANDS, GIT_FLAGS, buildCommand} from '@/components/shared/kb/gitFlagsEngine';
import styles from '@/components/demos/GitFlagsPlay.module.css';

function GitFlagsPlayInner() {
  const [cmdId, setCmdId] = useState('commit');
  const [active, setActive] = useState(new Set(['m']));

  const available = GIT_FLAGS.filter((f) => f.flags.includes(cmdId));
  const command = useMemo(() => buildCommand(cmdId, active), [cmdId, active]);

  const toggle = (id) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onCmd = (id) => {
    setCmdId(id);
    setActive(new Set());
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Конструктор команд Git"
        subtitle="Выберите команду и флаги — строка в терминале собирается автоматически"
      >
        <div className="it-demo__tabs" role="tablist">
          {GIT_COMMANDS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              className={clsx('it-demo__tab', cmdId === c.id && 'it-demo__tab--active')}
              onClick={() => onCmd(c.id)}
            >
              git {c.label}
            </button>
          ))}
        </div>

        <pre className={styles.command}>{command}</pre>

        <div className={styles.flagList}>
          {available.map((f) => (
            <label key={f.id} className={clsx(styles.flagRow, active.has(f.id) && styles.flagOn)}>
              <input type="checkbox" checked={active.has(f.id)} onChange={() => toggle(f.id)} />
              <code>{f.long ?? f.short}</code>
              <span>{f.desc}</span>
            </label>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GitFlagsPlayInner;
