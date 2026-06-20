import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/OwaspLlmTop10Play.module.css';

const ITEMS = [
  {id: 'l01', rank: 'LLM01', title: 'Prompt Injection', detail: 'Враждебные инструкции в user-контенте или через RAG-документ.', fix: 'Разделение ролей, санитизация, guardrails, HITL на tools.'},
  {id: 'l02', rank: 'LLM02', title: 'Sensitive Information Disclosure', detail: 'Утечка PII, секретов, внутренних данных из промпта или RAG.', fix: 'Классификация данных, ZDR, redaction в логах.'},
  {id: 'l03', rank: 'LLM03', title: 'Supply Chain', detail: 'Компрометация моделей, пакетов, провайдеров.', fix: 'Проверка артефактов, SBOM, доверенные репозитории.'},
  {id: 'l04', rank: 'LLM04', title: 'Data and Model Poisoning', detail: 'Отравление fine-tuning, индекса, обучающих данных.', fix: 'Происхождение данных, eval на poison, изоляция индекса.'},
  {id: 'l05', rank: 'LLM05', title: 'Improper Output Handling', detail: 'Вывод LLM без валидации попадает в SQL/shell/XSS.', fix: 'Параметризация, CSP, sandbox, schema validation.'},
  {id: 'l06', rank: 'LLM06', title: 'Excessive Agency', detail: 'Слишком много прав у агента и tools.', fix: 'Least privilege, approval gates, песочница.'},
  {id: 'l07', rank: 'LLM07', title: 'System Prompt Leakage', detail: 'Утечка system prompt и схем tools.', fix: 'Мониторинг exfil, rotate prompts.'},
  {id: 'l08', rank: 'LLM08', title: 'Vector Weaknesses', detail: 'Атаки на RAG, индекс, эмбеддинги.', fix: 'ACL на чанки, hybrid search.'},
  {id: 'l09', rank: 'LLM09', title: 'Misinformation', detail: 'Уверенные галлюцинации в решениях.', fix: 'RAG, citations, human review.'},
  {id: 'l10', rank: 'LLM10', title: 'Unbounded Consumption', detail: 'DoS по токенам, бюджету, agent loop.', fix: 'Rate limits, max_tokens, cost caps.'},
];

function OwaspLlmTop10PlayInner() {
  const [active, setActive] = useState(ITEMS[0].id);
  const item = ITEMS.find((x) => x.id === active) ?? ITEMS[0];

  return (
    <DemoShell className={shared.rootWide}>
      <DemoCard title="OWASP LLM Top 10" subtitle="Риски GenAI (2025) — карточка, суть и контрмеры">
        <div className={styles.grid}>
          {ITEMS.map((it) => (
            <button
              key={it.id}
              type="button"
              className={clsx(styles.item, active === it.id && styles.itemActive)}
              onClick={() => setActive(it.id)}
              aria-pressed={active === it.id}
            >
              <span className={styles.rank}>{it.rank}</span>
              <span className={styles.title}>{it.title}</span>
            </button>
          ))}
        </div>

        <div className={shared.detailCard}>
          <p>
            <strong>{item.rank}: {item.title}</strong>
            <br />
            {item.detail}
          </p>
          <p className={styles.fix}>
            <strong>Контрмеры:</strong> {item.fix}
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default OwaspLlmTop10PlayInner;
