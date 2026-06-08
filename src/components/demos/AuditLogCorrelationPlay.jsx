import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AuditLogCorrelationPlay.module.css';

const INCIDENT_ID = 'INC-2026-0412';

const EVENTS = [
  {id: 'e1', source: 'IAM', time: '09:14:02', text: 'login success user=admin ip=203.0.113.5', link: true},
  {id: 'e2', source: 'WAF', time: '09:14:18', text: 'POST /api/export size=48MB', link: true},
  {id: 'e3', source: 'DB', time: '09:14:19', text: 'SELECT * FROM customers LIMIT 500000', link: true},
  {id: 'e4', source: 'IAM', time: '09:22:01', text: 'login failed user=guest', link: false},
  {id: 'e5', source: 'Proxy', time: '09:14:21', text: 'upload to cloud-storage.example', link: true},
  {id: 'e6', source: 'EDR', time: '09:30:00', text: 'scheduled backup started', link: false},
];

function AuditLogCorrelationPlayInner() {
  const [selected, setSelected] = useState(['e1', 'e2', 'e3', 'e5']);

  const toggle = (id, link) => {
    if (!link) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].sort(),
    );
  };

  const hint = useMemo(() => {
    const linked = EVENTS.filter((e) => e.link);
    const picked = linked.filter((e) => selected.includes(e.id));
    if (picked.length === linked.length) {
      return `Корреляция по ${INCIDENT_ID}: единая цепочка — вход admin → массовый export → выгрузка в облако. Время реакции: изоляция учётки + блок IP.`;
    }
    if (picked.length < 2) {
      return 'Выберите связанные события (подсвечены зелёным при клике) — постройте временную цепочку инцидента.';
    }
    return `Частичная цепочка (${picked.length}/${linked.length}). SIEM объединяет логи IAM, WAF, БД и прокси по correlation_id и времени.`;
  }, [selected]);

  return (
    <DemoShell>
      <DemoCard
        title="Корреляция журналов аудита"
        subtitle="Соберите цепочку из разных источников — как в SIEM при расследовании"
      >
        <div className={styles.sources}>
          {['IAM', 'WAF', 'DB', 'Proxy', 'EDR'].map((src) => (
            <div key={src} className={styles.source}>
              <strong>{src}</strong>
              {EVENTS.filter((e) => e.source === src).map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={clsx(
                    styles.event,
                    selected.includes(e.id) && e.link && styles.eventLinked,
                  )}
                  onClick={() => toggle(e.id, e.link)}
                  disabled={!e.link}
                  title={e.link ? 'Включить в цепочку' : 'Не связано с инцидентом'}
                >
                  {e.time} — {e.text}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.timeline} aria-label="Временная шкала">
          {selected
            .map((id) => EVENTS.find((e) => e.id === id))
            .filter(Boolean)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((e) => (
              <span key={e.id} className={styles.chip}>
                {e.time} {e.source}
              </span>
            ))}
        </div>

        <p className={styles.hint}>{hint}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default AuditLogCorrelationPlayInner;
