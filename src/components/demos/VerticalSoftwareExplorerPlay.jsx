import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/VerticalSoftwareExplorerPlay.module.css';

const INDUSTRIES = [
  {
    id: 'finance',
    label: 'Финансы',
    examples: ['Core Banking', 'Торговые терминалы', 'AML/KYC'],
    tasks: ['Расчёт деривативов', 'Платёжные рельсы', 'Регуляторная отчётность'],
    norms: 'Basel III, PCI DSS, двойная запись',
  },
  {
    id: 'health',
    label: 'Медицина',
    examples: ['HIS/EMR', 'PACS', 'Лабораторные LIS'],
    tasks: ['Клинические протоколы', 'Диагностика', 'Медучёт'],
    norms: 'HIPAA, ФЗ-152, коды МКБ',
  },
  {
    id: 'logistics',
    label: 'Логистика',
    examples: ['TMS', 'WMS', 'GDS (авиа)'],
    tasks: ['Маршрутизация', 'Трекинг грузов', 'Слоты складов'],
    norms: 'EDI, INCOTERMS, SLA перевозчика',
  },
  {
    id: 'energy',
    label: 'Энергетика',
    examples: ['SCADA', 'EMS', 'Цифровой двойник'],
    tasks: ['Диспетчеризация', 'Прогноз нагрузки', 'Аварийные сценарии'],
    norms: 'IEC 61850, OT-безопасность',
  },
  {
    id: 'retail',
    label: 'Ритейл',
    examples: ['POS', 'OMS', 'SAP Retail'],
    tasks: ['Остатки', 'Ценообразование', 'Омниканал'],
    norms: 'Фискализация, маркировка, GDPR',
  },
  {
    id: 'cad',
    label: 'Инжиниринг',
    examples: ['AutoCAD', 'SolidWorks', 'ANSYS'],
    tasks: ['Чертежи', 'FEM-расчёт', 'PLM'],
    norms: 'ГОСТ/ISO, версии сборок, BOM',
  },
];

const LOAD_TYPES = [
  {id: 'ops', label: 'Операции', hint: 'OMS, MES, учёт в реальном времени'},
  {id: 'bi', label: 'Аналитика', hint: 'BI с отраслевыми моделями и KPI'},
  {id: 'compliance', label: 'Compliance', hint: 'Отчётность, аудит, контроль норм'},
  {id: 'iot', label: 'Физика', hint: 'SCADA, прошивки, телеметрия'},
];

function VerticalSoftwareExplorerPlayInner() {
  const [industryId, setIndustryId] = useState('finance');
  const [loadId, setLoadId] = useState('ops');

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? INDUSTRIES[0];
  const load = LOAD_TYPES.find((l) => l.id === loadId) ?? LOAD_TYPES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Карта отраслевого ПО"
        subtitle="Выберите домен и тип нагрузки — увидите типовые системы и предметные ограничения"
      >
        <p className="it-demo__label">Предметная область</p>
        <div className={styles.grid}>
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              type="button"
              className={clsx(styles.tile, industryId === ind.id && styles.tileActive)}
              onClick={() => setIndustryId(ind.id)}
            >
              {ind.label}
            </button>
          ))}
        </div>

        <p className="it-demo__label">Тип функциональной нагрузки</p>
        <div className="it-demo__tabs">
          {LOAD_TYPES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx('it-demo__tab', loadId === l.id && 'it-demo__tab--active')}
              onClick={() => setLoadId(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <h5 className={styles.panelTitle}>
            {industry.label} · {load.label}
          </h5>
          <p className={styles.loadHint}>{load.hint}</p>
          <div className={styles.cols}>
            <div>
              <span className={styles.kicker}>Примеры систем</span>
              <ul>
                {industry.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className={styles.kicker}>Типовые задачи</span>
              <ul>
                {industry.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.norms}>
            <strong>Нормативный контур:</strong> {industry.norms}
          </p>
        </div>
        <p className={styles.hint}>
          Отраслевое ПО редко живёт изолированно: оно стыкуется с ERP, облаком, API и
          универсальными платформами — формируя цифровую экосистему домена.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default VerticalSoftwareExplorerPlayInner;
