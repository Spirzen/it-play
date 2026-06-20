import React, {useState} from 'react';
import {
  ChipRow,
  Hint,
  PlayRoot,
  Section,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const OUTLINE = {
  bad: ['div (banner)', 'div (content)', 'div (nav)', 'div (footer)'],
  good: ['header [banner]', 'main [main]', 'nav [navigation]', 'footer [contentinfo]'],
};

export default function A11yLandmarksPlay() {
  const [mode, setMode] = useState('bad');

  return (
    <PlayRoot title="A11y — landmarks" subtitle="Семантика vs div-soup — outline для screen reader">
      <ChipRow
        value={mode}
        onChange={setMode}
        options={[
          {id: 'bad', label: 'div-only'},
          {id: 'good', label: 'Semantic HTML'},
        ]}
      />
      <Section title="Accessibility outline">
        <ul className={styles.listPlain}>
          {OUTLINE[mode].map((item) => (
            <li key={item}>
              <code>{item}</code>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Preview">
        <div className={styles.previewFrame}>
          {mode === 'good' ? (
            <article className={styles.previewCard}>
              <header>Site header</header>
              <main className={styles.previewMain}>Main content</main>
              <nav>Navigation</nav>
              <footer>Footer</footer>
            </article>
          ) : (
            <div className={styles.previewCard}>
              <div>Site header</div>
              <div className={styles.previewMain}>Main content</div>
              <div>Navigation</div>
              <div>Footer</div>
            </div>
          )}
        </div>
      </Section>
      <Hint>
        Landmarks (<code>main</code>, <code>nav</code>, <code>header</code>) дают быструю навигацию в screen reader.
      </Hint>
    </PlayRoot>
  );
}
