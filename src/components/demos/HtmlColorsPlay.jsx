import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ALL_HTML_COLORS,
  HTML_COLOR_GROUPS,
  buildQuizRound,
  colorLabel,
  contrastText,
  filterColors,
  formatRgb,
  formatRgbCss,
  shuffle,
} from '@/components/shared/kb/htmlColorsEngine';
import styles from '@/components/demos/HtmlColorsPlay.module.css';

const MODES = [
  {id: 'catalog', label: 'Справочник'},
  {id: 'quiz', label: 'Тренажёр'},
  {id: 'cards', label: 'Карточки'},
];

const QUIZ_MODES = [
  {id: 'name', label: 'Имя', prompt: 'Как называется этот HTML-цвет?'},
  {id: 'hex', label: 'HEX', prompt: 'Какой HEX-код у этого цвета?'},
  {id: 'rgb', label: 'RGB', prompt: 'Какое RGB-значение у этого цвета?'},
];

function ColorSwatch({color, size = 'md', onClick, selected, showLabel}) {
  const textColor = contrastText(color.hex);
  return (
    <button
      type="button"
      className={clsx(styles.swatch, styles[`swatch--${size}`], selected && styles.swatchSelected)}
      style={{backgroundColor: color.hex, color: textColor}}
      onClick={onClick}
      title={colorLabel(color)}
      aria-label={colorLabel(color)}
    >
      {showLabel && <span className={styles.swatchLabel}>{color.name}</span>}
    </button>
  );
}

function CssPreview({color}) {
  return (
    <div className={styles.cssPreview}>
      <p className="it-demo__label">Примеры в CSS</p>
      <pre className={styles.codeBlock}>
        <code>{`color: ${color.name};`}</code>
        {'\n'}
        <code>{`background: ${color.hex};`}</code>
        {'\n'}
        <code>{`border-color: ${formatRgbCss(color)};`}</code>
      </pre>
      <div className={styles.cssDemo} style={{borderColor: color.hex}}>
        <span style={{color: color.hex}}>Текст {color.name}</span>
        <span className={styles.cssDemoBtn} style={{backgroundColor: color.hex, color: contrastText(color.hex)}}>
          Кнопка
        </span>
      </div>
    </div>
  );
}

