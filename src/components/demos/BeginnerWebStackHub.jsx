import React, {useState} from 'react';
import Link from '@/components/shared/KbLink';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {TEACHING_PATH, WEB_STACK_LANGUAGES} from '@/components/shared/kb/beginnerWebStackData';
import {CodeRunPlacePlayInner} from '@/components/demos/CodeRunPlacePlay';
import {SyntaxComparePlayInner} from '@/components/demos/SyntaxComparePlay';
import {WebPageLayersPlayInner} from '@/components/demos/WebPageLayersPlay';
import FirstProgramPlayInner from '@/components/demos/FirstProgramPlay';
import styles from '@/components/demos/BeginnerWebStackHub.module.css';

const TABS = [{id: 'overview', label: 'Обзор', icon: '🗺️'}, ...WEB_STACK_LANGUAGES.map((l) => ({
  id: l.id,
  label: l.label,
  icon: l.icon,
}))];

function runBadge(runsOn) {
  if (runsOn === 'client') return [styles.badge, styles.badgeClient, 'В браузере'];
  if (runsOn === 'server') return [styles.badge, styles.badgeServer, 'На сервере'];
  return [styles.badge, styles.badgeBoth, 'Браузер и сервер'];
}

function LanguagePanel({lang, showFirstProgram}) {
  const [badgeCls, , badgeText] = runBadge(lang.runsOn);

  return (
    <div className={styles.langCard} style={{'--lang-accent': lang.color}}>
      <div className={styles.langHero}>
        <h4 className={styles.langTitle}>
          <span aria-hidden>{lang.icon}</span> {lang.label}
        </h4>
        <span className={badgeCls}>{badgeText}</span>
        <span className={styles.badge}>{lang.where}</span>
      </div>

      <div className={styles.grid2}>
        <div className={styles.block}>
          <h5>За что отвечает</h5>
          <p>{lang.role}</p>
        </div>
        <div className={styles.block}>
          <h5>Образ для детей</h5>
          <p>{lang.metaphor}</p>
        </div>
      </div>

      <div className={styles.block}>
        <h5>Первая строка · файл {lang.fileExt}</h5>
        <pre>{lang.firstLine}</pre>
      </div>

      <div className={styles.block}>
        <h5>Частые путаницы</h5>
        <ul className={styles.pitfalls}>
          {lang.pitfalls.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className={styles.links}>
        <Link to={lang.articlePath}>Статья в энциклопедии →</Link>
      </div>

      {showFirstProgram && lang.firstProgramLang && (
        <div className={styles.embed}>
          <FirstProgramPlayInner language={lang.firstProgramLang} />
        </div>
      )}
    </div>
  );
}

function OverviewPanel({audience}) {
  return (
    <>
      <p className={styles.overviewIntro}>
        {audience === 'kids'
          ? 'Веб-сайт — как слоёный пирог: сначала каркас (HTML), потом краска (CSS), потом "оживление" кнопок (JavaScript). Python и PHP обычно работают на сервере — в браузер попадает только результат.'
          : 'Последовательность изучения: разметка → стили → клиентский JS → серверный Python или PHP.'}
      </p>

      <div className={styles.path} aria-label="Рекомендуемый порядок">
        {TEACHING_PATH.map((p, i) => (
          <React.Fragment key={p.step}>
            {i > 0 && <span className={styles.pathArrow} aria-hidden>→</span>}
            <span className={styles.pathStep}>
              {p.step}. {p.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Язык</th>
            <th>Где выполняется</th>
            <th>Исходник в браузере</th>
          </tr>
        </thead>
        <tbody>
          {WEB_STACK_LANGUAGES.map((l) => (
            <tr key={l.id}>
              <td>
                {l.icon} {l.label}
              </td>
              <td>{l.where}</td>
              <td>{l.runsOn === 'server' ? 'Нет (только HTML/JSON)' : l.runsOn === 'client' ? 'Да (DevTools)' : 'JS — да; Node — на сервере'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="it-demo__label">Слои страницы (HTML → CSS → JS)</h5>
      <div className={styles.embed}>
        <WebPageLayersPlayInner compact embedded />
      </div>
      <h5 className="it-demo__label">Где выполняется код</h5>
      <div className={styles.embed}>
        <CodeRunPlacePlayInner embedded />
      </div>
      <h5 className="it-demo__label">Сравнение синтаксиса</h5>
      <div className={styles.embed}>
        <SyntaxComparePlayInner compact embedded />
      </div>
    </>
  );
}

function BeginnerWebStackHubInner({
  defaultTab = 'overview',
  audience = 'teacher',
  showFirstProgram = false,
}) {
  const [active, setActive] = useState(
    TABS.some((t) => t.id === defaultTab) ? defaultTab : 'overview',
  );

  const lang = WEB_STACK_LANGUAGES.find((l) => l.id === active);

  return (
    <DemoShell>
      <DemoCard
        title="Языки для начинающих: HTML, CSS, JS, Python, PHP"
        subtitle="Роли языков, типичные ошибки и связанные демонстрации"
      >
        <div className={styles.tabs} role="tablist" aria-label="Языки">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={clsx(styles.tab, active === t.id && styles.tabActive)}
              onClick={() => setActive(t.id)}
            >
              <span aria-hidden>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {active === 'overview' ? (
          <OverviewPanel audience={audience} />
        ) : lang ? (
          <LanguagePanel lang={lang} showFirstProgram={showFirstProgram} />
        ) : null}

      </DemoCard>
    </DemoShell>
  );
}

export default BeginnerWebStackHubInner;
