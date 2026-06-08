import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  CLASS1_MEMBERS,
  CONCEPT_TABS,
  DEFAULT_BANK,
  DEFAULT_USER,
  createBankState,
  createUserState,
  getBankBalance,
  getUserName,
  setBankBalance,
  setUserName,
  tryDirectBalanceAccess,
  tryDirectNameAccess,
  tryExternalAccess,
} from '@/components/shared/kb/oopEncapsulationEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/OopEncapsulationDemo.module.css';

const SYNTAX_CLASS = {
  kw: shared.syntaxKw,
  access: shared.syntaxAccess,
  type: shared.syntaxType,
  fn: shared.syntaxFn,
  str: shared.syntaxStr,
  p: shared.syntaxPlain,
};

function CodeBlock({lines}) {
  return (
    <div className={shared.codePanel}>
      {lines.map((line) => (
        <div
          key={line.id}
          className={clsx(shared.codeLine, line.highlight && shared.codeLineActive)}
        >
          <code>
            {line.parts.map((p, i) => (
              <span key={i} className={SYNTAX_CLASS[p.t] ?? shared.syntaxPlain}>
                {p.v}
              </span>
            ))}
          </code>
        </div>
      ))}
    </div>
  );
}

function Class1Card() {
  return (
    <div className={styles.classCard}>
      <h5 className={styles.classTitle}>class Класс1</h5>
      {CLASS1_MEMBERS.map((m) => (
        <MemberRow key={m.id} member={m} />
      ))}
    </div>
  );
}

function MemberRow({member}) {
  const badge =
    member.access === 'public' ? (
      <span className={styles.badgePublic}>public</span>
    ) : (
      <span className={styles.badgePrivate}>private</span>
    );
  const label =
    member.kind === 'field'
      ? `${member.type} ${member.name} = ${member.value}`
      : member.sig;
  return (
    <div className={styles.memberRow}>
      <span>{label}</span>
      {badge}
    </div>
  );
}

function ResultBox({result}) {
  if (!result) return null;
  return (
    <div className={result.ok ? styles.successBox : styles.errorBox}>
      <div>{result.detail}</div>
      <div style={{marginTop: '0.35rem'}}>{result.message}</div>
    </div>
  );
}

