import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/TokenizationPlay.module.css';

const PRESETS = [
  {id: 'ru', label: 'Русский', text: 'Привет, ChatGPT!'},
  {id: 'mix', label: 'Subword', text: 'неологизм123 tokenization'},
  {id: 'code', label: 'Код', text: 'getUserById()'},
];

function tokenizeWord(text) {
  return text.split(/(\s+)/).filter(Boolean);
}

function tokenizeChar(text) {
  return [...text];
}

function tokenizeBpe(text) {
  const chunks = [];
  const words = text.split(/\s+/);
  words.forEach((word, wi) => {
    if (wi > 0) chunks.push({t: ' ', type: 'space'});
    if (word.length <= 4) {
      chunks.push({t: word, type: 'word'});
      return;
    }
    let i = 0;
    while (i < word.length) {
      const len = i === 0 && word.length > 6 ? 3 : word.length - i <= 4 ? word.length - i : 4;
      chunks.push({t: word.slice(i, i + len), type: 'sub'});
      i += len;
    }
  });
  return chunks;
}

function TokenizationPlayInner() {
  const [text, setText] = useState(PRESETS[0].text);
  const [mode, setMode] = useState('bpe');

  const tokens = useMemo(() => {
    if (mode === 'word') return tokenizeWord(text).map((t) => ({t, type: /\s/.test(t) ? 'space' : 'word'}));
    if (mode === 'char') return tokenizeChar(text).map((t) => ({t, type: 'char'}));
    return tokenizeBpe(text);
  }, [text, mode]);

  const count = tokens.filter((t) => t.t.trim()).length;

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Токенизация текста" subtitle="Word, character и subword (BPE) — как LLM режет строку">
        <div className={shared.stack}>
          <div className={shared.chipRow}>
            {PRESETS.map((p) => (
              <button key={p.id} type="button" className={shared.chip} onClick={() => setText(p.text)}>
                {p.label}
              </button>
            ))}
          </div>

          <input
            className={shared.input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Текст для токенизации"
            placeholder="Введите фразу…"
          />

          <div className={shared.chipRowScroll}>
            {['word', 'char', 'bpe'].map((m) => (
              <button
                key={m}
                type="button"
                className={clsx(shared.chip, mode === m && shared.chipActive)}
                onClick={() => setMode(m)}
              >
                {m === 'word' ? 'Word' : m === 'char' ? 'Character' : 'Subword (BPE)'}
              </button>
            ))}
          </div>

          <div className={styles.tokenArea}>
            {tokens.length === 0 ? (
              <span className={styles.empty}>Пустая строка</span>
            ) : (
              tokens.map((tok, i) => (
                <span key={`${i}-${tok.t}`} className={clsx(styles.token, styles[`type_${tok.type}`])}>
                  {tok.t === ' ' ? '␣' : tok.t}
                </span>
              ))
            )}
          </div>

          <div className={shared.statGrid}>
            <div className={shared.statBox}>
              <span className={shared.statValue}>{count}</span>
              <span className={shared.statLabel}>токенов (оценка)</span>
            </div>
            <div className={shared.statBox}>
              <span className={shared.statValue}>{text.length}</span>
              <span className={shared.statLabel}>символов</span>
            </div>
          </div>
        </div>

        <p className={shared.hint}>
          LLM используют <strong>subword</strong>: редкие слова дробятся, частые остаются целыми — экономия словаря.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TokenizationPlayInner;
