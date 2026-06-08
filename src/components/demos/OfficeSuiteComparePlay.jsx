import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';

const SCENARIOS = [
  {
    id: 'corp',
    label: 'Корпоративный офис',
    need: 'Максимальная совместимость с DOCX/XLSX и Exchange',
    picks: [
      {name: 'Microsoft 365', license: 'Подписка', compat: '★★★★★', note: 'Word, Excel, Teams, SharePoint'},
      {name: 'OnlyOffice + AD', license: 'Self-host / SaaS', compat: '★★★★☆', note: 'Документы на своём сервере'},
    ],
    tip: 'Для Linux-рабочих мест часто ставят OnlyOffice Desktop + веб-редактор на сервере.',
  },
  {
    id: 'foss',
    label: 'Open-source локально',
    need: 'Без подписки, офлайн, открытые форматы ODF',
    picks: [
      {name: 'LibreOffice', license: 'GPL, бесплатно', compat: '★★★★☆', note: 'Writer, Calc, Impress, Base'},
      {name: 'OnlyOffice Desktop', license: 'AGPL / коммерция', compat: '★★★★★', note: 'Лучше открывает сложные DOCX'},
    ],
    tip: 'Сохраняйте эталон в ODF, а заказчику отдавайте экспорт в Office Open XML.',
  },
  {
    id: 'cloud',
    label: 'Совместное редактирование',
    need: 'Несколько авторов в одном документе онлайн',
    picks: [
      {name: 'Google Workspace', license: 'Freemium / бизнес', compat: '★★★☆☆', note: 'Docs, Sheets, Drive'},
      {name: 'Microsoft 365 Online', license: 'Подписка', compat: '★★★★★', note: 'Веб-версии Office'},
      {name: 'CryptPad', license: 'E2E, AGPL', compat: '★★☆☆☆', note: 'Приватность важнее форматов'},
    ],
    tip: 'Облако требует сети; для резервных копий настройте экспорт или sync-клиент.',
  },
  {
    id: 'write',
    label: 'Текст и отчёты (Markdown)',
    need: 'Документация, статьи, экспорт в PDF',
    picks: [
      {name: 'Typora / MarkText', license: 'Редакторы MD', compat: '—', note: 'WYSIWYG Markdown'},
      {name: 'Zettlr', license: 'Открытый', compat: '—', note: 'Цитаты, Zettelkasten, LaTeX'},
      {name: 'VS Code + MPE', license: 'Расширения', compat: '—', note: 'Превью, диаграммы, PDF'},
    ],
    tip: 'Храните исходники в Git — diff по Markdown читаем человеком.',
  },
];

function OfficeSuiteComparePlayInner() {
  const [scenarioId, setScenarioId] = useState('corp');
  const s = SCENARIOS.find((x) => x.id === scenarioId) ?? SCENARIOS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Подбор офисного стека"
        subtitle="Сценарий → рекомендуемые пакеты и ожидаемая совместимость с форматами Microsoft"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, scenarioId === item.id && toolStyles.chipActive)}
              onClick={() => setScenarioId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.lead}>
          <strong>Задача:</strong> {s.need}
        </p>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th>Инструмент</th>
              <th>Лицензия</th>
              <th>Office-совместимость</th>
            </tr>
          </thead>
          <tbody>
            {s.picks.map((p) => (
              <tr key={p.name}>
                <td>
                  <strong>{p.name}</strong>
                  <br />
                  <span style={{fontSize: '0.78rem', color: 'var(--ifm-color-content-secondary)'}}>
                    {p.note}
                  </span>
                </td>
                <td>{p.license}</td>
                <td>{p.compat}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="it-demo__hint" style={{marginTop: '0.65rem', marginBottom: 0}}>
          {s.tip}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OfficeSuiteComparePlayInner;
