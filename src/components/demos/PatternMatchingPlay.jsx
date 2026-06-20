import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpBadge,
  LpChip,
  LpChipRow,
  LpCode,
  LpPanel,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const CASES = {
  ts: [
    {input: '1', match: 'case 1', result: 'one'},
    {input: '"ok"', match: 'case "ok"', result: 'status ok'},
  ],
  kotlin: [
    {input: '1', match: '1 ->', result: 'one'},
    {input: '42', match: 'is Int ->', result: 'number branch'},
  ],
  rust: [
    {input: '1', match: '1 =>', result: 'one'},
    {input: '_', match: '_ =>', result: 'wildcard'},
  ],
};

const LANG_LABELS = {ts: 'TypeScript', kotlin: 'Kotlin', rust: 'Rust'};

function codeFor(l) {
  if (l === 'ts')
    return `switch (value) {
  case 1: return "one";
  case "ok": return "status ok";
  default: const _x: never = value;
}`;
  if (l === 'kotlin')
    return `when (value) {
  1 -> "one"
  is Int -> "number branch"
  else -> "other"
}`;
  return `match value {
  1 => "one",
  _ => "wildcard",
}`;
}

function PatternMatchingPlayInner() {
  const [lang, setLang] = useState('ts');
  const options = CASES[lang];
  const [input, setInput] = useState(options[0].input);
  const c = options.find((x) => x.input === input) ?? options[0];

  const switchLang = (l) => {
    setLang(l);
    setInput(CASES[l][0].input);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Pattern matching" subtitle="switch / when / match — exhaustiveness и сужение типа">
        <LpStack>
          <LpChipRow>
            {Object.keys(LANG_LABELS).map((l) => (
              <LpChip key={l} active={lang === l} onClick={() => switchLang(l)}>
                {LANG_LABELS[l]}
              </LpChip>
            ))}
          </LpChipRow>

          <LpCode>{codeFor(lang)}</LpCode>

          <LpSection label="value =">
            <LpChipRow>
              {options.map((x) => (
                <LpChip key={x.input} active={input === x.input} onClick={() => setInput(x.input)}>
                  {x.input}
                </LpChip>
              ))}
            </LpChipRow>
          </LpSection>

          <LpPanel>
            <p className={styles.panelBody}>
              Совпала ветка: <code>{c.match}</code>
            </p>
            <p className={clsx(styles.panelBody, styles.spacedTopSm)}>
              Результат: <strong>{c.result}</strong>
            </p>
            {lang === 'ts' && (
              <LpBadge variant="ok" className={styles.spacedTopMd}>
                default: never — union исчерпан
              </LpBadge>
            )}
          </LpPanel>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default PatternMatchingPlayInner;
