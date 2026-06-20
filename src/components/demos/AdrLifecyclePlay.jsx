import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectStatusRow,
  ProjectForm,
  ProjectField,
  ProjectCodeBlock,
  ProjectMessage,
  ProjectBtnRow,
  ADR_STATUS_CLASS,
} from '@/components/shared/kb/projectPlayKit';

const TEMPLATE = {
  title: 'ADR-003: Кэш сессий в Redis',
  context:
    'Рост нагрузки на auth-сервис; сессии в памяти не масштабируются горизонтально. NFR: p99 < 200ms, multi-instance.',
  decision: 'Использовать Redis для хранения сессий с TTL 24ч; sticky sessions не используем.',
  consequences:
    '+ Горизонтальное масштабирование.\n− Новая зависимость, нужен мониторинг Redis.\n− План миграции с in-memory.',
};

function AdrLifecyclePlayInner() {
  const [status, setStatus] = useState('Proposed');
  const [fields, setFields] = useState(TEMPLATE);
  const [chain, setChain] = useState(['ADR-003']);
  const [preview, setPreview] = useState(false);

  const setField = (key, value) => setFields((f) => ({...f, [key]: value}));

  const accept = () => setStatus('Accepted');
  const supersede = () => {
    setStatus('Superseded');
    setChain((c) => [...c, 'ADR-007: Redis Cluster + sentinel']);
  };

  const reset = () => {
    setStatus('Proposed');
    setFields(TEMPLATE);
    setChain(['ADR-003']);
    setPreview(false);
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="ADR — жизненный цикл" subtitle="Шаблон Nygard и статусы в Git">
        <ProjectStack>
          <ProjectStatusRow status={status} statusClass={ADR_STATUS_CLASS[status]} chain={chain.join(' → ')} />

          <ProjectForm>
            <ProjectField label="Заголовок">
              <input type="text" value={fields.title} onChange={(e) => setField('title', e.target.value)} />
            </ProjectField>
            <ProjectField label="Контекст">
              <textarea rows={3} value={fields.context} onChange={(e) => setField('context', e.target.value)} />
            </ProjectField>
            <ProjectField label="Решение">
              <textarea rows={2} value={fields.decision} onChange={(e) => setField('decision', e.target.value)} />
            </ProjectField>
            <ProjectField label="Последствия">
              <textarea rows={3} value={fields.consequences} onChange={(e) => setField('consequences', e.target.value)} />
            </ProjectField>
          </ProjectForm>

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={accept} disabled={status !== 'Proposed'}>
              Accept
            </button>
            <button type="button" className="it-demo__btn" onClick={supersede} disabled={status !== 'Accepted'}>
              Supersede → ADR-007
            </button>
            <button type="button" className="it-demo__btn" onClick={() => setPreview((p) => !p)}>
              {preview ? 'Скрыть' : 'Preview'} markdown
            </button>
            <button type="button" className="it-demo__btn" onClick={reset}>
              Сброс
            </button>
          </ProjectBtnRow>

          {preview && (
            <ProjectCodeBlock>
              {`# ${fields.title}\n\n## Status\n${status}\n\n## Context\n${fields.context}\n\n## Decision\n${fields.decision}\n\n## Consequences\n${fields.consequences}`}
            </ProjectCodeBlock>
          )}

          {status === 'Superseded' && (
            <ProjectMessage tone="ok">Старый ADR остаётся в Git для истории — новый ADR ссылается на этот.</ProjectMessage>
          )}
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default AdrLifecyclePlayInner;
