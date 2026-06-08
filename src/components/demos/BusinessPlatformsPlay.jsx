import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/BusinessPlatformsPlay.module.css';

const TABS = [
  {id: 'virt', label: 'Виртуализация'},
  {id: 'k8s', label: 'Kubernetes'},
  {id: 'lowcode', label: 'Low-code'},
  {id: 'devops', label: 'DevOps'},
  {id: 'comms', label: 'Коммуникации'},
];

const CONTENT = {
  virt: {
    title: 'Платформы виртуализации',
    nodes: ['ESXi / Hyper-V', 'vCenter', 'ВМ × N', 'Снапшоты / vMotion'],
    metric: 'Серверов заменено: 10 → 1 хост',
  },
  k8s: {
    title: 'Оркестрация контейнеров',
    nodes: ['Control Plane', 'Worker', 'Pod', 'Service', 'Ingress'],
    metric: 'Реплик API: 3 — отказ одного узла не роняет сервис',
  },
  lowcode: {
    title: 'Low-code / No-code',
    nodes: ['Конструктор UI', 'Workflow', 'Коннекторы', 'Публикация'],
    metric: 'MVP: недели → дни',
  },
  devops: {
    title: 'DevOps-платформа',
    nodes: ['Git', 'CI/CD', 'IaC', 'Мониторинг', 'Артефакты'],
    metric: 'От коммита до prod — один pipeline',
  },
  comms: {
    title: 'Корпоративные коммуникации',
    nodes: ['Wi-Fi', 'ВАТС', 'Мессенджер', 'ВКС', 'Почта'],
    metric: 'Единый контур для офиса и удалёнки',
  },
};

function BusinessPlatformsPlayInner() {
  const [tab, setTab] = useState('virt');
  const [activeNode, setActiveNode] = useState(0);
  const c = CONTENT[tab];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Платформенные решения в бизнесе"
        subtitle="Интерактивная карта категорий из статьи — клик по блоку цепочки"
      >
        <div className="it-demo__tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => {
                setTab(t.id);
                setActiveNode(0);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h4 className={styles.sectionTitle}>{c.title}</h4>
        <div className={styles.pipeline}>
          {c.nodes.map((node, i) => (
            <button
              key={node}
              type="button"
              className={clsx(styles.node, activeNode === i && styles.nodeActive)}
              onClick={() => setActiveNode(i)}
            >
              {node}
              {i < c.nodes.length - 1 && <span className={styles.arrow}>→</span>}
            </button>
          ))}
        </div>
        <p className={styles.detail}>
          <strong>{c.nodes[activeNode]}</strong> — элемент цепочки "{c.title}". {c.metric}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default BusinessPlatformsPlayInner;
