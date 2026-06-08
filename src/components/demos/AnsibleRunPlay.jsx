import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ANSIBLE_HOSTS, ANSIBLE_TASKS} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

const INITIAL_HOSTS = ANSIBLE_HOSTS.map((h) => h.id);

function AnsibleRunPlayInner() {
  const [hosts, setHosts] = useState(INITIAL_HOSTS);
  const [run, setRun] = useState(0);
  const [results, setResults] = useState(null);
  const [handlerFired, setHandlerFired] = useState(false);

  const toggleHost = (id) => {
    setHosts((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  };

  const execute = () => {
    const nextRun = run + 1;
    setRun(nextRun);
    const tplChanged = nextRun === 1;
    const perHost = hosts.map((hid) => {
      const lines = ANSIBLE_TASKS.map((t) => {
        const changed = nextRun === 1 && t.changedKey !== 'svc';
        const ok = true;
        return {task: t.name, changed, ok};
      });
      return {host: hid, lines};
    });
    setResults(perHost);
    setHandlerFired(tplChanged);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Ansible: плейбук на инвентаре"
        subtitle="Push по SSH, идемпотентность — второй прогон почти без changed"
      >
        <label className="it-demo__label">Инвентарь (hosts: web_servers)</label>
        <div className={styles.hostGrid}>
          {ANSIBLE_HOSTS.map((h) => (
            <button
              key={h.id}
              type="button"
              className={clsx(styles.hostCard, hosts.includes(h.id) && styles.hostOn)}
              onClick={() => toggleHost(h.id)}
            >
              <strong>{h.id}</strong>
              <div>{h.ip}</div>
              <div style={{fontSize: '0.62rem', opacity: 0.8}}>{h.group}</div>
            </button>
          ))}
        </div>

        <div className={styles.panel} style={{marginTop: '0.65rem'}}>
          <strong>tasks:</strong>
          <ul style={{margin: '0.35rem 0 0', fontSize: '0.8rem'}}>
            {ANSIBLE_TASKS.map((t) => (
              <li key={t.id}>
                {t.module}
                {t.notify && ' → notify: reload nginx'}
              </li>
            ))}
          </ul>
        </div>

        {results && (
          <div className={styles.logBox} style={{marginTop: '0.5rem'}}>
            {results.map((block) => (
              <div key={block.host}>
                {`=== ${block.host} ===`}
                {block.lines.map((l) => (
                  <div key={l.task}>
                    {l.ok ? 'ok' : 'fail'}: {l.task} {l.changed ? 'changed=1' : 'changed=0'}
                  </div>
                ))}
              </div>
            ))}
            {handlerFired && (
              <div style={{color: '#ffb74d'}}>RUNNING HANDLER: Перезапуск Nginx (reloaded)</div>
            )}
            {run >= 2 && (
              <div style={{color: '#81c784'}}>PLAY RECAP: changed=0 (идемпотентность)</div>
            )}
          </div>
        )}

        <div className={styles.row}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={execute}
            disabled={hosts.length === 0}
          >
            ansible-playbook site.yml {run === 0 ? '' : `(прогон #${run + 1})`}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => {
              setRun(0);
              setResults(null);
              setHandlerFired(false);
            }}
          >
            Сброс
          </button>
        </div>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Запустите дважды: после первого прогона нажмите снова — увидите changed=0 на тех же хостах.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AnsibleRunPlayInner;
