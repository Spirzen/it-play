import React, {useMemo, useState} from 'react';

const STEP = 0.1;

function round2(value) {
  return Math.round(value * 100) / 100;
}

function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

export default function LinearProgrammingPlayground() {
  const [profitA, setProfitA] = useState(3);
  const [profitB, setProfitB] = useState(2);
  const [machineLimit, setMachineLimit] = useState(8);
  const [materialLimit, setMaterialLimit] = useState(8);
  const [x1, setX1] = useState(2);
  const [x2, setX2] = useState(1);

  const pointAnalysis = useMemo(() => {
    const usedMachine = 2 * x1 + x2;
    const usedMaterial = x1 + 2 * x2;
    const feasible = x1 >= 0 && x2 >= 0 && usedMachine <= machineLimit && usedMaterial <= materialLimit;
    const z = profitA * x1 + profitB * x2;
    return {usedMachine, usedMaterial, feasible, z};
  }, [x1, x2, machineLimit, materialLimit, profitA, profitB]);

  const bestPlan = useMemo(() => {
    let best = null;
    const maxX = Math.max(machineLimit, materialLimit, 0);
    for (let a = 0; a <= maxX + STEP; a += STEP) {
      for (let b = 0; b <= maxX + STEP; b += STEP) {
        const usedMachine = 2 * a + b;
        const usedMaterial = a + 2 * b;
        if (usedMachine <= machineLimit + 1e-9 && usedMaterial <= materialLimit + 1e-9) {
          const z = profitA * a + profitB * b;
          if (!best || z > best.z) {
            best = {x1: round2(a), x2: round2(b), z: round2(z), usedMachine, usedMaterial};
          }
        }
      }
    }
    return best;
  }, [machineLimit, materialLimit, profitA, profitB]);

  const slackMachine = round2(machineLimit - pointAnalysis.usedMachine);
  const slackMaterial = round2(materialLimit - pointAnalysis.usedMaterial);

  return (
    <div className="card margin-bottom--lg">
      <div className="card__header">
        <h3 style={{marginBottom: 8}}>LP Playground: цель, ограничения, оптимум</h3>
        <p style={{margin: 0}}>
          Меняйте коэффициенты и проверяйте, как смещается лучший план для модели:
          <code> max Z = c1*x1 + c2*x2 </code> при ограничениях <code>2x1 + x2 ≤ b1</code> и{' '}
          <code>x1 + 2x2 ≤ b2</code>.
        </p>
      </div>
      <div className="card__body">
        <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))'}}>
          <label>
            Прибыль A (c1)
            <input
              className="margin-top--xs"
              type="number"
              value={profitA}
              step="0.5"
              onChange={(e) => setProfitA(clampNumber(e.target.value, -50, 50, 3))}
            />
          </label>
          <label>
            Прибыль B (c2)
            <input
              className="margin-top--xs"
              type="number"
              value={profitB}
              step="0.5"
              onChange={(e) => setProfitB(clampNumber(e.target.value, -50, 50, 2))}
            />
          </label>
          <label>
            Лимит станков (b1)
            <input
              className="margin-top--xs"
              type="number"
              value={machineLimit}
              step="0.5"
              onChange={(e) => setMachineLimit(clampNumber(e.target.value, 0, 100, 8))}
            />
          </label>
          <label>
            Лимит сырья (b2)
            <input
              className="margin-top--xs"
              type="number"
              value={materialLimit}
              step="0.5"
              onChange={(e) => setMaterialLimit(clampNumber(e.target.value, 0, 100, 8))}
            />
          </label>
        </div>

        <hr />

        <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))'}}>
          <label>
            Проверяемая точка x1
            <input
              className="margin-top--xs"
              type="number"
              value={x1}
              step="0.1"
              onChange={(e) => setX1(clampNumber(e.target.value, 0, 200, 2))}
            />
          </label>
          <label>
            Проверяемая точка x2
            <input
              className="margin-top--xs"
              type="number"
              value={x2}
              step="0.1"
              onChange={(e) => setX2(clampNumber(e.target.value, 0, 200, 1))}
            />
          </label>
        </div>

        <div
          className={`alert margin-top--md ${pointAnalysis.feasible ? 'alert--success' : 'alert--danger'}`}
          role="status"
        >
          <strong>{pointAnalysis.feasible ? 'Точка допустима' : 'Точка недопустима'}</strong>
          <div>
            Z = {round2(pointAnalysis.z)}, 2x1+x2 = {round2(pointAnalysis.usedMachine)} (запас {slackMachine}),
            x1+2x2 = {round2(pointAnalysis.usedMaterial)} (запас {slackMaterial})
          </div>
        </div>

        {bestPlan ? (
          <div className="alert alert--info margin-top--md">
            <strong>Автопоиск лучшего плана (шаг сетки 0.1):</strong>{' '}
            x1*={bestPlan.x1}, x2*={bestPlan.x2}, Z*={bestPlan.z}
            <div>
              Активность ограничений: 2x1+x2={round2(bestPlan.usedMachine)} / {machineLimit}, x1+2x2=
              {round2(bestPlan.usedMaterial)} / {materialLimit}
            </div>
          </div>
        ) : (
          <div className="alert alert--warning margin-top--md">
            Нет допустимых точек. Проверьте знаки и лимиты в ограничениях.
          </div>
        )}
      </div>
    </div>
  );
}
