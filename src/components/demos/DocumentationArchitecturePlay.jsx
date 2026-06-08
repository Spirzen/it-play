import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import DiagramStudio from '@/components/demos/DiagramStudio';
import styles from '@/components/demos/DocumentationArchitecturePlay.module.css';

const DOC_TREE = [
  {
    id: 'req',
    label: 'Требования',
    children: [
      {id: 'brd', label: 'BRD / Vision'},
      {id: 'srs', label: 'SRS / User Stories'},
      {id: 'nfr', label: 'NFR / SLA'},
    ],
  },
  {
    id: 'design',
    label: 'Проектная',
    children: [
      {id: 'arch', label: 'Архитектура (C4, UML)'},
      {id: 'api', label: 'API (OpenAPI)'},
      {id: 'data', label: 'ERD / модель данных'},
      {id: 'bpmn', label: 'BPMN процессы'},
    ],
  },
  {
    id: 'ops',
    label: 'Эксплуатация',
    children: [
      {id: 'runbook', label: 'Runbook'},
      {id: 'deploy', label: 'Инструкция развёртывания'},
    ],
  },
];

const DOC_HINTS = {
  brd: 'Бизнес-цели, scope, стейкхолдеры, критерии успеха.',
  srs: 'Функциональные требования с ID, трассировка к тестам.',
  api: 'OpenAPI + примеры; синхронизация с кодом (code-first / design-first).',
  arch: 'C4 Context → Containers; UML для деталей.',
  bpmn: 'As-Is / To-Be; уровни: описательный → аналитический → исполняемый.',
  data: 'ERD, словарь данных, ограничения целостности.',
};

function DocumentationArchitecturePlayInner() {
  const [selected, setSelected] = useState('arch');
  const [showModeling, setShowModeling] = useState(true);

  const findLabel = (id, nodes = DOC_TREE) => {
    for (const n of nodes) {
      if (n.id === id) return n.label;
      if (n.children) {
        const found = findLabel(id, n.children);
        if (found) return found;
      }
    }
    return id;
  };

  return (
    <DemoShell>
      <DemoCard
        title="Архитектура документации и моделирование"
        subtitle="Иерархия артефактов от требований до эксплуатации + студия диаграмм"
      >
        <div className={styles.layout}>
          <nav className={styles.tree}>
            {DOC_TREE.map((section) => (
              <div key={section.id} className={styles.section}>
                <div className={styles.sectionHead}>{section.label}</div>
                {section.children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    className={clsx(styles.node, selected === child.id && styles.nodeActive)}
                    onClick={() => setSelected(child.id)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className={styles.preview}>
            <h4>{findLabel(selected)}</h4>
            <p>{DOC_HINTS[selected] || 'Выберите тип документа в дереве слева.'}</p>
            <div className={styles.breadcrumb}>
              Обзор системы → Модули → {findLabel(selected)} → детали
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={showModeling}
                onChange={(e) => setShowModeling(e.target.checked)}
              />
              Показать студию UML / C4 / BPMN
            </label>
          </div>
        </div>
      </DemoCard>

      {showModeling && (
        <DiagramStudio
          title="Моделирование для проектной документации"
          subtitle="Диаграммы UML, C4 и BPMN — артефакты раздела &quot;Проектная&quot;"
        />
      )}
    </DemoShell>
  );
}

export default DocumentationArchitecturePlayInner;
