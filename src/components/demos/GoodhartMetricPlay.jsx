import React, {useState} from 'react';
import {MetricGrid, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

export default function GoodhartMetricPlay() {
  const [ticketsClosed, setTicketsClosed] = useState(50);
  const [quality, setQuality] = useState(80);

  const gaming = ticketsClosed > 80 && quality < 70;

  const closeMany = () => {
    setTicketsClosed((t) => t + 15);
    setQuality((q) => Math.max(20, q - 12));
  };

  const fixRoot = () => {
    setTicketsClosed((t) => Math.max(30, t - 5));
    setQuality((q) => Math.min(95, q + 10));
  };

  return (
    <PlayRoot title="Закон Гудхарта" subtitle="KPI как цель → поведение оптимизирует метрику, не смысл">
      <MetricGrid items={[{label: 'Tickets closed/day', value: String(ticketsClosed)}, {label: 'Customer satisfaction', value: `${quality}%`}]} />
      <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={closeMany}>Закрывать быстрее (gaming)</button>
      <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={fixRoot}>Чинить root cause</button>
      <Panel title="Наблюдение">
        {gaming
          ? 'Метрика растёт, качество падает — Goodhart в действии.'
          : 'Сбалансированные метрики + качественные guardrails.'}
      </Panel>
    </PlayRoot>
  );
}
