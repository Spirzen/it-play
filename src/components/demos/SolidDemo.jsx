import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CODE_SNIPPETS,
  PRINCIPLES,
  calculateTotal,
  deviceAction,
  doubleWidth,
  getDiscountOptions,
  orderSubtotal,
  placeOrder,
  registerUser,
} from '@/components/shared/kb/solidDemoEngine';
import styles from '@/components/demos/SolidDemo.module.css';

function LogList({entries}) {
  if (!entries?.length) {
    return (
      <p style={{margin: 0, fontSize: '0.78rem', color: 'var(--ifm-color-emphasis-600)'}}>
        Нажмите кнопку действия
      </p>
    );
  }
  return (
    <ul className={styles.log}>
      {entries.map((line, i) => (
        <li
          key={`${line.text}-${i}`}
          className={clsx(
            line.level === 'ok' && styles.logOk,
            line.level === 'info' && styles.logInfo,
            line.level === 'warn' && styles.logWarn,
            line.level === 'err' && styles.logErr,
          )}
        >
          {line.text}
        </li>
      ))}
    </ul>
  );
}

function ModeToggle({followsSolid, setFollowsSolid}) {
  return (
    <div className={styles.modeRow}>
      <button
        type="button"
        className={clsx(styles.modeBtn, followsSolid && styles.modeBtnActive)}
        onClick={() => setFollowsSolid(true)}
      >
        ✅ Соблюдаем принцип
      </button>
      <button
        type="button"
        className={clsx(styles.modeBtn, !followsSolid && styles.modeBtnBadActive)}
        onClick={() => setFollowsSolid(false)}
      >
        ❌ Типичное нарушение
      </button>
    </div>
  );
}

function SrpPanel({followsSolid}) {
  const [userName, setUserName] = useState('Анна');
  const [email, setEmail] = useState('anna@example.com');
  const [log, setLog] = useState([]);

  return (
    <>
      <div className={styles.diagram}>
        {!followsSolid ? (
          <div className={styles.box} style={{borderColor: '#c62828'}}>
            <strong>UserManager</strong>
            <div>save_user · send_email</div>
          </div>
        ) : (
          <>
            <div className={styles.boxSplit}>
              <div className={styles.box}>
                <strong>UserRepository</strong>
                <div>save()</div>
              </div>
              <div className={styles.box}>
                <strong>EmailService</strong>
                <div>send()</div>
              </div>
            </div>
            <span className={styles.arrow}>↑ использует</span>
            <div className={styles.box}>
              <strong>UserManager</strong>
              <div>register_user()</div>
            </div>
          </>
        )}
      </div>
      <div className={styles.fieldRow}>
        <label>
          Имя
          <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
        onClick={() => setLog(registerUser(userName, email, followsSolid))}
      >
        Зарегистрировать пользователя
      </button>
      <LogList entries={log} />
    </>
  );
}

