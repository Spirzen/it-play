import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/WebPageLayersPlay.module.css';

const LESSONS = [
  {
    layers: {html: true, css: false, js: false},
    hint: 'Только HTML: браузер показывает "голую" разметку — без цветов и без реакции на кнопку.',
  },
  {
    layers: {html: true, css: true, js: false},
    hint: 'Добавили CSS: страница стала аккуратной, но кнопка пока ничего не делает.',
  },
  {
    layers: {html: true, css: true, js: true},
    hint: 'JavaScript считает клики — поведение появилось поверх структуры и стилей.',
  },
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildDocument(name, layers) {
  const safeName = escapeHtml(name.trim() || 'Гость');
  const htmlPart = layers.html
    ? `<h1 id="title">Привет, ${safeName}!</h1>
<p class="lead">Это учебная страница. Нажми кнопку — если включён JavaScript, счётчик заработает.</p>
<button type="button" id="btn">Счёт: 0</button>`
    : '<p style="padding:1rem;color:#888">Включите слой HTML</p>';

  const cssPart = layers.css
    ? `body{font-family:system-ui,sans-serif;margin:0;padding:1.25rem;background:linear-gradient(135deg,#f0f4ff,#fff);}
#title{color:#264de4;margin:0 0 0.5rem;}
.lead{color:#444;line-height:1.5;}
#btn{margin-top:1rem;padding:0.55rem 1.1rem;font-size:1rem;border:0;border-radius:8px;background:#264de4;color:#fff;cursor:pointer;}
#btn:hover{background:#1a3aa8;}`
    : '';

  const jsPart = layers.js
    ? `(function(){
  var n=0,btn=document.getElementById('btn');
  if(!btn)return;
  btn.addEventListener('click',function(){
    n++;
    btn.textContent='Счёт: '+n;
    if(n>=3) btn.style.background='#e44d26';
  });
})();`
    : '';

  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><style>${cssPart}</style></head><body>${htmlPart}<script>${jsPart}<\/script></body></html>`;
}

function snippetHtml(name) {
  const n = escapeHtml(name.trim() || 'Гость');
  return `<h1>Привет, ${n}!</h1>\n<p>…</p>\n<button id="btn">Счёт: 0</button>`;
}

function snippetCss() {
  return `body { font-family: system-ui; }\n#title { color: #264de4; }\n#btn { background: #264de4; color: #fff; }`;
}

function snippetJs() {
  return `btn.addEventListener('click', () => {\n  n++;\n  btn.textContent = 'Счёт: ' + n;\n});`;
}

export function WebPageLayersPlayInner({compact = false, embedded = false}) {
  const [name, setName] = useState('Аня');
  const [layers, setLayers] = useState({html: true, css: true, js: true});
  const [lessonIdx, setLessonIdx] = useState(2);

  const applyLesson = (idx) => {
    const L = LESSONS[idx];
    if (!L) return;
    setLessonIdx(idx);
    setLayers(L.layers);
  };

  const toggleLayer = (key) => {
    setLayers((prev) => {
      const next = {...prev, [key]: !prev[key]};
      if (!next.html) return {html: true, css: next.css, js: next.js};
      return next;
    });
    setLessonIdx(-1);
  };

  const previewDoc = useMemo(() => buildDocument(name, layers), [name, layers]);

  const activeHint =
    lessonIdx >= 0 ? LESSONS[lessonIdx]?.hint : 'Включайте и выключайте слои — смотрите, что меняется в коде и в превью.';

  const body = (
    <>
        <div className={styles.toolbar}>
          <label className={styles.nameField}>
            Имя на странице:
            <input
              type="text"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              aria-label="Имя на странице"
            />
          </label>
          <div className={styles.layers} role="group" aria-label="Слои страницы">
            <button
              type="button"
              className={clsx(styles.layerBtn, styles.layerBtnHtml, layers.html && styles.layerBtnOn)}
              onClick={() => toggleLayer('html')}
              aria-pressed={layers.html}
            >
              HTML
            </button>
            <button
              type="button"
              className={clsx(styles.layerBtn, styles.layerBtnCss, layers.css && styles.layerBtnOn)}
              onClick={() => toggleLayer('css')}
              disabled={!layers.html}
              aria-pressed={layers.css}
            >
              CSS
            </button>
            <button
              type="button"
              className={clsx(styles.layerBtn, styles.layerBtnJs, layers.js && styles.layerBtnOn)}
              onClick={() => toggleLayer('js')}
              disabled={!layers.html}
              aria-pressed={layers.js}
            >
              JavaScript
            </button>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.codePanel} aria-label="Фрагменты кода">
            <pre className={clsx(styles.codeBlock, styles.codeHtml, !layers.html && styles.codeMuted)}>
              {layers.html ? snippetHtml(name) : '/* HTML выключен */'}
            </pre>
            <pre className={clsx(styles.codeBlock, styles.codeCss, !layers.css && styles.codeMuted)}>
              {layers.css ? snippetCss() : '/* CSS выключен */'}
            </pre>
            <pre className={clsx(styles.codeBlock, styles.codeJs, !layers.js && styles.codeMuted)}>
              {layers.js ? snippetJs() : '/* JS выключен */'}
            </pre>
          </div>
          <div className={styles.previewWrap}>
            <iframe
              className={styles.previewFrame}
              title="Превью учебной страницы"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={previewDoc}
            />
          </div>
        </div>

        <p className={styles.hint}>{activeHint}</p>

        {!compact && (
          <div className={styles.lessonBar}>
            <span className="it-demo__label">По порядку:</span>
            {LESSONS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={clsx(
                  'it-demo__btn it-demo__btn--sm',
                  lessonIdx === i ? styles.lessonStepActive : 'it-demo__btn--secondary',
                )}
                onClick={() => applyLesson(i)}
              >
                Шаг {i + 1}
              </button>
            ))}
          </div>
        )}
    </>
  );

  if (embedded) {
    return <div className={styles.root}>{body}</div>;
  }

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={compact ? 'Слои веб-страницы' : 'HTML, CSS и JavaScript — три слоя одной страницы'}
        subtitle="Структура → оформление → поведение"
      >
        {body}
      </DemoCard>
    </DemoShell>
  );
}

export default WebPageLayersPlayInner;
