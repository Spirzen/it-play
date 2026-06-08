import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ROLLOUT_STAGES, SAMPLE_ORDERS} from '@/components/shared/kb/lowCodeRolloutEngine';
import styles from '@/components/demos/LowCodeRolloutPlay.module.css';

function LowCodeRolloutPlayInner() {
  const [stageIdx, setStageIdx] = useState(1);
  const stage = ROLLOUT_STAGES[stageIdx];
  const {ui} = stage;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Внедрение Low-Code по этапам"
        subtitle="Прокрутите дорожную карту — в макете появляются форма, уведомления, правила и интеграции"
      >
        <input
          type="range"
          min={0}
          max={ROLLOUT_STAGES.length - 1}
          value={stageIdx}
          onChange={(e) => setStageIdx(Number(e.target.value))}
          className={styles.slider}
          aria-label="Этап внедрения"
        />
        <div className={styles.stageTitle}>{stage.title}</div>

        <ul className={styles.deliverables}>
          {stage.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <div className={styles.mockApp}>
          <div className={styles.mockHeader}>Портал заявок (low-code)</div>
          <div className={styles.mockBody}>
            {ui.form ? (
              <div className={styles.panel}>
                <strong>Форма "Новый заказ"</strong>
                <input readOnly placeholder="Клиент" value="ООО Ромашка" />
                <input readOnly placeholder="Сумма" value="12 400 ₽" />
                <button type="button" className="it-demo__btn it-demo__btn--sm">
                  Отправить
                </button>
              </div>
            ) : (
              <div className={clsx(styles.panel, styles.panelOff)}>Форма — на бумаге / в Excel</div>
            )}

            {ui.table ? (
              <div className={styles.panel}>
                <strong>Заявки</strong>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Клиент</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_ORDERS.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.client}</td>
                        <td>{o.sum.toLocaleString('ru-RU')} ₽</td>
                        <td>{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={clsx(styles.panel, styles.panelOff)}>Единого списка заявок нет</div>
            )}
          </div>

          <div className={styles.mockFooter}>
            <span className={clsx(styles.pill, ui.notify && styles.pillOn)}>🔔 Уведомления</span>
            <span className={clsx(styles.pill, ui.rules && styles.pillOn)}>⚙️ Бизнес-правила</span>
            <span className={clsx(styles.pill, ui.integrations && styles.pillOn)}>🔗 Интеграции</span>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LowCodeRolloutPlayInner;
