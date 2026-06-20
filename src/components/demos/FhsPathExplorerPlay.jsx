import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PlayCode, PlayLog, PlayPanel, PlayStack} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const TREE = [
  {path: '/', label: '/', hint: 'Верхний уровень — bin, etc, var, home…', depth: 0},
  {path: '/etc', label: '/etc', hint: 'Конфиги служб: nginx, ssh, fstab', depth: 1},
  {path: '/etc/nginx', label: '/etc/nginx', hint: 'nginx.conf, sites-enabled/', depth: 2},
  {path: '/var/log', label: '/var/log', hint: 'syslog, nginx/access.log, journal export', depth: 1},
  {path: '/var/lib', label: '/var/lib', hint: 'Состояние: docker, postgresql, apt', depth: 1},
  {path: '/home', label: '/home', hint: 'Домашние каталоги пользователей', depth: 1},
  {path: '/usr/bin', label: '/usr/bin', hint: 'Бинарники из пакетов: git, python3', depth: 1},
  {path: '/proc', label: '/proc', hint: 'Виртуальная ФС ядра — не редактировать', depth: 1},
];

const CMDS = {
  '/etc': 'cat /etc/os-release',
  '/etc/nginx': 'nginx -t && systemctl reload nginx',
  '/var/log': 'journalctl -u nginx --since today',
  '/var/lib': 'du -sh /var/lib/docker',
  '/home': 'ls -la /home',
  '/usr/bin': 'which python3 git curl',
  '/proc': 'cat /proc/cpuinfo | head',
  '/': 'ls -F /',
};

export default function FhsPathExplorerPlay() {
  const [selected, setSelected] = useState('/etc');

  const node = TREE.find((t) => t.path === selected) ?? TREE[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="FHS — проводник путей Linux" subtitle="Клик по каталогу → назначение и типичная команда">
        <PlayStack>
          <div className={styles.fhsTree}>
            {TREE.map((t) => (
              <button
                key={t.path}
                type="button"
                className={clsx(
                  styles.fhsItem,
                  styles[`fhsDepth${t.depth}`],
                  selected === t.path && styles.fhsItemActive,
                )}
                onClick={() => setSelected(t.path)}
              >
                <span aria-hidden>{t.depth === 0 ? '📁' : t.depth === 2 ? '📄' : '📂'}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <PlayPanel title={node.label} subtitle={node.hint}>
            <PlayCode>{CMDS[selected] ?? `cd ${selected}`}</PlayCode>
          </PlayPanel>

          <PlayLog lines={[`$ ${CMDS[selected] ?? `ls ${selected}`}`, '→ см. справочник FHS в статье 101.md']} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
