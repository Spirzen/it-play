import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/IntegrationDataFlowPlay.module.css';

const FLOW_TYPES = [
  {id: 'sync', label: 'Синхронный', desc: 'Клиент ждёт ответа (REST request-response).'},
  {id: 'async', label: 'Асинхронный', desc: 'Сообщение в очередь, ack позже.'},
  {id: 'etl', label: 'ETL', desc: 'Извлечь → преобразовать → загрузить в несколько систем.'},
  {id: 'saga', label: 'Saga', desc: 'Цепочка шагов с компенсацией при сбое.'},
];

const STAGES = ['trigger', 'queue', 'validate', 'transform', 'route', 'deliver'];

const SAMPLE = {
  trigger: '{"event":"order.pay","user":"u42"}',
  queue: 'orders.raw (буфер)',
  validate: 'сумма > 0, email OK',
  transform: 'userId → customerId, +timestamp',
  route: 'RU → 1С, EU → SAP',
  deliver: 'orders.validated → сервис заказов',
};

function IntegrationDataFlowPlayInner() {
  const [flowId, setFlowId] = useState('async');
  const [stageIdx, setStageIdx] = useState(0);
  const [invalid, setInvalid] = useState(false);

  const flow = FLOW_TYPES.find((f) => f.id === flowId) ?? FLOW_TYPES[1];
  const activeStages = useMemo(() => {
    if (flowId === 'sync') return ['trigger', 'deliver'];
    if (flowId === 'saga') return ['trigger', 'validate', 'deliver'];
    return STAGES;
  }, [flowId]);

  const current = activeStages[Math.min(stageIdx, activeStages.length - 1)];
  const failed = invalid && current === 'validate';

  const advance = () => {
    if (stageIdx >= activeStages.length - 1) {
      setStageIdx(0);
      setInvalid(false);
      return;
    }
    setStageIdx((i) => i + 1);
  };

  return (
    <DemoShell>
      <DemoCard title="Интеграционный поток данных" subtitle={flow.desc}>
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {FLOW_TYPES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(toolStyles.chip, flowId === f.id && toolStyles.chipActive)}
              onClick={() => {
                setFlowId(f.id);
                setStageIdx(0);
                setInvalid(false);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.pipeline}>
          {activeStages.map((id, i) => (
            <React.Fragment key={id}>
              {i > 0 && (
                <span className={styles.arrow} aria-hidden>
                  →
                </span>
              )}
              <div
                className={clsx(
                  styles.node,
                  i === stageIdx && styles.nodeActive,
                  failed && id === 'validate' && styles.nodeFail,
                )}
              >
                {id}
              </div>
            </React.Fragment>
          ))}
        </div>

        <p className={styles.payload}>
          {failed ? 'DLQ: orders.invalid — email пустой' : SAMPLE[current] ?? '—'}
        </p>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={advance}>
            {stageIdx >= activeStages.length - 1 ? 'Сброс потока' : 'Следующий этап'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => setInvalid((v) => !v)}
          >
            {invalid ? 'Валидные данные' : 'Сломать валидацию'}
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default IntegrationDataFlowPlayInner;
