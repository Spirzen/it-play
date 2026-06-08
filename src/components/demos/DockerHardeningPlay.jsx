import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DockerHardeningPlay.module.css';

const OPTIONS = [
  {
    id: 'seccomp',
    label: 'Seccomp-профиль',
    points: 25,
    cmd: '--security-opt seccomp=/profiles/default.json',
    note: 'Блокирует опасные syscall (mount, ptrace).',
  },
  {
    id: 'nouser',
    label: 'USER non-root',
    points: 20,
    cmd: 'USER 10001:10001',
    note: 'В Dockerfile — процесс не root внутри контейнера.',
  },
  {
    id: 'readonly',
    label: 'Read-only rootfs',
    points: 20,
    cmd: '--read-only --tmpfs /tmp',
    note: 'Злоумышленник не перезапишет системные файлы.',
  },
  {
    id: 'userns',
    label: 'User namespaces',
    points: 20,
    cmd: 'dockerd --userns-remap=default',
    note: 'root в контейнере ≠ root на хосте.',
  },
  {
    id: 'capdrop',
    label: 'Drop capabilities',
    points: 15,
    cmd: '--cap-drop=ALL --cap-add=NET_BIND_SERVICE',
    note: 'Минимум привилегий ядра Linux.',
  },
];

function DockerHardeningPlayInner() {
  const [enabled, setEnabled] = useState({
    seccomp: true,
    nouser: true,
    readonly: false,
    userns: false,
    capdrop: true,
  });

  const score = useMemo(
    () => OPTIONS.filter((o) => enabled[o.id]).reduce((s, o) => s + o.points, 0),
    [enabled],
  );

  const cmd = useMemo(() => {
    const flags = OPTIONS.filter((o) => enabled[o.id] && o.cmd.startsWith('--'))
      .map((o) => o.cmd)
      .join(' \\\n  ');
    return `docker run ${flags || '(без hardening-флагов)'} \\\n  my-app:1.0`;
  }, [enabled]);

  const risk = useMemo(() => {
    if (score >= 80) return 'Высокий уровень hardening — близко к production best practices.';
    if (score >= 50) return 'Средний уровень: остаются риски escape и privilege escalation.';
    return 'Низкий уровень: контейнер близок к "docker run --privileged" по поверхности атаки.';
  }, [score]);

  const barColor = score >= 80 ? '#2e7d32' : score >= 50 ? '#ed6c02' : '#d32f2f';

  return (
    <DemoShell>
      <DemoCard
        title="Hardening Docker-контейнера"
        subtitle="Включайте механизмы защиты — счётчик безопасности и команда run обновляются live"
      >
        <div className={styles.scoreBar} aria-hidden>
          <div
            className={styles.scoreFill}
            style={{width: `${score}%`, background: barColor}}
          />
        </div>
        <p style={{margin: '0 0 0.65rem', fontSize: '0.85rem'}}>
          Оценка hardening: <strong>{score}</strong> / 100
        </p>

        <div className={styles.opts}>
          {OPTIONS.map((o) => (
            <label
              key={o.id}
              className={clsx(styles.opt, enabled[o.id] && styles.optOn)}
            >
              <input
                type="checkbox"
                checked={enabled[o.id]}
                onChange={(e) =>
                  setEnabled((prev) => ({...prev, [o.id]: e.target.checked}))
                }
              />
              <span>
                <strong>{o.label}</strong> (+{o.points})
                <br />
                <small>{o.note}</small>
              </span>
            </label>
          ))}
        </div>

        <pre className={styles.cmd}>{cmd}</pre>
        <p className={styles.risk}>{risk}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default DockerHardeningPlayInner;
