import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectStoryCard,
  ProjectPokerDeck,
  ProjectTeamVotes,
  ProjectPanel,
  ProjectBtnRow,
} from '@/components/shared/kb/projectPlayKit';

const DECK = [1, 2, 3, 5, 8, 13, 21];
const STORIES = [
  {
    id: 's1',
    title: 'Как пользователь, хочу сбросить пароль по email',
    hint: 'Интеграция с почтой, токены, UI — средняя сложность.',
    team: [5, 8, 5, 13],
  },
  {
    id: 's2',
    title: 'Экспорт отчёта в Excel за выбранный период',
    hint: 'Генерация файла, фильтры, права доступа.',
    team: [3, 5, 5, 8],
  },
  {
    id: 's3',
    title: 'Интеграция с ЕСИА для входа граждан',
    hint: 'Внешний контур, сертификаты, нестандартные ошибки.',
    team: [13, 21, 8, 13],
  },
];

const MEMBERS = ['Аналитик', 'Dev A', 'Dev B', 'QA'];

function PlanningPokerPlayInner() {
  const [storyIdx, setStoryIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const story = STORIES[storyIdx];
  const spread = useMemo(() => {
    if (!revealed) return 0;
    const vals = story.team;
    return Math.max(...vals) - Math.min(...vals);
  }, [revealed, story.team]);

  const reveal = () => {
    if (pick === null) return;
    setRevealed(true);
  };

  const nextStory = () => {
    setStoryIdx((i) => (i + 1) % STORIES.length);
    setPick(null);
    setRevealed(false);
  };

  const consensus = Math.round(story.team.reduce((a, b) => a + b, 0) / story.team.length);

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Planning Poker" subtitle="Относительные оценки в story points">
        <ProjectStack>
          <ProjectStoryCard title={story.title} hint={story.hint} />

          <p className="it-demo__label">Ваша оценка</p>
          <ProjectPokerDeck deck={DECK} selected={pick} revealed={revealed} onSelect={setPick} />

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reveal} disabled={pick === null || revealed}>
              Reveal
            </button>
            <button type="button" className="it-demo__btn" onClick={nextStory}>
              Следующая story
            </button>
          </ProjectBtnRow>

          {revealed && (
            <>
              <p className="it-demo__label">Оценки команды</p>
              <ProjectTeamVotes members={MEMBERS} votes={story.team} userPick={pick} />
              <ProjectPanel>
                {spread >= 8 ? (
                  <p>
                    <strong>Большой разброс ({spread})</strong> — обсудите неопределённость, AC и риски перед финальной оценкой.
                  </p>
                ) : spread >= 3 ? (
                  <p>
                    <strong>Умеренный разброс</strong> — уточните граничные случаи; консенсус часто около {consensus}.
                  </p>
                ) : (
                  <p>
                    <strong>Консенсус</strong> — команда согласна, можно брать в спринт.
                  </p>
                )}
              </ProjectPanel>
            </>
          )}
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default PlanningPokerPlayInner;
