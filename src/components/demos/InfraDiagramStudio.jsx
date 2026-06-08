import React from 'react';
import DiagramStudio from '@/components/demos/DiagramStudio.jsx';

/** Интерактивные архитектурные схемы для разделов 8.04–8.07 (DevOps, микросервисы, контейнеры, ИБ) */
export default function InfraDiagramStudio(props) {
  return (
    <DiagramStudio
      initialMode="flow"
      modes={['flow', 'c4', 'bpmn', 'uml']}
      title="Инфраструктурная студия"
      subtitle="Перетаскивайте компоненты, связывайте стрелками и экспортируйте в Mermaid"
      {...props}
    />
  );
}
