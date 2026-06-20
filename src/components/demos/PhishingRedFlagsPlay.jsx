import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, QuizPanel, Section} from '@/components/shared/infra/InfraPlayUi';
import {PHISHING_EMAILS} from '@/components/shared/kb/infraSecurityEngines';

function PhishingRedFlagsPlayInner() {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const email = PHISHING_EMAILS[idx];

  const check = (isPhish) => {
    const ok = isPhish === !email.safe;
    setFeedback({ok, text: ok ? `Верно. Flags: ${email.flags.join(', ') || 'корпоративный домен OK'}` : `Неверно. Подсказка: ${email.flags.join(', ') || 'легитимный отправитель'}`});
  };

  return (
    <DemoShell>
      <DemoCard title="Фишинг — red flags" subtitle="Учебные письма без реальных ссылок — тренируйте внимание команды">
        <InfraRoot>
          <QuizPanel
            feedback={feedback?.text}
            feedbackOk={feedback?.ok}
            actions={<>
              <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => check(true)}>Фишинг</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => check(false)}>Легитимно</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => { setIdx((i) => (i + 1) % PHISHING_EMAILS.length); setFeedback(null); }}>Следующее</button>
            </>}
          >
            <Section label="From"><strong>{email.from}</strong></Section>
            <Section label="Subject">{email.subject}</Section>
          </QuizPanel>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PhishingRedFlagsPlayInner;
