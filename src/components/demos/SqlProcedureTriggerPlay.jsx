import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  INITIAL_EMPLOYEES,
  PROCEDURE_STEPS,
  runProcedure,
  runTriggerUpdate,
} from '@/components/shared/kb/sqlProcedureTriggerEngine';
import styles from '@/components/demos/SqlProcedureTriggerPlay.module.css';

function SqlProcedureTriggerPlayInner() {
  const [tab, setTab] = useState('procedure');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [auditLog, setAuditLog] = useState([]);
  const [procStep, setProcStep] = useState(-1);
  const [outSalary, setOutSalary] = useState(null);
  const [empId, setEmpId] = useState(102);
  const [increase, setIncrease] = useState(5000);
  const [triggerSalary, setTriggerSalary] = useState(95000);
  const [highlightId, setHighlightId] = useState(null);

  const runProc = () => {
    setProcStep(0);
    const timers = [];
    PROCEDURE_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setProcStep(i), i * 700),
      );
    });
    timers.push(
      setTimeout(() => {
        const res = runProcedure(employees, empId, increase);
        if (!res.error) {
          setEmployees(res.employees);
          setOutSalary(res.newSalary);
          setHighlightId(empId);
        }
        setProcStep(PROCEDURE_STEPS.length);
      }, PROCEDURE_STEPS.length * 700),
    );
  };

  const fireTrigger = () => {
    const res = runTriggerUpdate(employees, 103, triggerSalary, auditLog);
    if (!res.blocked) {
      setEmployees(res.employees);
      setAuditLog(res.auditLog);
      setHighlightId(103);
    }
  };

  const reset = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setAuditLog([]);
    setProcStep(-1);
    setOutSalary(null);
    setHighlightId(null);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Хранимые процедуры и триггеры"
        subtitle="CALL с IN/OUT на сервере и автоматический AFTER UPDATE в журнал"
      >
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'procedure' && styles.tabActive)}
            onClick={() => setTab('procedure')}
          >
            Процедура
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'trigger' && styles.tabActive)}
            onClick={() => setTab('trigger')}
          >
            Триггер
          </button>
        </div>

        {tab === 'procedure' ? (
          <>
            <div className={styles.flow}>
              <span className={styles.flowBox}>Клиент</span>
              <span>→</span>
              <span className={clsx(styles.flowBox, procStep >= 0 && styles.flowBoxActive)}>CALL</span>
              <span>→</span>
              <span className={clsx(styles.flowBox, procStep >= 1 && styles.flowBoxActive)}>СУБД</span>
              <span>→</span>
              <span className={clsx(styles.flowBox, outSalary != null && styles.flowBoxActive)}>
                @new_salary={outSalary ?? '?'}
              </span>
            </div>
            <div className={styles.params}>
              <div className={styles.param}>
                <label>IN emp_id</label>
                <input
                  type="number"
                  value={empId}
                  onChange={(e) => setEmpId(Number(e.target.value))}
                />
              </div>
              <div className={styles.param}>
                <label>IN increase</label>
                <input
                  type="number"
                  value={increase}
                  onChange={(e) => setIncrease(Number(e.target.value))}
                />
              </div>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runProc}>
                CALL UpdateSalary
              </button>
            </div>
            {procStep >= 0 && procStep < PROCEDURE_STEPS.length && (
              <div className={styles.stepPanel}>
                <strong>{PROCEDURE_STEPS[procStep].label}</strong>
                {PROCEDURE_STEPS[procStep].detail}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="it-demo__hint" style={{marginTop: 0}}>
              AFTER UPDATE ON employees → INSERT INTO user_log (OLD/NEW salary)
            </p>
            <div className={styles.params}>
              <div className={styles.param}>
                <label>NEW salary (id=103)</label>
                <input
                  type="number"
                  value={triggerSalary}
                  onChange={(e) => setTriggerSalary(Number(e.target.value))}
                />
              </div>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={fireTrigger}>
                UPDATE employees
              </button>
            </div>
          </>
        )}

        <div className={styles.grid} style={{marginTop: '0.75rem'}}>
          <div>
            <p style={{fontWeight: 600, fontSize: '0.8rem', margin: '0 0 0.35rem'}}>employees</p>
            <div className={styles.panel}>
              {employees.map((e) => (
                <div
                  key={e.id}
                  className={clsx(styles.row, highlightId === e.id && styles.rowChanged)}
                >
                  <span>{e.id}</span>
                  <span>{e.name}</span>
                  <span>{e.salary.toLocaleString('ru-RU')}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{fontWeight: 600, fontSize: '0.8rem', margin: '0 0 0.35rem'}}>user_log (триггер)</p>
            <div className={styles.panel}>
              {auditLog.length === 0 ? (
                <span style={{color: 'var(--ifm-color-emphasis-600)'}}>пусто</span>
              ) : (
                auditLog.map((a) => (
                  <div key={a.id} className={styles.row} style={{gridTemplateColumns: '1fr'}}>
                    #{a.id} user={a.user_id} {a.old_salary}→{a.new_salary} @ {a.time}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          style={{marginTop: '0.65rem'}}
          onClick={reset}
        >
          Сбросить
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default SqlProcedureTriggerPlayInner;
