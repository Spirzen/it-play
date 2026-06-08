import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const STACKS = {
  swift: {
    label: 'Swift SDK для Android',
    status: 'Preview / nightly',
    ui: 'Нативный UI (Kotlin/Java + Swift-модули)',
    shared: 'Бизнес-логика на Swift через swift-java interop',
    ecosystem: '~25% пакетов SwiftPM на Android',
    link: 'https://www.swift.org/blog/nightly-swift-sdk-for-android/',
    pros: ['Общий Swift с iOS/macOS', 'LLVM + NDK', 'Поэтапное внедрение в legacy'],
    cons: ['Ранняя стадия', 'Слабее интеграция с Android Studio', 'Меньше готовых гайдов'],
  },
  kmp: {
    label: 'Kotlin Multiplatform',
    status: 'Официальный курс Google',
    ui: 'Нативный UI: Compose / SwiftUI',
    shared: 'commonMain: модели, сеть, use cases (expect/actual)',
    ecosystem: 'Gradle, KMP в Android Studio, CocoaPods/Xcode',
    link: 'https://developer.android.com/courses/pathways/kotlin-multiplatform',
    pros: ['Поддержка Google и JetBrains', 'Зрелый Android-стек', 'Официальный pathway'],
    cons: ['iOS-тулчейн сложнее', 'Не "один UI на всех"', 'Кривая обучения Gradle KMP'],
  },
};

const LAYERS = [
  {id: 'ui', label: 'UI слой', swift: 'Android Views / Compose', kmp: 'Compose (Android) · SwiftUI (iOS)'},
  {id: 'logic', label: 'Общая логика', swift: 'Swift modules + swift-java', kmp: 'commonMain (Kotlin)'},
  {id: 'platform', label: 'Платформа', swift: 'NDK / JNI bridge', kmp: 'expect / actual'},
];

function CrossPlatformMobilePlayInner() {
  const [stack, setStack] = useState('kmp');
  const [layer, setLayer] = useState('logic');
  const data = STACKS[stack];
  const layerRow = LAYERS.find((l) => l.id === layer) ?? LAYERS[1];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Кроссплатформа: Swift на Android vs KMP"
        subtitle="Сравните подходы — оба сохраняют нативный UI, но по-разному делят код"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {Object.entries(STACKS).map(([id, s]) => (
            <button
              key={id}
              type="button"
              className={clsx(toolStyles.chip, stack === id && toolStyles.chipActive)}
              onClick={() => setStack(id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.detail} style={{marginBottom: '0.65rem'}}>
          <h4 className={styles.detailTitle}>{data.label}</h4>
          <p className={styles.detailRole}>Статус: {data.status}</p>
          <p><strong>UI:</strong> {data.ui}</p>
          <p><strong>Общий код:</strong> {data.shared}</p>
          <p><strong>Экосистема:</strong> {data.ecosystem}</p>
        </div>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(toolStyles.chip, layer === l.id && toolStyles.chipActive)}
              onClick={() => setLayer(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className={styles.mono} style={{fontSize: '0.82rem', margin: '0 0 0.65rem'}}>
          {layerRow.label}: {layerRow[stack]}
        </p>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem'}}>
          <div>
            <strong>Плюсы</strong>
            <ul style={{margin: '0.25rem 0 0', paddingLeft: '1.1rem'}}>
              {data.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Минусы</strong>
            <ul style={{margin: '0.25rem 0 0', paddingLeft: '1.1rem'}}>
              {data.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="it-demo__btn it-demo__btn--primary"
          style={{display: 'inline-block', marginTop: '0.65rem', textDecoration: 'none'}}
        >
          Официальный анонс / курс ↗
        </a>
      </DemoCard>
    </DemoShell>
  );
}

export default CrossPlatformMobilePlayInner;
