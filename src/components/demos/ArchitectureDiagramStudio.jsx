import React from 'react';
import DiagramStudio from '@/components/demos/DiagramStudio.jsx';

/** Интерактивные архитектурные схемы (flow + C4 + BPMN + UML) для раздела 7.06 */
export default function ArchitectureDiagramStudio(props) {
  return (
    <DiagramStudio
      initialMode="flow"
      modes={['flow', 'c4', 'bpmn', 'uml']}
      title="Архитектурная студия"
      subtitle="Перетаскивайте компоненты, связывайте стрелками и экспортируйте в Mermaid для документации"
      {...props}
    />
  );
}