function OcpPanel({followsSolid}) {
  const [discountId, setDiscountId] = useState('seasonal');
  const options = useMemo(() => getDiscountOptions(followsSolid), [followsSolid]);
  const result = useMemo(() => calculateTotal(discountId, followsSolid), [discountId, followsSolid]);

  useEffect(() => {
    if (!options.some((d) => d.id === discountId)) {
      setDiscountId(options[0]?.id ?? 'none');
    }
  }, [options, discountId]);

  return (
    <>
      <p style={{margin: '0 0 0.5rem', fontSize: '0.8rem'}}>
        Заказ: Книга (100 ₽) + Чехол (50 ₽) = <strong>{orderSubtotal()} ₽</strong>
      </p>
      <div className={styles.chipRow}>
        {options.map((d) => (
          <button
            key={d.id}
            type="button"
            className={clsx(styles.chip, discountId === d.id && styles.chipActive)}
            style={{'--chip-accent': '#1565c0'}}
            onClick={() => setDiscountId(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className={styles.metricGrid}>
        <div className={styles.metric}>
          <span>Сумма</span>
          <strong>{result.subtotal} ₽</strong>
        </div>
        <div className={styles.metric}>
          <span>Итого</span>
          <strong>{result.blocked ? '—' : `${Math.round(result.total)} ₽`}</strong>
        </div>
        <div className={styles.metric}>
          <span>calculate_total</span>
          <strong>{result.blocked ? 'меняем' : 'нет правок'}</strong>
        </div>
      </div>
      {result.blocked ? (
        <div className="it-demo__alert it-demo__alert--warning" style={{marginTop: '0.5rem'}}>
          {result.message}
        </div>
      ) : (
        <div className="it-demo__alert it-demo__alert--success" style={{marginTop: '0.5rem'}}>
          {followsSolid
            ? 'Новая скидка — новый класс Discount; функция расчёта не трогается.'
            : 'Скидка применена через if/elif внутри одной функции.'}
        </div>
      )}
    </>
  );
}

function LspPanel({followsSolid}) {
  const [shapeKind, setShapeKind] = useState('rectangle');
  const [dims, setDims] = useState({width: 3, height: 4});
  const [last, setLast] = useState(null);

  const run = () => {
    const r = doubleWidth(shapeKind, dims.width, dims.height, followsSolid);
    setLast(r);
  };

  return (
    <>
      <div className={styles.chipRow}>
        <button
          type="button"
          className={clsx(styles.chip, shapeKind === 'rectangle' && styles.chipActive)}
          style={{'--chip-accent': '#6a1b9a'}}
          onClick={() => {
            setShapeKind('rectangle');
            setDims({width: 3, height: 4});
            setLast(null);
          }}
        >
          Rectangle 3×4
        </button>
        <button
          type="button"
          className={clsx(styles.chip, shapeKind === 'square' && styles.chipActive)}
          style={{'--chip-accent': '#6a1b9a'}}
          onClick={() => {
            setShapeKind('square');
            setDims({width: 3, height: 3});
            setLast(null);
          }}
        >
          Square 3×3
        </button>
      </div>
      <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={run}>
        Удвоить ширину (double_width)
      </button>
      {last ? (
        <>
          <div className={styles.metricGrid} style={{marginTop: '0.65rem'}}>
            <div className={styles.metric}>
              <span>Ширина</span>
              <strong>{last.width}</strong>
            </div>
            <div className={styles.metric}>
              <span>Высота</span>
              <strong>{last.height}</strong>
            </div>
            <div className={styles.metric}>
              <span>Площадь</span>
              <strong>{last.area}</strong>
            </div>
          </div>
          <div
            className={clsx(
              'it-demo__alert',
              last.surprise ? 'it-demo__alert--warning' : 'it-demo__alert--success',
            )}
            style={{marginTop: '0.5rem'}}
          >
            {last.note}
          </div>
        </>
      ) : null}
    </>
  );
}

function IspPanel({followsSolid}) {
  const [deviceId, setDeviceId] = useState('simple');
  const [log, setLog] = useState([]);

  const act = (action) => {
    const r = deviceAction(deviceId, action, followsSolid);
    setLog((prev) => [
      ...prev,
      {level: r.ok ? 'ok' : 'err', text: r.text},
      {level: 'info', text: r.hint},
    ]);
  };

  return (
    <>
      <div className={styles.chipRow}>
        {[
          {id: 'simple', label: 'SimplePrinter'},
          {id: 'allinone', label: 'AllInOne'},
        ].map((d) => (
          <button
            key={d.id}
            type="button"
            className={clsx(styles.chip, deviceId === d.id && styles.chipActive)}
            style={{'--chip-accent': '#e65100'}}
            onClick={() => {
              setDeviceId(d.id);
              setLog([]);
            }}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className={styles.chipRow}>
        {['print', 'scan', 'fax'].map((action) => (
          <button
            key={action}
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => act(action)}
          >
            {action}()
          </button>
        ))}
      </div>
      <LogList entries={log} />
    </>
  );
}

function DipPanel({followsSolid}) {
  const [notifierId, setNotifierId] = useState('email');
  const [log, setLog] = useState([]);

  const run = () => {
    const effective = followsSolid ? notifierId : 'email';
    const r = placeOrder(effective, followsSolid);
    setLog(r.lines);
  };

  return (
    <>
      <div className={styles.diagram}>
        <div className={styles.box}>
          <strong>OrderService</strong>
          <div>place_order()</div>
        </div>
        <span className={styles.arrow}>{followsSolid ? 'зависит от ↓' : 'жёстко знает ↓'}</span>
        <div className={styles.box} style={{opacity: followsSolid || notifierId === 'email' ? 1 : 0.45}}>
          <strong>{followsSolid ? 'NotificationService' : 'EmailNotificationService'}</strong>
        </div>
      </div>
      <div className={styles.chipRow}>
        {[
          {id: 'email', label: '📧 Email'},
          {id: 'sms', label: '📱 SMS'},
        ].map((n) => (
          <button
            key={n.id}
            type="button"
            className={clsx(styles.chip, notifierId === n.id && styles.chipActive)}
            style={{'--chip-accent': '#00838f'}}
            disabled={!followsSolid && n.id === 'sms'}
            onClick={() => setNotifierId(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>
      <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={run}>
        Оформить заказ
      </button>
      <LogList entries={log} />
    </>
  );
}

const PANELS = {
  srp: SrpPanel,
  ocp: OcpPanel,
  lsp: LspPanel,
  isp: IspPanel,
  dip: DipPanel,
};

function SolidDemoInner() {
  const [principleId, setPrincipleId] = useState('srp');
  const [followsSolid, setFollowsSolid] = useState(true);

  const principle = PRINCIPLES.find((p) => p.id === principleId) ?? PRINCIPLES[0];
  const Panel = PANELS[principleId];

  const onPrincipleChange = useCallback((id) => {
    setPrincipleId(id);
    setFollowsSolid(true);
  }, []);

  const snippets = CODE_SNIPPETS[principleId];

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Принципы SOLID — интерактивно</h4>
        <p className={styles.subtitle}>
          Переключайте букву, сравнивайте нарушение и корректный дизайн на мини-сценариях из статьи
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.tabRow} role="tablist" aria-label="Принципы SOLID">
          {PRINCIPLES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={principleId === p.id}
              className={clsx(styles.tabBtn, principleId === p.id && styles.tabBtnActive)}
              style={
                principleId === p.id
                  ? {background: p.color, borderColor: p.color}
                  : undefined
              }
              onClick={() => onPrincipleChange(p.id)}
              title={p.label}
            >
              {p.letter}
            </button>
          ))}
        </div>

        <h5 className={styles.principleTitle}>
          {principle.letter} — {principle.label}
        </h5>
        <p className={styles.principleHint}>{principle.hint}</p>

        <ModeToggle followsSolid={followsSolid} setFollowsSolid={setFollowsSolid} />

        <div className={styles.layout}>
          <div className={styles.panel}>
            <span className="it-demo__label">Сценарий</span>
            <Panel followsSolid={followsSolid} />
          </div>
          <div className={styles.panel}>
            <span className="it-demo__label">Код</span>
            <pre className={styles.codeBlock}>{followsSolid ? snippets.good : snippets.bad}</pre>
            <div
              className={clsx(
                'it-demo__alert',
                followsSolid ? 'it-demo__alert--success' : 'it-demo__alert--warning',
              )}
              style={{marginTop: '0.65rem'}}
            >
              {followsSolid
                ? 'Изменения локализованы: меняется только затронутый модуль или добавляется новый тип.'
                : 'Один компонент "знает" лишнее — правки расползаются по системе.'}
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export default SolidDemoInner;
