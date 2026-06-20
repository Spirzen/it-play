import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';

const MODELS = [
  {id: 'gpt4o', name: 'GPT-4o', inPrice: 2.5, outPrice: 10},
  {id: 'mini', name: 'GPT-4o mini', inPrice: 0.15, outPrice: 0.6},
  {id: 'claude', name: 'Claude Sonnet', inPrice: 3, outPrice: 15},
  {id: 'local', name: 'Local GPU', inPrice: 0.05, outPrice: 0.05},
];

function AiCostCalculatorPlayInner() {
  const [modelId, setModelId] = useState('mini');
  const [users, setUsers] = useState(50);
  const [reqPerDay, setReqPerDay] = useState(20);
  const [tokensIn, setTokensIn] = useState(800);
  const [tokensOut, setTokensOut] = useState(400);

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[1];

  const cost = useMemo(() => {
    const perReq = (tokensIn / 1e6) * model.inPrice + (tokensOut / 1e6) * model.outPrice;
    const daily = perReq * users * reqPerDay;
    return {perReq, daily, monthly: daily * 30};
  }, [model, tokensIn, tokensOut, users, reqPerDay]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Калькулятор стоимости ИИ" subtitle="Оценка месячного бюджета API ($/1M токенов)">
        <div className={shared.stack}>
          <label className={shared.sliderField}>
            <span className={shared.sectionTitle}>Модель</span>
            <select className={shared.select} value={modelId} onChange={(e) => setModelId(e.target.value)}>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>

          <label className={shared.sliderField}>
            <div className={shared.sliderHead}>
              <span>Пользователей</span>
              <span className={shared.sliderValue}>{users}</span>
            </div>
            <input className={shared.range} type="range" min="1" max="500" value={users} onChange={(e) => setUsers(+e.target.value)} />
          </label>

          <label className={shared.sliderField}>
            <div className={shared.sliderHead}>
              <span>Запросов/день на пользователя</span>
              <span className={shared.sliderValue}>{reqPerDay}</span>
            </div>
            <input className={shared.range} type="range" min="1" max="100" value={reqPerDay} onChange={(e) => setReqPerDay(+e.target.value)} />
          </label>

          <label className={shared.sliderField}>
            <div className={shared.sliderHead}>
              <span>Токенов в запросе</span>
              <span className={shared.sliderValue}>{tokensIn}</span>
            </div>
            <input className={shared.range} type="range" min="100" max="8000" step="100" value={tokensIn} onChange={(e) => setTokensIn(+e.target.value)} />
          </label>

          <label className={shared.sliderField}>
            <div className={shared.sliderHead}>
              <span>Токенов в ответе</span>
              <span className={shared.sliderValue}>{tokensOut}</span>
            </div>
            <input className={shared.range} type="range" min="50" max="4000" step="50" value={tokensOut} onChange={(e) => setTokensOut(+e.target.value)} />
          </label>
        </div>

        <div className={shared.totalsCard}>
          <div>За запрос: <strong>${cost.perReq.toFixed(4)}</strong></div>
          <div>В день: <strong>${cost.daily.toFixed(2)}</strong></div>
          <div className={shared.totalsHighlight}>
            В месяц (~30 дн.): <strong>${cost.monthly.toFixed(2)}</strong>
          </div>
        </div>

        <p className={shared.hint}>RAG и агенты увеличивают <strong>tokens_in</strong>. Кэш и маршрутизация на mini снижают счёт.</p>
      </DemoCard>
    </DemoShell>
  );
}

export default AiCostCalculatorPlayInner;
