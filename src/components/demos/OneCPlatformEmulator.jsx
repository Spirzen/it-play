import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import {
  CODE_SAMPLES,
  DOCUMENT_DEFAULT,
  LIST_DATA,
  METADATA_TREE,
  NAV_SECTIONS,
  ONE_C_ACCENT,
  formatDocumentTotal,
  getModuleCode,
  runBslDemo,
} from '@/components/shared/kb/oneCEngine';
import styles from '@/components/demos/OneCPlatformEmulator.module.css';

const FOCUS_PRESETS = {
  enterprise: {mode: 'enterprise', view: 'receipt'},
  configurator: {mode: 'configurator', module: 'receipt'},
  metadata: {mode: 'configurator', module: 'nomenclature'},
  code: {mode: 'configurator', module: 'variables'},
  flow: {mode: 'configurator', module: 'flow'},
  syntax: {mode: 'configurator', module: 'partners'},
};

function resolveFocus(focus) {
  const base = {mode: 'enterprise', view: 'nomenclature', module: 'receipt'};
  if (!focus) return base;
  return {...base, ...(FOCUS_PRESETS[focus] ?? FOCUS_PRESETS.enterprise)};
}

function findNavItem(viewId) {
  for (const section of NAV_SECTIONS) {
    const item = section.items.find((i) => i.id === viewId);
    if (item) return {...item, section: section.label};
  }
  return null;
}

