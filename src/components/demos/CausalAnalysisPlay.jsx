import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const DEFAULT_WHYS = [
  'Остановилась линия — сработала защита двигателя',
  'Перегрузился подшипник',
  'Недостаточная смазка',
  'Соскочил фильтр насоса',
  'Нет регламента замены фильтра',
];

const ISHIKAWA = [
  {id: 'people', label: 'Персонал', items: ['Нехватка водителей', 'Ошибка оператора']},
  {id: 'machine', label: 'Оборудование', items: ['Сломался грузовик', 'Сбой GPS']},
  {id: 'method', label: 'Процессы', items: ['Поздняя заявка', 'Нет маршрута']},
];

function CausalAnalysisPlayInner() {
  const [mode, setMode] = useState('whys');
  const [whyIdx, setWhyIdx] = useState(0);
  const [catId, setCatId] = useState('people');

  const cat = ISHIKAWA.find((c) => c.id === catId) ?? ISHIKAWA[0];

  return (
    <DemoShell>
      <DemoCard title="Причинно-следственный анализ" subtitle="5 &quot;Почему&quot; и категории диаграммы Исикавы">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          <button
            type="button"
            className={clsx(toolStyles.chip, mode === 'whys' && toolStyles.chipActive)}
            onClick={() => setMode('whys')}
          >
            5 Почему
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, mode === 'fish' && toolStyles.chipActive)}
            onClick={() => setMode('fish')}
          >
            Исикава
          </button>
        </div>

        {mode === 'whys' ? (
          <>
            <p style={{fontSize: '0.88rem', margin: '0 0 0.35rem'}}>
              <strong>Проблема:</strong> остановка производственной линии
            </p>
            <ol style={{margin: '0 0 0.65rem', paddingLeft: '1.2rem', fontSize: '0.86rem'}}>
              {DEFAULT_WHYS.slice(0, whyIdx + 1).map((w, i) => (
                <li key={w}>
                  {i === 0 ? w : `Почему? → ${w}`}
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              disabled={whyIdx >= DEFAULT_WHYS.length - 1}
              onClick={() => setWhyIdx((i) => Math.min(i + 1, DEFAULT_WHYS.length - 1))}
            >
              {whyIdx >= DEFAULT_WHYS.length - 1 ? 'Корневая причина найдена' : 'Следующее "почему"'}
            </button>
          </>
        ) : (
          <>
            <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
              {ISHIKAWA.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={clsx(toolStyles.chip, catId === c.id && toolStyles.chipActive)}
                  onClick={() => setCatId(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p style={{fontSize: '0.86rem', margin: 0}}>
              <strong>{cat.label}:</strong> {cat.items.join('; ')}
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default CausalAnalysisPlayInner;
