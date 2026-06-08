import React, {useMemo, useState} from 'react';

const TABLEAU = [
  {base: 's1', values: {x1: 2, x2: 1, rhs: 8}},
  {base: 's2', values: {x1: 1, x2: 2, rhs: 8}},
];

const REDUCED_COST = {x1: 3, x2: 2};

function getRatio(row, entering) {
  const a = row.values[entering];
  if (a <= 0) return Infinity;
  return row.values.rhs / a;
}

export default function SimplexStepTrainer() {
  const [entering, setEntering] = useState('x1');
  const [leaving, setLeaving] = useState('s1');
  const [showAnswer, setShowAnswer] = useState(false);

  const analysis = useMemo(() => {
    const bestEntering = REDUCED_COST.x1 >= REDUCED_COST.x2 ? 'x1' : 'x2';
    const ratios = TABLEAU.map((row) => ({
      base: row.base,
      ratio: getRatio(row, entering),
    }));
    const finite = ratios.filter((r) => Number.isFinite(r.ratio));
    const bestLeaving = finite.length
      ? finite.reduce((acc, cur) => (cur.ratio < acc.ratio ? cur : acc)).base
      : null;

    return {
      ratios,
      bestEntering,
      bestLeaving,
      enteringOk: entering === bestEntering,
      leavingOk: leaving === bestLeaving,
    };
  }, [entering, leaving]);

  const bothCorrect = analysis.enteringOk && analysis.leavingOk;

  return (
    <div className="card margin-bottom--lg">
      <div className="card__header">
        <h3 style={{marginBottom: 8}}>Simplex Step Trainer</h3>
        <p style={{margin: 0}}>
          Мини-тренажёр одной итерации симплекс-метода: выберите входящую и выходящую переменную для
          таблицы из учебного примера.
        </p>
      </div>
      <div className="card__body">
        <table>
          <thead>
            <tr>
              <th>Базис</th>
              <th>x1</th>
              <th>x2</th>
              <th>RHS</th>
            </tr>
          </thead>
          <tbody>
            {TABLEAU.map((row) => (
              <tr key={row.base}>
                <td>{row.base}</td>
                <td>{row.values.x1}</td>
                <td>{row.values.x2}</td>
                <td>{row.values.rhs}</td>
              </tr>
            ))}
            <tr>
              <td>delta (max)</td>
              <td>{REDUCED_COST.x1}</td>
              <td>{REDUCED_COST.x2}</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>

        <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}>
          <label>
            Входящая переменная (наибольшая delta)
            <select className="margin-top--xs" value={entering} onChange={(e) => setEntering(e.target.value)}>
              <option value="x1">x1</option>
              <option value="x2">x2</option>
            </select>
          </label>

          <label>
            Выходящая переменная (min theta)
            <select className="margin-top--xs" value={leaving} onChange={(e) => setLeaving(e.target.value)}>
              <option value="s1">s1</option>
              <option value="s2">s2</option>
            </select>
          </label>
        </div>

        <div className="margin-top--md">
          <strong>Промежуточные theta для выбранного столбца {entering}:</strong>
          <ul style={{marginTop: 8}}>
            {analysis.ratios.map((item) => (
              <li key={item.base}>
                {item.base}: {Number.isFinite(item.ratio) ? item.ratio.toFixed(2) : 'не участвует (a<=0)'}
              </li>
            ))}
          </ul>
        </div>

        <div className={`alert margin-top--md ${bothCorrect ? 'alert--success' : 'alert--warning'}`}>
          {bothCorrect ? (
            <span>
              Верно: входящая <code>{analysis.bestEntering}</code>, выходящая <code>{analysis.bestLeaving}</code>.
            </span>
          ) : (
            <span>Пока не совпало с правилом largest delta + minimum theta.</span>
          )}
        </div>

        <button type="button" className="button button--secondary button--sm" onClick={() => setShowAnswer((v) => !v)}>
          {showAnswer ? 'Скрыть подсказку' : 'Показать подсказку'}
        </button>

        {showAnswer && (
          <div className="alert alert--info margin-top--md">
            Для <code>max</code> берём столбец с наибольшей положительной оценкой: здесь это{' '}
            <code>{analysis.bestEntering}</code>. Затем считаем theta = RHS/a в строках, где a&gt;0, и берём
            минимум: выходит <code>{analysis.bestLeaving}</code>.
          </div>
        )}
      </div>
    </div>
  );
}