export function OneCPlatformEmulatorInner({focus, compact}) {
  const preset = resolveFocus(focus);
  const [mode, setMode] = useState(preset.mode);
  const [view, setView] = useState(preset.view);
  const [moduleKey, setModuleKey] = useState(preset.module);
  const [code, setCode] = useState(() => getModuleCode(preset.module));
  const [messages, setMessages] = useState([]);
  const [doc, setDoc] = useState(DOCUMENT_DEFAULT);
  const [posted, setPosted] = useState(false);

  const navItem = findNavItem(view);

  useEffect(() => {
    setCode(getModuleCode(moduleKey));
  }, [moduleKey]);

  const appendMessages = useCallback((entries) => {
    setMessages((prev) => [...entries, ...prev].slice(0, 30));
  }, []);

  const handleRunCode = () => {
    appendMessages(runBslDemo(code));
  };

  const handlePostDocument = () => {
    setPosted(true);
    appendMessages(runBslDemo(getModuleCode('receipt')));
    appendMessages([{text: `Документ № ${doc.number} проведён`, type: 'success', time: ''}]);
  };

  const handleOpenList = (id) => {
    setView(id);
    setPosted(false);
    appendMessages([{text: `Открыт: ${findNavItem(id)?.label ?? id}`, type: 'info', time: ''}]);
  };

  const enterpriseChrome = (
    <DesktopAppChrome
      title="1С:Предприятие — Управление торговлей (учебный режим)"
      accent={ONE_C_ACCENT}
      menu={
        <div className={styles.modeBar}>
          <button
            type="button"
            className={clsx(mode === 'enterprise' && styles.modeBtnActive)}
            onClick={() => setMode('enterprise')}
          >
            1С:Предприятие
          </button>
          <button
            type="button"
            className={clsx(mode === 'configurator' && styles.modeBtnActive)}
            onClick={() => setMode('configurator')}
          >
            Конфигуратор
          </button>
          <span style={{flex: 1}} />
          <button type="button">Файл</button>
          <button type="button">Сервис</button>
          <button type="button">Окна</button>
          <button type="button">Справка</button>
        </div>
      }
      toolbar={
        mode === 'enterprise' ? (
          <>
            <button type="button" onClick={() => handleOpenList('receipt')}>
              Создать документ
            </button>
            <button type="button" onClick={handlePostDocument} disabled={view !== 'receipt' || posted}>
              Провести
            </button>
            <button type="button" onClick={() => appendMessages(runBslDemo(CODE_SAMPLES.variables))}>
              Сообщить (пример)
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleRunCode}>
              ▶ Выполнить (F5)
            </button>
            <button type="button" onClick={() => setCode(getModuleCode(moduleKey))}>
              Сбросить модуль
            </button>
          </>
        )
      }
      status={
        mode === 'enterprise'
          ? `${navItem?.section ?? 'Раздел'} → ${navItem?.label ?? view} · Пользователь: Администратор · База: Demo_UT`
          : `Конфигуратор · Модуль: ${moduleKey} · Режим отладки (демо)`
      }
    >
      {mode === 'enterprise' ? (
        <div className={styles.layout}>
          <nav className={styles.nav} aria-label="Панель разделов">
            {NAV_SECTIONS.map((section) => (
              <div key={section.id} className={styles.navSection}>
                <div className={styles.navSectionTitle}>{section.label}</div>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={clsx(styles.navItem, view === item.id && styles.navItemActive)}
                    onClick={() => handleOpenList(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className={styles.main}>
            <div className={styles.content}>
              {view === 'receipt' && (
                <div className={styles.docForm}>
                  <div className={styles.docHeader}>
                    <div className={styles.field}>
                      <label>Номер</label>
                      <input value={doc.number} readOnly />
                    </div>
                    <div className={styles.field}>
                      <label>Дата</label>
                      <input value={doc.date} readOnly />
                    </div>
                    <div className={styles.field}>
                      <label>Контрагент</label>
                      <input
                        value={doc.partner}
                        onChange={(e) => setDoc((d) => ({...d, partner: e.target.value}))}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Склад</label>
                      <input value={doc.warehouse} readOnly />
                    </div>
                  </div>
                  <table className={styles.listTable}>
                    <thead>
                      <tr>
                        <th>Номенклатура</th>
                        <th>Кол-во</th>
                        <th>Цена</th>
                        <th>Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.lines.map((row) => (
                        <tr key={row.item}>
                          <td>{row.item}</td>
                          <td>{row.qty}</td>
                          <td>{row.price}</td>
                          <td>{row.sum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <strong>Итого: {formatDocumentTotal(doc.lines)} ₽</strong>
                  {posted && (
                    <p style={{margin: 0, fontSize: '0.78rem', color: 'var(--ifm-color-success)'}}>
                      Документ проведён — движения записаны в регистр "ОстаткиТоваров"
                    </p>
                  )}
                </div>
              )}
              {view === 'stock' && (
                <div className={styles.reportBox}>
                  <h5>Отчёт "Остатки товаров"</h5>
                  <table className={styles.listTable}>
                    <thead>
                      <tr>
                        <th>Номенклатура</th>
                        <th>Остаток</th>
                        <th>Склад</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ноутбук 15&quot;</td>
                        <td>{posted ? 14 : 12}</td>
                        <td>Основной</td>
                      </tr>
                      <tr>
                        <td>Монитор 27&quot;</td>
                        <td>{posted ? 9 : 6}</td>
                        <td>Основной</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {view !== 'receipt' && view !== 'stock' && LIST_DATA[view] && (
                <table className={styles.listTable}>
                  <thead>
                    <tr>
                      {Object.keys(LIST_DATA[view][0]).map((k) => (
                        <th key={k}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LIST_DATA[view].map((row) => (
                      <tr key={row.code}>
                        {Object.values(row).map((v, i) => (
                          <td key={i}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className={styles.messages} aria-label="Сообщения">
              {messages.length === 0 ? (
                <div className={styles.msgLine}>Сообщения платформы появятся здесь…</div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={`${m.text}-${i}`}
                    className={clsx(
                      styles.msgLine,
                      m.type === 'success' && styles.msgSuccess,
                      m.type === 'warn' && styles.msgWarn,
                    )}
                  >
                    {m.time ? `[${m.time}] ` : ''}
                    {m.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.configLayout}>
          <div className={styles.metaTree} aria-label="Дерево метаданных">
            {METADATA_TREE.map((group) => (
              <div key={group.id} className={styles.metaGroup}>
                <div className={styles.metaGroupTitle}>{group.label}</div>
                {group.children.map((leaf) => (
                  <button
                    key={leaf.id}
                    type="button"
                    className={clsx(styles.metaLeaf, moduleKey === leaf.module && styles.metaLeafActive)}
                    onClick={() => setModuleKey(leaf.module)}
                  >
                    {leaf.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.editorPane}>
            <textarea
              className={styles.codeArea}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              aria-label="Модуль объекта"
            />
            <div className={styles.messages} aria-label="Сообщения отладки">
              {messages.length === 0 ? (
                <div className={styles.msgLine}>Нажмите "Выполнить" для запуска процедуры…</div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={`${m.text}-${i}`}
                    className={clsx(
                      styles.msgLine,
                      m.type === 'success' && styles.msgSuccess,
                      m.type === 'warn' && styles.msgWarn,
                    )}
                  >
                    {m.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DesktopAppChrome>
  );

  if (compact) return enterpriseChrome;

  return (
    <DemoShell>
      <DemoCard
        title="Эмулятор платформы 1С:Предприятие"
        subtitle="Панель разделов, документ, конфигуратор и окно сообщений — упрощённая учебная копия интерфейса"
      >
        {enterpriseChrome}
        <p className={styles.hint}>
          Переключайтесь между режимом пользователя и конфигуратором. Это не настоящая 1С, а
          наглядная модель: справочники, документ "Поступление", проведение и модуль на встроенном
          языке.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OneCPlatformEmulatorInner;
