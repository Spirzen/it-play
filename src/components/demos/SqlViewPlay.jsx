import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  SALES_RAW,
  computeSalesSummary,
  bumpSourceSales,
} from '@/components/shared/kb/sqlViewEngine';
import styles from '@/components/demos/SqlViewPlay.module.css';

function SqlViewPlayInner() {
  const [viewType, setViewType] = useState('regular');
  const [sourceSales, setSourceSales] = useState(SALES_RAW);
  const [mvSnapshot, setMvSnapshot] = useState(() => computeSalesSummary(SALES_RAW));
  const [mvStale, setMvStale] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [log, setLog] = useState('Нажмите "SELECT из представления", чтобы увидеть разницу.');

  const liveSummary = useMemo(() => computeSalesSummary(sourceSales), [sourceSales]);
  const displayRows = viewType === 'regular' ? liveSummary : mvSnapshot;

  const runSelect = () => {
    setQueryCount((c) => c + 1);
    if (viewType === 'regular') {
      setLog(
        `Запрос #${queryCount + 1}: VIEW пересчитал JOIN + GROUP BY по актуальным sales (${sourceSales.length} строк). Время ~${80 + sourceSales.length * 12} мс.`,
      );
    } else {
      setLog(
        mvStale
          ? `Запрос #${queryCount + 1}: чтение из MV на диске — быстро (~3 мс), но данные устарели после изменения sales.`
          : `Запрос #${queryCount + 1}: чтение готового снимка MV (~3 мс), данные совпадают с источником.`,
      );
    }
  };

  const changeSource = () => {
    setSourceSales((prev) => bumpSourceSales(prev));
    if (viewType === 'materialized') {
      setMvStale(true);
      setLog('В sales изменились суммы (+8%). MV ещё не обновлён — нужен REFRESH MATERIALIZED VIEW.');
    } else {
      setLog('Исходные таблицы изменились — при следующем SELECT обычный VIEW увидит новые суммы.');
    }
  };

  const refreshMv = () => {
    setMvSnapshot(computeSalesSummary(sourceSales));
    setMvStale(false);
    setLog('REFRESH MATERIALIZED VIEW sales_summary — снимок пересчитан по текущим sales.');
  };

  return (
    <DemoShell>
      <DemoCard
        title="Представления: VIEW и MATERIALIZED VIEW"
        subtitle="Виртуальный запрос при каждом чтении vs физический снимок с ручным обновлением"
      >
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={clsx(styles.typeCard, viewType === 'regular' && styles.typeCardActive)}
            onClick={() => {
              setViewType('regular');
              setLog('Обычное VIEW: данные всегда из живого запроса к sales + products.');
            }}
          >
            <span className={styles.typeTitle}>Обычное VIEW</span>
            <span className={styles.typeDesc}>Нет данных на диске — только определение SELECT</span>
          </button>
          <button
            type="button"
            className={clsx(styles.typeCard, viewType === 'materialized' && styles.typeCardActive)}
            onClick={() => {
              setViewType('materialized');
              setLog('MV хранит результат на диске; актуальность зависит от REFRESH.');
            }}
          >
            <span className={styles.typeTitle}>MATERIALIZED VIEW</span>
            <span className={styles.typeDesc}>Снимок + REFRESH, можно индексировать</span>
          </button>
        </div>

        <div className={styles.diagram}>
          <div className={clsx(styles.zone, styles.zoneActive)}>sales + products</div>
          <span className={styles.arrow}>→</span>
          <div className={clsx(styles.zone, viewType === 'materialized' && styles.zoneMv)}>
            {viewType === 'regular' ? 'CREATE VIEW' : 'CREATE MATERIALIZED VIEW'}
            {viewType === 'materialized' && (
              <div>
                <span className={clsx(styles.badge, mvStale ? styles.badgeStale : styles.badgeFresh)}>
                  {mvStale ? 'устарело' : 'актуально'}
                </span>
              </div>
            )}
          </div>
          <span className={styles.arrow}>→</span>
          <div className={clsx(styles.zone, styles.zoneActive)}>SELECT *</div>
        </div>

        <div className={styles.tableWrap}>
          <div className={clsx(styles.row, styles.rowHead)}>
            <span>region</span>
            <span>category</span>
            <span>total_sales</span>
            <span>cnt</span>
          </div>
          {displayRows.map((r, i) => (
            <div key={i} className={styles.row}>
              <span>{r.region}</span>
              <span>{r.product_category}</span>
              <span>{r.total_sales.toLocaleString('ru-RU')}</span>
              <span>{r.order_count}</span>
            </div>
          ))}
        </div>

        {viewType === 'materialized' && mvStale && (
          <p className="it-demo__hint" style={{marginTop: '0.5rem', color: '#e65100'}}>
            Сейчас в таблице "живые" суммы: Москва/Софт ={' '}
            {liveSummary.find((x) => x.region === 'Москва' && x.product_category === 'Софт')?.total_sales ?? '—'} ₽,
            в MV всё ещё старый снимок.
          </p>
        )}

        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runSelect}>
            SELECT из представления
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={changeSource}>
            Изменить sales (+8%)
          </button>
          {viewType === 'materialized' && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={refreshMv}
              disabled={!mvStale}
            >
              REFRESH MV
            </button>
          )}
        </div>

        <div className={styles.log}>{log}</div>
      </DemoCard>
    </DemoShell>
  );
}

export default SqlViewPlayInner;
