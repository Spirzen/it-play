import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, QuizPanel, StatusPill} from '@/components/shared/infra/InfraPlayUi';
import {BOUNTY_SCOPE} from '@/components/shared/kb/infraSecurityEngines';

function BugBountyScopeQuizPlayInner() {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const item = BOUNTY_SCOPE[idx];

  const answer = (inScope) => {
    const ok = inScope === item.inScope;
    setFeedback({ok, text: ok ? `Верно: ${item.reason}` : `Неверно. ${item.reason}`});
  };

  return (
    <DemoShell>
      <DemoCard title="Bug Bounty — in scope?" subtitle="Проверьте target перед тестом — out of scope = риск для вас">
        <InfraRoot>
          <QuizPanel
            feedback={feedback?.text}
            feedbackOk={feedback?.ok}
            actions={<>
              <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => answer(true)}>In scope</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => answer(false)}>Out of scope</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => { setIdx((i) => (i + 1) % BOUNTY_SCOPE.length); setFeedback(null); }}>Следующий</button>
            </>}
          >
            <StatusPill tone="neutral">{item.target}</StatusPill>
          </QuizPanel>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default BugBountyScopeQuizPlayInner;