function CatalogPanel() {
  const [groupId, setGroupId] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(ALL_HTML_COLORS[0]);

  const filtered = useMemo(() => filterColors(query, groupId), [query, groupId]);

  return (
    <>
      <div className={styles.toolbar}>
        <input
          className="it-demo__input"
          placeholder="Поиск по имени, HEX или RGB…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className={styles.chips}>
        <button
          type="button"
          className={clsx(styles.chip, groupId === 'all' && styles.chipActive)}
          onClick={() => setGroupId('all')}
        >
          Все ({ALL_HTML_COLORS.length})
        </button>
        {HTML_COLOR_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={clsx(styles.chip, groupId === g.id && styles.chipActive)}
            onClick={() => setGroupId(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className={styles.catalogGrid}>
        {filtered.map((color) => (
          <ColorSwatch
            key={color.name}
            color={color}
            size="sm"
            selected={selected?.name === color.name}
            onClick={() => setSelected(color)}
          />
        ))}
      </div>
      {filtered.length === 0 && <p className="it-demo__hint">Ничего не найдено — попробуйте другой запрос.</p>}
      {selected && (
        <div className={styles.detail}>
          <div className={styles.detailSwatch} style={{backgroundColor: selected.hex}} aria-hidden />
          <div className={styles.detailMeta}>
            <h5 className={styles.detailName}>{colorLabel(selected)}</h5>
            <p className={styles.detailGroup}>{selected.groupLabel}</p>
            <dl className={styles.detailCodes}>
              <div>
                <dt>HEX</dt>
                <dd><code>{selected.hex.toUpperCase()}</code></dd>
              </div>
              <div>
                <dt>RGB</dt>
                <dd><code>{formatRgbCss(selected)}</code></dd>
              </div>
              <div>
                <dt>Десятичный</dt>
                <dd><code>{formatRgb(selected)}</code></dd>
              </div>
            </dl>
            <CssPreview color={selected} />
          </div>
        </div>
      )}
    </>
  );
}

function QuizPanel() {
  const [quizMode, setQuizMode] = useState('name');
  const [round, setRound] = useState(() => buildQuizRound('name'));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = round[idx];
  const modeMeta = QUIZ_MODES.find((m) => m.id === quizMode);

  const restart = useCallback(
    (mode = quizMode) => {
      setQuizMode(mode);
      setRound(buildQuizRound(mode));
      setIdx(0);
      setPicked(null);
      setScore(0);
      setFinished(false);
    },
    [quizMode],
  );

  if (finished) {
    return (
      <div className={styles.quizResult}>
        <p className={styles.resultScore}>
          Результат: <strong>{score}</strong> из {round.length}
        </p>
        <p className="it-demo__hint">
          {score === round.length
            ? 'Отлично! Вы уверенно читаете HTML-цвета.'
            : score >= round.length * 0.7
              ? 'Хорошо — повторите карточки для закрепления.'
              : 'Попробуйте справочник: сначала группы похожих оттенков, потом тренажёр снова.'}
        </p>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => restart()}>
          Новый раунд
        </button>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  const choose = (option) => {
    if (picked) return;
    setPicked(option.id);
    if (option.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= round.length) {
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  return (
    <>
      <div className={styles.chips}>
        {QUIZ_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(styles.chip, quizMode === m.id && styles.chipActive)}
            onClick={() => restart(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className={styles.quizProgress}>
        Вопрос {idx + 1} / {round.length} · верно: {score}
      </p>
      <p className={styles.quizPrompt}>{modeMeta?.prompt}</p>
      <div className={styles.quizSwatch} style={{backgroundColor: question.color.hex}} aria-hidden />
      <div className={styles.choices}>
        {question.options.map((opt) => {
          const isPicked = picked === opt.id;
          const showOk = picked && opt.correct;
          const showBad = picked && isPicked && !opt.correct;
          return (
            <button
              key={opt.id}
              type="button"
              className={clsx(
                styles.choice,
                showOk && styles.choiceOk,
                showBad && styles.choiceBad,
                picked && !isPicked && !opt.correct && styles.choiceDim,
              )}
              onClick={() => choose(opt)}
              disabled={!!picked}
            >
              <code>{opt.label}</code>
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={styles.quizFeedback}>
          <p>
            {question.color.name} — <code>{question.color.hex.toUpperCase()}</code>,{' '}
            <code>{formatRgbCss(question.color)}</code>
          </p>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={next}>
            {idx + 1 >= round.length ? 'Итог' : 'Далее'}
          </button>
        </div>
      )}
    </>
  );
}

function CardsPanel() {
  const [deck, setDeck] = useState(() => shuffle(ALL_HTML_COLORS));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck[idx];

  const go = (nextIdx) => {
    setIdx(nextIdx);
    setFlipped(false);
  };

  const reshuffle = () => {
    setDeck(shuffle(ALL_HTML_COLORS));
    setIdx(0);
    setFlipped(false);
  };

  if (!card) return null;

  return (
    <>
      <p className={styles.quizProgress}>
        Карточка {idx + 1} / {deck.length}
      </p>
      <button
        type="button"
        className={clsx(styles.flashcard, flipped && styles.flashcardFlipped)}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
      >
        <div className={styles.flashcardFace} style={{backgroundColor: card.hex}}>
          {!flipped && <span className={styles.flashcardHint}>Нажмите, чтобы перевернуть</span>}
        </div>
        <div className={styles.flashcardBack}>
          <strong>{colorLabel(card)}</strong>
          <code>{card.hex.toUpperCase()}</code>
          <code>{formatRgbCss(card)}</code>
          <span className={styles.detailGroup}>{card.groupLabel}</span>
        </div>
      </button>
      <div className={styles.cardNav}>
        <button
          type="button"
          className="it-demo__btn"
          disabled={idx === 0}
          onClick={() => go(idx - 1)}
        >
          ← Назад
        </button>
        <button type="button" className="it-demo__btn" onClick={reshuffle}>
          Перемешать
        </button>
        <button
          type="button"
          className="it-demo__btn"
          disabled={idx >= deck.length - 1}
          onClick={() => go(idx + 1)}
        >
          Вперёд →
        </button>
      </div>
    </>
  );
}

function HtmlColorsPlayInner() {
  const [mode, setMode] = useState('catalog');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="HTML-цвета: справочник и тренажёр"
        subtitle={`${ALL_HTML_COLORS.length} именованных цветов W3C — имена, HEX, RGB и визуальные примеры`}
      >
        <div className="it-demo__tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx('it-demo__tab', mode === m.id && 'it-demo__tab--active')}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'catalog' && <CatalogPanel />}
        {mode === 'quiz' && <QuizPanel />}
        {mode === 'cards' && <CardsPanel />}

        <p className="it-demo__hint" style={{marginTop: '0.75rem'}}>
          Имена в HTML/CSS не чувствительны к регистру: <code>red</code> = <code>Red</code>.
          Некоторые синонимы (Gray/Grey, Aqua/Cyan) указывают на один HEX.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default HtmlColorsPlayInner;