function OopEncapsulationDemoInner() {
  const [tab, setTab] = useState('modifiers');
  const [lastResult, setLastResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const [user, setUser] = useState(() => createUserState(DEFAULT_USER));
  const [nameInput, setNameInput] = useState(DEFAULT_USER.name);

  const [bank, setBank] = useState(() => createBankState(DEFAULT_BANK));
  const [balanceInput, setBalanceInput] = useState('1500');

  const activeTab = CONCEPT_TABS.find((t) => t.id === tab) ?? CONCEPT_TABS[0];

  const addLog = (text) => {
    setLogs((prev) => [text, ...prev].slice(0, 10));
  };

  const runAccess = (memberId) => {
    const result = tryExternalAccess(memberId);
    setLastResult(result);
    const member = CLASS1_MEMBERS.find((m) => m.id === memberId);
    addLog(
      result.ok
        ? `${member.externalCall} → ${result.message}`
        : `${member.externalCall} ✕ ${result.message}`,
    );
  };

  const modifierCode = useMemo(() => {
    const call = lastResult?.detail?.split(': ')[1];
    if (!call) {
      return [
        {
          id: 'c1',
          parts: [
            {t: 'type', v: 'Класс1'},
            {t: 'p', v: ' obj = new Класс1();'},
          ],
        },
      ];
    }
    return [
      {
        id: 'call',
        highlight: true,
        parts: [{t: 'p', v: call}],
      },
    ];
  }, [lastResult]);

  const renderModifiers = () => (
    <div className={styles.layout}>
      <Class1Card />
      <div>
        <div className={styles.classCardExternal}>
          <h5 className={styles.classTitleExternal}>class Класс2 — снаружи</h5>
          <p style={{margin: '0 0 0.5rem', fontSize: '0.8rem'}}>
            Код из второго файла обращается к объекту <code>Класс1</code>:
          </p>
          <CodeBlock lines={modifierCode} />
          <div className={styles.methodBtns}>
            {CLASS1_MEMBERS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={clsx(
                  'it-demo__btn it-demo__btn--sm',
                  m.access === 'public'
                    ? 'it-demo__btn--primary'
                    : 'it-demo__btn--secondary',
                )}
                onClick={() => runAccess(m.id)}
              >
                {m.externalCall}
              </button>
            ))}
          </div>
        </div>
        <ResultBox result={lastResult} />
      </div>
    </div>
  );

  const renderGetters = () => {
    const userCode = [
      {
        id: 'cls',
        parts: [
          {t: 'kw', v: 'class'},
          {t: 'p', v: ' User { '},
          {t: 'access', v: 'private'},
          {t: 'p', v: ' String name; ... }'},
        ],
      },
    ];
    if (lastResult?.detail) {
      userCode.push({
        id: 'call',
        highlight: true,
        parts: [{t: 'p', v: lastResult.detail}],
      });
    }

    return (
      <>
        <CodeBlock lines={userCode} />
        <div className={styles.layout}>
          <StatePanel title="Состояние объекта (скрыто снаружи)">
            <div className={styles.stateRow}>
              <span>private name</span>
              <span className={styles.locked}>••••••</span>
            </div>
            <div className={styles.stateRow}>
              <span>через getName()</span>
              <span>{user.name || '—'}</span>
            </div>
          </StatePanel>
          <div>
            <div className={styles.methodBtns}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                onClick={() => {
                  const r = tryDirectNameAccess(user);
                  setLastResult(r);
                  addLog(`${r.detail} ✕`);
                }}
              >
                {user.varName}.name
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
                onClick={() => {
                  const r = getUserName(user);
                  setLastResult(r);
                  addLog(`${r.detail} → ${r.message}`);
                }}
              >
                {user.varName}.getName()
              </button>
            </div>
            <div className={styles.formRow}>
              <label>
                setName(новое имя)
                <input
                  className="it-demo__input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Анна"
                />
              </label>
            </div>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              onClick={() => {
                const r = setUserName(user, nameInput);
                setLastResult(r);
                if (r.user) setUser(r.user);
                addLog(`${r.detail} → ${r.message}`);
              }}
            >
              {user.varName}.setName(...)
            </button>
            <ResultBox result={lastResult} />
          </div>
        </div>
      </>
    );
  };

  const renderBank = () => {
    const bankCode = [
      {
        id: 'cls',
        parts: [
          {t: 'kw', v: 'class'},
          {t: 'p', v: ' БанковскийСчёт { '},
          {t: 'access', v: 'private'},
          {t: 'p', v: ' double баланс; ... }'},
        ],
      },
    ];
    if (lastResult?.detail) {
      bankCode.push({
        id: 'call',
        highlight: true,
        parts: [{t: 'p', v: lastResult.detail}],
      });
    }

    return (
      <>
        <CodeBlock lines={bankCode} />
        <div className={styles.layout}>
          <StatePanel title="Внутри объекта">
            <div className={styles.stateRow}>
              <span>private баланс</span>
              <span className={styles.locked}>скрыт</span>
            </div>
            <div className={styles.stateRow}>
              <span>получитьБаланс()</span>
              <span>{bank.balance.toLocaleString('ru-RU')} ₽</span>
            </div>
          </StatePanel>
          <div>
            <div className={styles.methodBtns}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                onClick={() => {
                  const r = tryDirectBalanceAccess(bank);
                  setLastResult(r);
                  addLog(`${r.detail} ✕`);
                }}
              >
                {bank.varName}.баланс
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
                onClick={() => {
                  const r = getBankBalance(bank);
                  setLastResult(r);
                  addLog(`${r.detail} → ${r.message}`);
                }}
              >
                {bank.varName}.получитьБаланс()
              </button>
            </div>
            <div className={styles.formRow}>
              <label>
                установитьБаланс(сумма)
                <input
                  type="number"
                  className="it-demo__input"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              onClick={() => {
                const prev = bank.balance;
                const r = setBankBalance(bank, balanceInput, prev);
                setLastResult(r);
                if (r.bank) setBank(r.bank);
                addLog(`${r.detail} → ${r.message}`);
              }}
            >
              {bank.varName}.установитьБаланс(...)
            </button>
            <ResultBox result={lastResult} />
          </div>
        </div>
      </>
    );
  };

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Инкапсуляция: модификаторы, геттеры и защита данных"
        subtitle="Как в примерах Класс1, User и БанковскийСчёт из статьи"
      >
        <div className={styles.tabRow}>
          {CONCEPT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tabBtn, tab === t.id && styles.tabBtnActive)}
              onClick={() => {
                setTab(t.id);
                setLastResult(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{activeTab.hint}</p>

        {tab === 'modifiers' && renderModifiers()}
        {tab === 'getters' && renderGetters()}
        {tab === 'bank' && renderBank()}

        {logs.length > 0 && (
          <>
            <div className="it-demo__label" style={{marginTop: '0.85rem'}}>
              Журнал
            </div>
            <ul className={styles.log}>
              {logs.map((line, i) => (
                <li key={`${line}-${i}`}>{line}</li>
              ))}
            </ul>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

function StatePanel({title, children}) {
  return (
    <div className={styles.statePanel}>
      <div className={styles.stateTitle}>{title}</div>
      {children}
    </div>
  );
}

export default OopEncapsulationDemoInner;
