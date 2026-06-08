import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DB_TYPES,
  DEFAULT_PORTS,
  computeTableLayout,
  describeFk,
  emptyConnection,
  filterSchema,
  getColumnRelations,
  getRelatedTables,
  sanitizeHostInput,
  simulateFetchSchema,
  simulateListDatabases,
  simulateTestConnection,
} from '@/components/shared/kb/databaseSchemaEngine';
import styles from '@/components/demos/DatabaseSchemaViewerPlay.module.css';

function TableNodeCard({
  table,
  selected,
  related,
  dimmed,
  searchHit,
  highlightColumn,
  onSelect,
  nodeRef,
}) {
  return (
    <button
      type="button"
      ref={nodeRef}
      className={clsx(
        styles.tableNode,
        selected && styles.tableNodeSelected,
        related && !selected && styles.tableNodeRelated,
        dimmed && styles.tableNodeDimmed,
        searchHit && styles.tableNodeSearchHit,
      )}
      onClick={() => onSelect(table)}
    >
      <div className={styles.tableHead}>
        <span className={styles.tableIcon} aria-hidden>
          ◈
        </span>
        <div>
          <span className={styles.tableTitle}>{table.name}</span>
          {table.schema && <span className={styles.tableSchema}>{table.schema}</span>}
        </div>
      </div>
      {table.columns.map((col) => {
        const badges = [];
        if (col.is_primary_key) badges.push('PK');
        if (col.is_foreign_key) badges.push('FK');
        return (
          <div
            key={col.name}
            className={clsx(
              styles.colRow,
              highlightColumn === col.name && styles.colRowHighlight,
            )}
          >
            <span className={styles.colName}>{col.name}</span>
            <span className={styles.colType}>{col.data_type}</span>
            {badges.length > 0 && <span className={styles.colBadges}>{badges.join(' ')}</span>}
          </div>
        );
      })}
    </button>
  );
}

