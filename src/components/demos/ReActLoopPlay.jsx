import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/ReActLoopPlay.module.css';

const STEPS = [
  {phase: 'Thought', text: 'Нужно узнать погоду в Москве для пользователя.'},
  {phase: 'Action', text: 'tool: get_weather(city="Москва")'},
  {phase: 'Observation', text: 'API: −5°C, облачно, ветер 3 м/с.'},
  {phase: 'Thought', text: 'Данных достаточно — сформулирую ответ.'},
  {phase: 'Action', text: 'tool: reply_user(message="В Москве −5°C, облачно.")'},
  {phase: 'Observation', text: 'Сообщение доставлено пользователю.'},
];

function ReActLoopPlayInner() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          setAuto(false);
          return s;
        }
        return s + 1;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="ReAct-цикл" subtitle="Thought → Action → Observation">
        <div className={shared.stepList}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={clsx(
                shared.stepCard,
                styles[`phase_${s.phase}`],
                i < step && shared.stepCardDone,
                i === step && shared.stepCardActive,
              )}
            >
              <span className={shared.stepCardNum}>{i + 1}</span>
              <div className={shared.stepCardBody}>
                <span className={shared.stepCardTitle}>{s.phase}</span>
                {i <= step && <p className={shared.stepCardDesc}>{s.text}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className={shared.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step >= STEPS.length - 1}>
            Шаг
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setAuto(true)} disabled={auto || step >= STEPS.length - 1}>
            Авто
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => { setStep(0); setAuto(false); }}>
            С начала
          </button>
        </div>

        <p className={shared.hint}>Оркестратор замыкает цикл до достижения цели пользователя.</p>
      </DemoCard>
    </DemoShell>
  );
}

export default ReActLoopPlayInner;
