import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/NeuroslopDetectorPlay.module.css';

const ROUNDS = [
  {
    snippet: `// TODO: implement proper error handling\nfunction getData() {\n  return fetch('/api').then(r => r.json());\n}`,
    isSlop: true,
    why: 'Пустой TODO, нет обработки ошибок, generic fetch без контекста домена.',
  },
  {
    snippet: `if (!user?.id) throw new AuthError('session_expired');\nconst policy = await policyRepo.forUser(user.id);\nreturn policy.vacationDaysRemaining;`,
    isSlop: false,
    why: 'Конкретные типы ошибок, доменные имена, связь с бизнес-логикой.',
  },
  {
    snippet: `In conclusion, it is important to note that AI will revolutionize everything.\nFurthermore, this comprehensive guide explores the multifaceted landscape.`,
    isSlop: true,
    why: 'SEO-штампы, пустые связки, нет конкретики.',
  },
  {
    snippet: `chunk_size=512 overlap=64 — на golden set recall 0.91 при 12k документов.`,
    isSlop: false,
    why: 'Конкретные параметры и метрика, привязка к задаче.',
  },
];

function NeuroslopDetectorPlayInner() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const r = ROUNDS[round];
  const done = round >= ROUNDS.length;

  const guess = (slop) => {
    if (picked !== null) return;
    if (slop === r.isSlop) setScore((s) => s + 1);
    setPicked(slop);
  };

  const next = () => {
    setRound((n) => n + 1);
    setPicked(null);
  };

  if (done) {
    return (
      <DemoShell className={shared.root}>
        <DemoCard title="Детектор нейрослопа" subtitle="Итог">
          <div className={shared.statGrid}>
            <div className={shared.statBox}>
              <span className={shared.statValue}>{score}</span>
              <span className={shared.statLabel}>из {ROUNDS.length}</span>
            </div>
          </div>
          <div className={shared.controls}>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => { setRound(0); setScore(0); setPicked(null); }}>
              Сначала
            </button>
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Детектор нейрослопа" subtitle={`Раунд ${round + 1} / ${ROUNDS.length}`}>
        <div className={shared.progressTrack}>
          <div className={shared.progressFill} style={{width: `${((round + (picked !== null ? 1 : 0)) / ROUNDS.length) * 100}%`}} />
        </div>

        <pre className={shared.codeBlock}>{r.snippet}</pre>

        <div className={shared.controls}>
          <button type="button" className={clsx('it-demo__btn', shared.choiceBtn)} disabled={picked !== null} onClick={() => guess(true)}>
            Нейрослоп
          </button>
          <button type="button" className={clsx('it-demo__btn', shared.choiceBtn)} disabled={picked !== null} onClick={() => guess(false)}>
            Нормальный контент
          </button>
        </div>

        {picked !== null && (
          <>
            <p className={clsx(picked === r.isSlop ? shared.feedbackOk : shared.feedbackBad)}>
              {picked === r.isSlop ? 'Верно!' : 'Ошибка.'} {r.why}
            </p>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={next}>Далее</button>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default NeuroslopDetectorPlayInner;