function DetailsPanel({
  table,
  foreignKeys,
  highlightColumn,
  onClose,
  onNavigateTable,
  onNavigateFk,
}) {
  const [tab, setTab] = useState('fields');
  const relations = useMemo(
    () => (table ? getColumnRelations(table.name, foreignKeys) : []),
    [table, foreignKeys],
  );
  const outgoing = relations.filter((r) => r.direction === 'outgoing');
  const incoming = relations.filter((r) => r.direction === 'incoming');

  useEffect(() => {
    setTab('fields');
  }, [table?.name]);

  useEffect(() => {
    if (highlightColumn) setTab('fields');
  }, [highlightColumn]);

  if (!table) {
    return (
      <div className={styles.detailsPanel}>
        <div className={styles.detailsEmpty}>
          Выберите таблицу на диаграмме или подключитесь к базе, чтобы увидеть поля и связи FK
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsPanel}>
      <div className={styles.detailsHeader}>
        <h4 className={styles.detailsTitle}>{table.name}</h4>
        <button type="button" className={styles.btnClose} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>
      {table.primary_key?.length > 0 && (
        <p className="it-demo__subtitle" style={{margin: '0 0 0.5rem', fontSize: '0.72rem'}}>
          PK: <code>{table.primary_key.join(', ')}</code>
        </p>
      )}
      <div className={styles.detailsTabs} role="tablist">
        <button
          type="button"
          role="tab"
          className={clsx(styles.tabBtn, tab === 'fields' && styles.tabBtnActive)}
          onClick={() => setTab('fields')}
        >
          Поля
        </button>
        <button
          type="button"
          role="tab"
          className={clsx(styles.tabBtn, tab === 'relations' && styles.tabBtnActive)}
          onClick={() => setTab('relations')}
        >
          Связи ({relations.length})
        </button>
      </div>
      {tab === 'fields' && (
        <ul className={styles.colList}>
          {table.columns.map((col) => (
            <li key={col.name}>
              <span>
                {col.name}
                {col.is_primary_key && ' · PK'}
                {col.is_foreign_key && ' · FK'}
                {!col.nullable && ' · NOT NULL'}
              </span>
              <span style={{color: 'var(--demo-muted)'}}>{col.data_type}</span>
            </li>
          ))}
        </ul>
      )}
      {tab === 'relations' && (
        <div>
          {outgoing.length > 0 && (
            <>
              <p className="it-demo__label" style={{margin: '0 0 0.35rem'}}>
                Исходящие
              </p>
              {outgoing.map((rel) => (
                <div key={`${rel.fk.id}-out-${rel.localColumn}`} className={styles.relationCard}>
                  <p className={styles.relationText}>{describeFk(rel.fk)}</p>
                  <div className={styles.relationActions}>
                    <button
                      type="button"
                      className={styles.chipBtn}
                      onClick={() => onNavigateFk(rel.fk)}
                    >
                      Диаграмма
                    </button>
                    <button
                      type="button"
                      className={clsx(styles.chipBtn, styles.chipBtnPrimary)}
                      onClick={() => onNavigateTable(rel.remoteTable, rel.remoteColumn)}
                    >
                      → {rel.remoteTable}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          {incoming.length > 0 && (
            <>
              <p className="it-demo__label" style={{margin: '0.75rem 0 0.35rem'}}>
                Входящие
              </p>
              {incoming.map((rel) => (
                <div key={`${rel.fk.id}-in-${rel.localColumn}`} className={styles.relationCard}>
                  <p className={styles.relationText}>{describeFk(rel.fk)}</p>
                  <div className={styles.relationActions}>
                    <button
                      type="button"
                      className={styles.chipBtn}
                      onClick={() => onNavigateFk(rel.fk)}
                    >
                      Диаграмма
                    </button>
                    <button
                      type="button"
                      className={clsx(styles.chipBtn, styles.chipBtnPrimary)}
                      onClick={() => onNavigateTable(rel.remoteTable, rel.remoteColumn)}
                    >
                      ← {rel.remoteTable}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          {relations.length === 0 && (
            <p className="it-demo__subtitle" style={{margin: 0}}>
              У таблицы нет внешних ключей в этой схеме.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DatabaseSchemaViewerPlayInner({title, subtitle}) {
  const [conn, setConn] = useState(() => emptyConnection('postgresql'));
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHint, setLoadingHint] = useState('');
  const [status, setStatus] = useState('');
  const [connected, setConnected] = useState(false);
  const [schema, setSchema] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedFk, setSelectedFk] = useState(null);
  const [highlightColumn, setHighlightColumn] = useState(null);
  const [edges, setEdges] = useState([]);
  const [connOpen, setConnOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const nodeRefs = useRef({});
  const canvasRef = useRef(null);

  const isSqlite = conn.db_type === 'sqlite';
  const isMssql = conn.db_type === 'mssql';

  const patchConn = useCallback((patch) => {
    setConn((c) => {
      const next = {...c, ...patch};
      if (patch.host !== undefined) {
        next.host = sanitizeHostInput(patch.host);
      }
      if (patch.db_type !== undefined) {
        next.port = DEFAULT_PORTS[patch.db_type] ?? null;
        if (patch.db_type === 'postgresql') next.schema = 'public';
        else if (patch.db_type === 'mssql') next.schema = 'dbo';
        else next.schema = '';
      }
      return next;
    });
  }, []);

  const {matchingTables} = useMemo(
    () => (schema ? filterSchema(schema, search) : {matchingTables: new Set()}),
    [schema, search],
  );

  const layout = useMemo(() => {
    if (!schema) return {};
    return computeTableLayout(schema.tables, schema.foreign_keys);
  }, [schema]);

  const layers = useMemo(() => {
    const map = new Map();
    for (const [name, pos] of Object.entries(layout)) {
      if (!map.has(pos.col)) map.set(pos.col, []);
      map.get(pos.col).push(name);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [layout]);

  const relatedTables = useMemo(() => {
    if (!schema || !selectedTable) return new Set();
    if (selectedFk) {
      return new Set([selectedFk.from_table, selectedFk.to_table]);
    }
    return getRelatedTables(selectedTable.name, schema.foreign_keys);
  }, [schema, selectedTable, selectedFk]);

  const hasSearch = search.trim().length > 0;

  const updateEdges = useCallback(() => {
    if (!schema || !canvasRef.current) {
      setEdges([]);
      return;
    }
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const next = [];
    for (const fk of schema.foreign_keys) {
      const fromEl = nodeRefs.current[fk.from_table];
      const toEl = nodeRefs.current[fk.to_table];
      if (!fromEl || !toEl) continue;
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();
      const x1 = fr.right - canvasRect.left;
      const y1 = fr.top + fr.height / 2 - canvasRect.top;
      const x2 = tr.left - canvasRect.left;
      const y2 = tr.top + tr.height / 2 - canvasRect.top;
      const active =
        selectedFk?.id === fk.id ||
        (selectedTable &&
          (fk.from_table === selectedTable.name || fk.to_table === selectedTable.name));
      const midX = (x1 + x2) / 2;
      next.push({
        id: fk.id,
        d: `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`,
        label: fk.from_columns[0],
        active,
        fk,
      });
    }
    setEdges(next);
  }, [schema, selectedTable, selectedFk]);

  useLayoutEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateEdges);
    };
    schedule();
    const onResize = () => schedule();
    window.addEventListener('resize', onResize);
    const canvas = canvasRef.current;
    const ro =
      canvas && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => schedule())
        : null;
    if (ro && canvas) {
      ro.observe(canvas);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [updateEdges, schema, layers, search, selectedTable]);

  const applySchema = useCallback((data) => {
    setSchema(data);
    setConnected(true);
    setSelectedTable(null);
    setSelectedFk(null);
    setHighlightColumn(null);
    setConnOpen(false);
    setDetailsOpen(false);
    setStatus(`✓ Схема: ${data.tables.length} таблиц, ${data.foreign_keys.length} связей`);
  }, []);

  const handleTest = async () => {
    setLoading(true);
    setStatus('');
    try {
      const r = await simulateTestConnection(conn);
      setStatus(r.ok ? `✓ ${r.message}` : `✗ ${r.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshDbs = async () => {
    setLoading(true);
    try {
      const dbs = await simulateListDatabases(conn);
      setDatabases(dbs);
      setStatus(`✓ Найдено баз: ${dbs.length}`);
    } catch (e) {
      setStatus(`✗ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setLoadingHint('Чтение метаданных…');
    setStatus('');
    try {
      const data = await simulateFetchSchema(conn);
      setLoadingHint('Построение диаграммы…');
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      applySchema(data);
    } catch (e) {
      setStatus(`✗ ${e.message}`);
    } finally {
      setLoading(false);
      setLoadingHint('');
    }
  };

  const handleDemo = async () => {
    const demoConn = {
      ...emptyConnection('sqlite'),
      file_path: 'sample/demo.db',
      database: 'demo.db',
    };
    setConn(demoConn);
    setLoading(true);
    setLoadingHint('Демо SQLite…');
    try {
      const data = await simulateFetchSchema(demoConn);
      applySchema(data);
    } catch (e) {
      setStatus(`✗ ${e.message}`);
    } finally {
      setLoading(false);
      setLoadingHint('');
    }
  };

  const handleDisconnect = () => {
    setSchema(null);
    setConnected(false);
    setSelectedTable(null);
    setSelectedFk(null);
    setHighlightColumn(null);
    setSearch('');
    setConnOpen(true);
    setDetailsOpen(true);
    setStatus('Отключено');
  };

  const navigateToTable = (tableName, columnName) => {
    const table = schema?.tables.find((t) => t.name === tableName);
    if (!table) return;
    setSelectedTable(table);
    setSelectedFk(null);
    setHighlightColumn(columnName ?? null);
    nodeRefs.current[tableName]?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
  };

  const navigateToFk = (fk) => {
    setSelectedFk(fk);
    setSelectedTable(null);
    setHighlightColumn(null);
  };

  const connectLabel = loading ? loadingHint || 'Загрузка…' : 'Подключить';

  return (
    <DemoShell>
      <DemoCard title={title} subtitle={subtitle}>
        <div
          className={clsx(
            styles.shell,
            !connOpen && styles.shellConnCollapsed,
            connected && schema && !detailsOpen && styles.shellDetailsCollapsed,
          )}
        >
          <aside className={clsx(styles.connPanel, !connOpen && styles.connPanelCollapsed)}>
            <div className={styles.panelHead}>
              <div className={styles.brand}>
                <div className={styles.brandTitle}>Schema Viewer</div>
                {connOpen && (
                  <p className={styles.brandSub}>Параметры подключения и ER-диаграмма (эмуляция)</p>
                )}
              </div>
              <button
                type="button"
                className={styles.panelToggle}
                onClick={() => setConnOpen((v) => !v)}
                aria-expanded={connOpen}
                title={connOpen ? 'Свернуть параметры подключения' : 'Развернуть параметры подключения'}
              >
                {connOpen ? '◀' : '▶'}
              </button>
            </div>

            {connOpen && (
              <>
            <div className={styles.field}>
              <label htmlFor="dsv-db-type">Тип СУБД</label>
              <select
                id="dsv-db-type"
                value={conn.db_type}
                onChange={(e) => patchConn({db_type: e.target.value})}
                disabled={connected}
              >
                {DB_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {isSqlite ? (
              <div className={styles.field}>
                <label htmlFor="dsv-file">Файл базы (.db)</label>
                <input
                  id="dsv-file"
                  type="text"
                  value={conn.file_path}
                  placeholder="K:\path\to\database.db"
                  onChange={(e) => patchConn({file_path: e.target.value})}
                  disabled={connected}
                />
              </div>
            ) : (
              <>
                <div className={styles.field}>
                  <label htmlFor="dsv-host">Хост {isMssql ? '(ПК\\экземпляр)' : ''}</label>
                  <input
                    id="dsv-host"
                    type="text"
                    value={conn.host}
                    placeholder={isMssql ? 'SERVER\\SQLEXPRESS' : 'localhost'}
                    onChange={(e) => patchConn({host: e.target.value})}
                    disabled={connected}
                  />
                </div>
                {(!isMssql || !conn.host.includes('\\')) && (
                  <div className={styles.field}>
                    <label htmlFor="dsv-port">Порт</label>
                    <input
                      id="dsv-port"
                      type="number"
                      value={conn.port ?? ''}
                      onChange={(e) =>
                        patchConn({port: e.target.value ? Number(e.target.value) : null})
                      }
                      disabled={connected}
                    />
                  </div>
                )}
                <div className={styles.field}>
                  <label htmlFor="dsv-user">Пользователь</label>
                  <input
                    id="dsv-user"
                    type="text"
                    value={conn.username}
                    autoComplete="username"
                    onChange={(e) => patchConn({username: e.target.value})}
                    disabled={connected}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dsv-pass">Пароль</label>
                  <input
                    id="dsv-pass"
                    type="password"
                    value={conn.password}
                    autoComplete="current-password"
                    onChange={(e) => patchConn({password: e.target.value})}
                    disabled={connected}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="dsv-db">База данных</label>
                  <div className={styles.fieldRow}>
                    <select
                      id="dsv-db"
                      value={conn.database}
                      onChange={(e) => patchConn({database: e.target.value})}
                      disabled={connected}
                    >
                      <option value="">— выберите —</option>
                      {databases.map((db) => (
                        <option key={db} value={db}>
                          {db}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={styles.btnIcon}
                      title="Обновить список"
                      onClick={handleRefreshDbs}
                      disabled={loading || connected}
                    >
                      ↻
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Или введите имя"
                    value={conn.database}
                    onChange={(e) => patchConn({database: e.target.value})}
                    disabled={connected}
                    style={{marginTop: '0.35rem'}}
                  />
                </div>
                {(conn.db_type === 'postgresql' || conn.db_type === 'mssql') && (
                  <div className={styles.field}>
                    <label htmlFor="dsv-schema">Схема</label>
                    <input
                      id="dsv-schema"
                      type="text"
                      value={conn.schema}
                      placeholder={conn.db_type === 'postgresql' ? 'public' : 'dbo'}
                      onChange={(e) => patchConn({schema: e.target.value})}
                      disabled={connected}
                    />
                  </div>
                )}
              </>
            )}

            <div className={styles.btnGroup}>
              <button
                type="button"
                className={clsx(styles.btn, styles.btnGhost)}
                onClick={handleTest}
                disabled={loading}
              >
                Проверить
              </button>
              <button
                type="button"
                className={clsx(styles.btn, styles.btnPrimary)}
                onClick={handleConnect}
                disabled={loading || connected}
              >
                {connectLabel}
              </button>
            </div>

            {connected && (
              <button
                type="button"
                className={clsx(styles.btn, styles.btnDisconnect)}
                onClick={handleDisconnect}
                disabled={loading}
              >
                Отключиться
              </button>
            )}

            <button
              type="button"
              className={clsx(styles.btn, styles.btnSample)}
              onClick={handleDemo}
              disabled={loading}
            >
              Демо SQLite
            </button>

            {status && (
              <p
                className={clsx(
                  styles.status,
                  status.startsWith('✓') || status === 'Отключено'
                    ? styles.statusOk
                    : styles.statusErr,
                )}
              >
                {status}
              </p>
            )}

            <p className={styles.simNote}>
              Эмуляция: реального подключения нет. Пароль <code>fail</code> — ошибка входа. Схемы
              shop, blog, corp_demo зависят от имени базы.
            </p>
              </>
            )}
            {!connOpen && (
              <p className={styles.collapsedHint}>Подключение</p>
            )}
          </aside>

          <div className={styles.workspace}>
            {connected && schema ? (
              <>
                <div className={styles.toolbar}>
                  <input
                    type="search"
                    className={styles.searchInput}
                    placeholder="Таблица или столбец…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className={styles.dbBadge}>{schema.db_label}</span>
                  <span className="it-demo__badge">
                    {schema.tables.length} табл. · {schema.foreign_keys.length} FK
                  </span>
                </div>
                <div
                  className={clsx(
                    styles.workspaceBody,
                    !detailsOpen && styles.workspaceBodyGraphOnly,
                  )}
                >
                  <div className={styles.graphArea}>
                    {loading && <div className={styles.loadingOverlay}>{loadingHint}</div>}
                    <div className={styles.graphCanvas} ref={canvasRef}>
                      <svg className={styles.svgLines} aria-hidden>
                        {edges.map((edge) => (
                          <g key={edge.id}>
                            <path
                              d={edge.d}
                              className={clsx(styles.edgePath, edge.active && styles.edgePathActive)}
                            />
                            <text
                              x={edge.d.match(/C ([\d.]+)/)?.[1] ?? 0}
                              y={edge.d.match(/C [\d.]+ ([\d.]+)/)?.[1] ?? 0}
                              className={styles.edgeLabel}
                              textAnchor="middle"
                            >
                              {edge.label}
                            </text>
                          </g>
                        ))}
                      </svg>
                      <div className={styles.tableGrid}>
                        {layers.map(([layerIdx, tableNames]) => (
                          <div key={layerIdx} className={styles.tableLayer}>
                            {tableNames.map((name) => {
                              const table = schema.tables.find((t) => t.name === name);
                              if (!table) return null;
                              const searchHit = matchingTables.has(name);
                              const dimmed =
                                hasSearch && !searchHit && selectedTable?.name !== name;
                              return (
                                <TableNodeCard
                                  key={name}
                                  table={table}
                                  selected={selectedTable?.name === name}
                                  related={relatedTables.has(name)}
                                  dimmed={dimmed}
                                  searchHit={hasSearch && searchHit}
                                  highlightColumn={
                                    selectedTable?.name === name ? highlightColumn : null
                                  }
                                  onSelect={(t) => {
                                    setSelectedTable(t);
                                    setSelectedFk(null);
                                    setHighlightColumn(null);
                                    setDetailsOpen(true);
                                  }}
                                  nodeRef={(el) => {
                                    if (el) nodeRefs.current[name] = el;
                                    else delete nodeRefs.current[name];
                                  }}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.legend}>
                      <span>◈ — таблица</span>
                      <span>PK / FK — ключи</span>
                      <span>Линии — внешние ключи</span>
                    </div>
                  </div>
                  {detailsOpen ? (
                    <div className={styles.detailsWrap}>
                      <button
                        type="button"
                        className={styles.panelToggle}
                        onClick={() => setDetailsOpen(false)}
                        aria-expanded
                        title="Свернуть сведения о таблице"
                      >
                        ▶
                      </button>
                      <DetailsPanel
                        table={selectedTable}
                        foreignKeys={schema.foreign_keys}
                        highlightColumn={highlightColumn}
                        onClose={() => {
                          setSelectedTable(null);
                          setSelectedFk(null);
                          setHighlightColumn(null);
                        }}
                        onNavigateTable={navigateToTable}
                        onNavigateFk={navigateToFk}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.detailsExpand}
                      onClick={() => setDetailsOpen(true)}
                      aria-expanded={false}
                      title="Развернуть сведения о таблице"
                    >
                      ◀ Таблица
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon} aria-hidden>
                  ◈
                </span>
                <p>
                  Укажите параметры подключения и нажмите "Подключить", либо "Демо SQLite" — появится
                  ER-диаграмма со связями, как в Database Schema Viewer.
                </p>
              </div>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DatabaseSchemaViewerPlayInner;
