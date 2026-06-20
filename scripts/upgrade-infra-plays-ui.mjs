/**
 * Rewrite infra-security plays to use InfraPlayUi + InfraSecurityPlays.module.css
 * Run: node scripts/upgrade-infra-plays-ui.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const demosDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'components', 'demos');

const FILES = {
  SbomBlastRadiusPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, SbomGraph} from '@/components/shared/infra/InfraPlayUi';
import {SBOM_GRAPH} from '@/components/shared/kb/infraSecurityEngines';

function SbomBlastRadiusPlayInner() {
  const [pkgId, setPkgId] = useState('lodash');
  return (
    <DemoShell>
      <DemoCard title="SBOM — blast radius" subtitle="Выберите пакет с CVE и посмотрите, какие сервисы попадают в зону поражения">
        <InfraRoot>
          <SbomGraph packages={SBOM_GRAPH.packages} services={SBOM_GRAPH.services} pkgId={pkgId} onSelectPkg={setPkgId} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default SbomBlastRadiusPlayInner;
`,

  WebauthnChallengePlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, FlowStepper, Section, Alert} from '@/components/shared/infra/InfraPlayUi';
import {WEBAUTHN_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function WebauthnChallengePlayInner() {
  const [mode, setMode] = useState('register');
  const [step, setStep] = useState(0);
  const flow = WEBAUTHN_STEPS.find((f) => f.id === mode);

  return (
    <DemoShell>
      <DemoCard title="WebAuthn challenge flow" subtitle="Пароль по сети не уходит — только криптографическая подпись challenge">
        <InfraRoot>
          <Section label="Сценарий">
            <div className={s.chipRow}>
              {WEBAUTHN_STEPS.map((f) => (
                <button key={f.id} type="button" className={\`\${s.chip} \${mode === f.id ? s.chipActive : ''}\`} onClick={() => { setMode(f.id); setStep(0); }}>{f.label}</button>
              ))}
            </div>
          </Section>
          <FlowStepper steps={flow.steps.map((label, i) => ({id: i, label: \`\${i + 1}. \${label.split(' ')[0]}…\`}))} activeIndex={step} onSelect={setStep} scroll />
          <Section label={flow.steps[step]}>
            <ol className={s.stackList}>
              {flow.steps.map((line, i) => (
                <li key={line} className={\`\${s.stackItem} \${i > step ? s.graphNodeMuted : ''}\`} style={{listStyle: 'none'}}>{line}</li>
              ))}
            </ol>
          </Section>
          <Alert>Origin и rpId привязаны к домену — фишинговый клон не сможет использовать ключ.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default WebauthnChallengePlayInner;
`,

  SecurityGatePipelinePlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, LayerList, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {DEVSECOPS_GATES, simulateGates} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function SecurityGatePipelinePlayInner() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(DEVSECOPS_GATES.map((l) => [l.id, l.defaultOn])));
  const [run, setRun] = useState(null);
  const [running, setRunning] = useState(false);

  const toggle = (id) => { setEnabled((e) => ({...e, [id]: !e[id]})); setRun(null); };
  const execute = async () => {
    setRunning(true);
    setRun(null);
    await new Promise((r) => setTimeout(r, 450));
    setRun(simulateGates(DEVSECOPS_GATES, enabled));
    setRunning(false);
  };

  return (
    <DemoShell>
      <DemoCard title="DevSecOps security gates" subtitle="Включите слои shift-left и запустите симуляцию merge в prod">
        <InfraRoot>
          <LayerList layers={DEVSECOPS_GATES} enabled={enabled} results={run?.results} onToggle={toggle} />
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={execute} disabled={running}>{running ? 'Пайплайн…' : 'Запустить gates'}</button>
            {run && <span className={\`\${s.resultLine} \${run.ok ? s.resultOk : s.resultBad}\`}>{run.ok ? 'Deploy разрешён' : 'Pipeline failed — merge заблокирован'}</span>}
          </ActionRow>
          {run && !run.ok && <Alert tone="error">Включите SAST, secret scan и SBOM — без них риск supply chain в prod.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default SecurityGatePipelinePlayInner;
`,

  GitopsReconcilePlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, CodeGrid, StatusPill, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {GITOPS_CLUSTER, GITOPS_MANIFEST} from '@/components/shared/kb/infraSecurityEngines';

function GitopsReconcilePlayInner() {
  const [drift, setDrift] = useState(false);
  const synced = !drift;

  return (
    <DemoShell>
      <DemoCard title="GitOps reconcile" subtitle="Git — единственный источник истины; ручной kubectl создаёт drift">
        <InfraRoot>
          <StatusPill tone={synced ? 'success' : 'error'}>{synced ? 'Synced' : 'OutOfSync'}</StatusPill>
          <CodeGrid panes={[
            {label: 'Git (desired)', code: GITOPS_MANIFEST},
            {label: 'Cluster (actual)', code: drift ? GITOPS_CLUSTER : GITOPS_MANIFEST, diff: drift},
          ]} />
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => setDrift(true)}>kubectl set image</button>
            <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => setDrift(false)}>Sync from Git</button>
          </ActionRow>
          {drift && <Alert tone="warn">Drift: кластер отличается от Git. Revert commit или Sync приведёт prod к аудируемому состоянию.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default GitopsReconcilePlayInner;
`,

  RuCloudPickerPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatPanel, Alert} from '@/components/shared/infra/InfraPlayUi';
import {RU_CLOUD_SCENARIOS, RU_PROVIDERS} from '@/components/shared/kb/infraSecurityEngines';

function RuCloudPickerPlayInner() {
  const [id, setId] = useState(RU_CLOUD_SCENARIOS[0].id);
  const sc = RU_CLOUD_SCENARIOS.find((s) => s.id === id);
  const provider = RU_PROVIDERS[sc.best];

  return (
    <DemoShell>
      <DemoCard title="Облака РФ — подбор провайдера" subtitle="Сценарий → рекомендация с trade-offs для pet-проекта и compliance">
        <InfraRoot>
          <ChipRow scroll>
            {RU_CLOUD_SCENARIOS.map((item) => (
              <Chip key={item.id} active={id === item.id} onClick={() => setId(item.id)}>{item.label}</Chip>
            ))}
          </ChipRow>
          <StatPanel rows={[
            {key: 'Рекомендация', value: provider.name},
            {key: 'Почему', value: sc.why},
            {key: 'Теги сценария', value: sc.need.join(', ')},
          ]} />
          <Alert>Для 152-ФЗ важны ЦОД в РФ, IAM и audit — не только цена за vCPU.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default RuCloudPickerPlayInner;
`,

  GoldenPathBuilderPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StackList, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {GOLDEN_PATHS} from '@/components/shared/kb/infraSecurityEngines';

function GoldenPathBuilderPlayInner() {
  const [id, setId] = useState(GOLDEN_PATHS[0].id);
  const path = GOLDEN_PATHS.find((p) => p.id === id);

  return (
    <DemoShell>
      <DemoCard title="Platform Engineering — golden path" subtitle="Self-service шаблон: репозиторий, CI, observability из коробки">
        <InfraRoot>
          <ChipRow>
            {GOLDEN_PATHS.map((p) => (
              <Chip key={p.id} active={id === p.id} onClick={() => setId(p.id)}>{p.label}</Chip>
            ))}
          </ChipRow>
          <StackList items={path.stack} />
          <StatPanel rows={[{key: 'До первого deploy', value: path.time}]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default GoldenPathBuilderPlayInner;
`,

  PromptInjectionSandboxPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatusPill, Alert, Section} from '@/components/shared/infra/InfraPlayUi';
import {PROMPT_SCENARIOS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function PromptInjectionSandboxPlayInner() {
  const [id, setId] = useState(PROMPT_SCENARIOS[0].id);
  const [sandbox, setSandbox] = useState(true);
  const sc = PROMPT_SCENARIOS.find((x) => x.id === id);
  const blocked = sc.poisoned && sandbox;

  return (
    <DemoShell>
      <DemoCard title="Prompt injection sandbox" subtitle="MCP-агент с tool allowlist — опасные вызовы блокируются">
        <InfraRoot>
          <ChipRow>
            {PROMPT_SCENARIOS.map((x) => (
              <Chip key={x.id} active={id === x.id} warn={x.poisoned} onClick={() => setId(x.id)}>{x.id}</Chip>
            ))}
          </ChipRow>
          <label className={s.layerRow} style={{gridTemplateColumns: 'auto 1fr'}}>
            <input type="checkbox" checked={sandbox} onChange={(e) => setSandbox(e.target.checked)} />
            <span>Tool sandbox + allowlist</span>
          </label>
          <Section label="User input">
            <pre className={s.codeBlock}>{sc.input}</pre>
          </Section>
          {sc.toolCall && (
            <StatusPill tone={blocked ? 'error' : 'warn'}>
              {blocked ? \`Blocked: \${sc.toolCall}\` : \`Allowed: \${sc.toolCall}\`}
            </StatusPill>
          )}
          {!sandbox && sc.poisoned && <Alert tone="error">Без sandbox агент с admin kubeconfig выполнит деструктивную команду.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PromptInjectionSandboxPlayInner;
`,

  PkceAuthCodeFlowPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, FlowStepper, Section, Alert} from '@/components/shared/infra/InfraPlayUi';
import {PKCE_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function PkceAuthCodeFlowPlayInner() {
  const [step, setStep] = useState(0);
  const current = PKCE_STEPS[step];

  return (
    <DemoShell>
      <DemoCard title="Authorization Code + PKCE" subtitle="Безопасный OAuth 2.0 для SPA и mobile — без client secret в браузере">
        <InfraRoot>
          <FlowStepper steps={PKCE_STEPS} activeIndex={step} onSelect={setStep} scroll />
          <div className={s.panel}>
            <strong>{current.label}</strong>
            <p style={{margin: '0.35rem 0 0', fontSize: '0.84rem', lineHeight: 1.45}}>{current.detail}</p>
          </div>
          <Alert>PKCE: code_verifier хранится только на клиенте; перехват authorization code без verifier бесполезен.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PkceAuthCodeFlowPlayInner;
`,

  GatewayRoutePolicyPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, SliderField, StatusPill, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {GATEWAY_ROUTES} from '@/components/shared/kb/infraSecurityEngines';

function GatewayRoutePolicyPlayInner() {
  const [path, setPath] = useState(GATEWAY_ROUTES[0].path);
  const [hasToken, setHasToken] = useState(true);
  const [rps, setRps] = useState(50);
  const route = GATEWAY_ROUTES.find((r) => r.path === path);
  const rateLimited = rps > route.limit;
  const unauthorized = route.auth && !hasToken;
  const denied = unauthorized || rateLimited;

  return (
    <DemoShell>
      <DemoCard title="API Gateway — маршрут и политики" subtitle="Path → backend, JWT и rate limit на периметре">
        <InfraRoot>
          <ChipRow scroll>
            {GATEWAY_ROUTES.map((r) => (
              <Chip key={r.path} active={path === r.path} onClick={() => setPath(r.path)}>{r.path}</Chip>
            ))}
          </ChipRow>
          <SliderField label="Запросов в секунду" value={rps} min={1} max={250} onChange={setRps} displayValue={\`\${rps} rps (limit \${route.limit})\`} />
          <label style={{display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.84rem'}}>
            <input type="checkbox" checked={hasToken} onChange={(e) => setHasToken(e.target.checked)} /> Bearer JWT
          </label>
          <StatusPill tone={denied ? 'error' : 'success'}>
            {unauthorized ? '401 Unauthorized' : rateLimited ? '429 Too Many Requests' : \`→ \${route.backend}\`}
          </StatusPill>
          <StatPanel rows={[
            {key: 'Backend', value: route.backend},
            {key: 'Auth required', value: route.auth ? 'да' : 'нет'},
          ]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default GatewayRoutePolicyPlayInner;
`,

  StrideThreatModelPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, CardGrid, Alert} from '@/components/shared/infra/InfraPlayUi';
import {STRIDE_ELEMENTS} from '@/components/shared/kb/infraSecurityEngines';

const STRIDE_LETTERS = ['S', 'T', 'R', 'I', 'D', 'E'];
const STRIDE_NAMES = {S: 'Spoofing', T: 'Tampering', R: 'Repudiation', I: 'Info disclosure', D: 'DoS', E: 'Elevation'};

function StrideThreatModelPlayInner() {
  const [elId, setElId] = useState(STRIDE_ELEMENTS[0].id);
  const [letter, setLetter] = useState('S');
  const el = STRIDE_ELEMENTS.find((e) => e.id === elId);

  return (
    <DemoShell>
      <DemoCard title="STRIDE threat modeling" subtitle="Компонент архитектуры → угроза и контроль на этапе дизайна">
        <InfraRoot>
          <CardGrid items={STRIDE_ELEMENTS.map((e) => ({id: e.id, title: e.label}))} activeId={elId} onSelect={setElId} />
          <ChipRow>
            {STRIDE_LETTERS.map((l) => (
              <Chip key={l} active={letter === l} onClick={() => setLetter(l)} title={STRIDE_NAMES[l]}>{l}</Chip>
            ))}
          </ChipRow>
          <Alert tone="warn"><strong>{el.label} · {STRIDE_NAMES[letter]}</strong> — {el.threats[letter]}</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default StrideThreatModelPlayInner;
`,

  PhishingRedFlagsPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, QuizPanel, Section} from '@/components/shared/infra/InfraPlayUi';
import {PHISHING_EMAILS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function PhishingRedFlagsPlayInner() {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const email = PHISHING_EMAILS[idx];

  const check = (isPhish) => {
    const ok = isPhish === !email.safe;
    setFeedback({ok, text: ok ? \`Верно. Flags: \${email.flags.join(', ') || 'корпоративный домен OK'}\` : \`Неверно. Подсказка: \${email.flags.join(', ') || 'легитимный отправитель'}\`});
  };

  return (
    <DemoShell>
      <DemoCard title="Фишинг — red flags" subtitle="Учебные письма без реальных ссылок — тренируйте внимание команды">
        <InfraRoot>
          <QuizPanel
            feedback={feedback?.text}
            feedbackOk={feedback?.ok}
            actions={<>
              <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => check(true)}>Фишинг</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => check(false)}>Легитимно</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => { setIdx((i) => (i + 1) % PHISHING_EMAILS.length); setFeedback(null); }}>Следующее</button>
            </>}
          >
            <Section label="From"><strong>{email.from}</strong></Section>
            <Section label="Subject">{email.subject}</Section>
          </QuizPanel>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PhishingRedFlagsPlayInner;
`,

  InfraLifecyclePlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, Pipeline, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {INFRA_LIFECYCLE} from '@/components/shared/kb/infraSecurityEngines';

function InfraLifecyclePlayInner() {
  const [active, setActive] = useState(0);
  const node = INFRA_LIFECYCLE[active];

  return (
    <DemoShell>
      <DemoCard title="Путь кода к пользователю" subtitle="От коммита до prod — роли и ответственность на каждом этапе">
        <InfraRoot>
          <Pipeline steps={INFRA_LIFECYCLE.map((n) => n.label)} activeIndex={active} onSelect={setActive} vertical />
          <StatPanel rows={[
            {key: 'Этап', value: node.label},
            {key: 'Роль', value: node.role},
            {key: 'Действия', value: node.detail},
          ]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default InfraLifecyclePlayInner;
`,

  DevStagingProdPlay: `import React from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, DataTable} from '@/components/shared/infra/InfraPlayUi';
import {ENV_COMPARE} from '@/components/shared/kb/infraSecurityEngines';

function DevStagingProdPlayInner() {
  return (
    <DemoShell>
      <DemoCard title="dev / staging / prod" subtitle="Среды отличаются не только URL — данные, секреты и политика деплоя">
        <InfraRoot>
          <DataTable
            columns={['Параметр', 'dev', 'staging', 'prod']}
            rows={ENV_COMPARE.map((row) => ({key: row.key, cells: [row.key, row.dev, row.staging, row.prod]}))}
          />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default DevStagingProdPlayInner;
`,

  ScalingWhenPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, CardGrid, Alert, ActionRow} from '@/components/shared/infra/InfraPlayUi';
import {SCALING_TREE} from '@/components/shared/kb/infraSecurityEngines';

function ScalingWhenPlayInner() {
  const [idx, setIdx] = useState(0);
  const item = SCALING_TREE[idx];

  return (
    <DemoShell>
      <DemoCard title="Масштабирование по сигналу" subtitle="Усложняйте стек по измеренному узкому месту, а не по моде">
        <InfraRoot>
          <CardGrid items={SCALING_TREE.map((x, i) => ({id: String(i), title: x.signal.split(' ').slice(0, 4).join(' ') + '…', meta: \`#\${i + 1}\`}))} activeId={String(idx)} onSelect={(id) => setIdx(Number(id))} />
          <Alert tone="success">✓ {item.action}</Alert>
          <Alert tone="error">✗ Антипаттерн: {item.wrong}</Alert>
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => setIdx((i) => (i + 1) % SCALING_TREE.length)}>Следующий сигнал</button>
          </ActionRow>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default ScalingWhenPlayInner;
`,

  IncidentResponsePlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, FlowStepper, Section, ActionRow} from '@/components/shared/infra/InfraPlayUi';
import {INCIDENT_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function IncidentResponsePlayInner() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell>
      <DemoCard title="Инцидент → rollback" subtitle="Алерт, триаж, откат деплоя и postmortem">
        <InfraRoot>
          <FlowStepper steps={INCIDENT_STEPS} activeIndex={step} onSelect={setStep} scroll />
          <Section label="Лог / действие">
            <pre className={s.codeBlock}>{INCIDENT_STEPS[step].log}</pre>
          </Section>
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= INCIDENT_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Далее</button>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Назад</button>
          </ActionRow>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default IncidentResponsePlayInner;
`,

  ArgocdAppStatusPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, Alert, StatusPill} from '@/components/shared/infra/InfraPlayUi';
import {ARGO_STATUSES} from '@/components/shared/kb/infraSecurityEngines';

const STATUS_COPY = {
  Synced: {tone: 'success', text: 'Кластер совпадает с Git. Health: Healthy.'},
  OutOfSync: {tone: 'error', text: 'Drift: image tag отличается. Нужен Sync или revert commit в Git.'},
  Progressing: {tone: 'warn', text: 'Rolling update: 1/3 pods ready — дождитесь завершения.'},
  Degraded: {tone: 'error', text: 'CrashLoopBackOff — проверьте логи и манифест Application.'},
};

function ArgocdAppStatusPlayInner() {
  const [status, setStatus] = useState('Synced');
  const meta = STATUS_COPY[status];

  return (
    <DemoShell>
      <DemoCard title="Argo CD Application" subtitle="Synced / OutOfSync / Progressing / Degraded — что делать инженеру">
        <InfraRoot>
          <ChipRow scroll>
            {ARGO_STATUSES.map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
            ))}
          </ChipRow>
          <StatusPill tone={meta.tone}>{status}</StatusPill>
          <Alert tone={meta.tone === 'success' ? 'success' : meta.tone === 'warn' ? 'warn' : 'error'}>{meta.text}</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default ArgocdAppStatusPlayInner;
`,

  VaultUnsealFlowPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StackList, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {VAULT_MODES} from '@/components/shared/kb/infraSecurityEngines';

function VaultUnsealFlowPlayInner() {
  const [mode, setMode] = useState('dev');
  const [unsealed, setUnsealed] = useState(true);
  const cfg = VAULT_MODES[mode];

  return (
    <DemoShell>
      <DemoCard title="Vault: dev vs prod unseal" subtitle="Только lab использует -dev с root token в памяти">
        <InfraRoot>
          <ChipRow>
            <Chip active={mode === 'dev'} onClick={() => { setMode('dev'); setUnsealed(true); }}>dev</Chip>
            <Chip active={mode === 'prod'} onClick={() => { setMode('prod'); setUnsealed(false); }}>prod HA</Chip>
          </ChipRow>
          <StackList items={cfg.steps} />
          {mode === 'prod' && (
            <ActionRow>
              <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => setUnsealed(true)} disabled={unsealed}>Unseal (3/5 keys)</button>
            </ActionRow>
          )}
          <Alert tone={mode === 'dev' ? 'warn' : unsealed ? 'success' : 'error'}>
            {mode === 'dev' ? 'dev: auto-unseal, root token — только учебный стенд.' : unsealed ? 'Unsealed: KV и AppRole доступны.' : 'Sealed: секреты недоступны до unseal.'}
          </Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default VaultUnsealFlowPlayInner;
`,

  RtoRpoSliderPlay: `import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, SliderField, StatPanel, Alert} from '@/components/shared/infra/InfraPlayUi';

function RtoRpoSliderPlayInner() {
  const [backupHours, setBackupHours] = useState(6);
  const [restoreHours, setRestoreHours] = useState(1);
  const rpo = useMemo(() => \`до \${backupHours}ч транзакций при сбое\`, [backupHours]);
  const rto = useMemo(() => \`\${restoreHours}ч простоя до restore\`, [restoreHours]);

  return (
    <DemoShell>
      <DemoCard title="RTO / RPO слайдеры" subtitle="Частота бэкапа и время восстановления — две независимые оси DR">
        <InfraRoot>
          <SliderField label="Интервал бэкапа (RPO)" value={backupHours} min={1} max={24} onChange={setBackupHours} displayValue={\`\${backupHours}ч\`} />
          <SliderField label="Время restore (RTO)" value={restoreHours} min={0.5} max={8} step={0.5} onChange={setRestoreHours} displayValue={\`\${restoreHours}ч\`} />
          <StatPanel rows={[
            {key: 'RPO — потеря данных', value: rpo},
            {key: 'RTO — простой', value: rto},
          ]} />
          <Alert>Узкий RPO → чаще pg_dump или WAL; узкий RTO → отрепетированный runbook и готовые образы.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default RtoRpoSliderPlayInner;
`,

  CloudLeakCalculatorPlay: `import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, LeakList, Alert} from '@/components/shared/infra/InfraPlayUi';
import {CLOUD_LEAKS} from '@/components/shared/kb/infraSecurityEngines';

const MAX = CLOUD_LEAKS.reduce((s, l) => s + l.cost, 0);

function CloudLeakCalculatorPlayInner() {
  const [on, setOn] = useState(() => Object.fromEntries(CLOUD_LEAKS.map((l) => [l.id, false])));
  const total = useMemo(() => CLOUD_LEAKS.filter((l) => on[l.id]).reduce((s, l) => s + l.cost, 0), [on]);
  const toggle = (id) => setOn((o) => ({...o, [id]: !o[id]}));

  return (
    <DemoShell>
      <DemoCard title="FinOps — калькулятор утечек" subtitle="Забытые ресурсы pet-проекта — включайте и смотрите счёт">
        <InfraRoot>
          <LeakList items={CLOUD_LEAKS} on={on} onToggle={toggle} total={total} max={MAX} />
          {total > 50 && <Alert tone="error">Бюджетный alert на $15–25 поймал бы это до нуля на карте.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default CloudLeakCalculatorPlayInner;
`,

  PentestPtesPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, FlowStepper, StackList, Section} from '@/components/shared/infra/InfraPlayUi';
import {PTES_PHASES} from '@/components/shared/kb/infraSecurityEngines';

function PentestPtesPlayInner() {
  const [idx, setIdx] = useState(0);
  const phase = PTES_PHASES[idx];

  return (
    <DemoShell>
      <DemoCard title="PTES — фазы пентеста" subtitle="Pre-engagement → reporting — типовые инструменты на каждом этапе">
        <InfraRoot>
          <FlowStepper steps={PTES_PHASES} activeIndex={idx} onSelect={setIdx} scroll />
          <Section label={\`Инструменты: \${phase.label}\`}>
            <StackList items={phase.tools} />
          </Section>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PentestPtesPlayInner;
`,

  EngagementScopePlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {ENGAGEMENT_TYPES} from '@/components/shared/kb/infraSecurityEngines';

function EngagementScopePlayInner() {
  const [id, setId] = useState(ENGAGEMENT_TYPES[0].id);
  const t = ENGAGEMENT_TYPES.find((e) => e.id === id);

  return (
    <DemoShell>
      <DemoCard title="Black / grey / white box" subtitle="Один target — разный объём знаний и глубина находок">
        <InfraRoot>
          <ChipRow>
            {ENGAGEMENT_TYPES.map((e) => (
              <Chip key={e.id} active={id === e.id} onClick={() => setId(e.id)}>{e.label}</Chip>
            ))}
          </ChipRow>
          <StatPanel rows={[
            {key: 'Знания тестировщика', value: t.knowledge},
            {key: 'Что найдёт', value: t.finds},
            {key: 'Может пропустить', value: t.miss},
          ]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default EngagementScopePlayInner;
`,

  BugBountyScopeQuizPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, QuizPanel, StatusPill} from '@/components/shared/infra/InfraPlayUi';
import {BOUNTY_SCOPE} from '@/components/shared/kb/infraSecurityEngines';

function BugBountyScopeQuizPlayInner() {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const item = BOUNTY_SCOPE[idx];

  const answer = (inScope) => {
    const ok = inScope === item.inScope;
    setFeedback({ok, text: ok ? \`Верно: \${item.reason}\` : \`Неверно. \${item.reason}\`});
  };

  return (
    <DemoShell>
      <DemoCard title="Bug Bounty — in scope?" subtitle="Проверьте target перед тестом — out of scope = риск для вас">
        <InfraRoot>
          <QuizPanel
            feedback={feedback?.text}
            feedbackOk={feedback?.ok}
            actions={<>
              <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => answer(true)}>In scope</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => answer(false)}>Out of scope</button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => { setIdx((i) => (i + 1) % BOUNTY_SCOPE.length); setFeedback(null); }}>Следующий</button>
            </>}
          >
            <StatusPill tone="neutral">{item.target}</StatusPill>
          </QuizPanel>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default BugBountyScopeQuizPlayInner;
`,

  ResponsibleDisclosurePlay: `import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, SliderField, Timeline, Alert} from '@/components/shared/infra/InfraPlayUi';
import {DISCLOSURE_TIMELINE} from '@/components/shared/kb/infraSecurityEngines';

function ResponsibleDisclosurePlayInner() {
  const maxDay = DISCLOSURE_TIMELINE[DISCLOSURE_TIMELINE.length - 1].day;
  const [day, setDay] = useState(0);
  const events = useMemo(() => DISCLOSURE_TIMELINE.filter((e) => e.day <= day), [day]);

  return (
    <DemoShell>
      <DemoCard title="Coordinated disclosure" subtitle="День 0 — private report → день 90 — публичное раскрытие">
        <InfraRoot>
          <SliderField label="День с момента находки" value={day} min={0} max={maxDay} onChange={setDay} displayValue={\`D\${day}\`} />
          <Timeline events={events} maxDay={day} />
          <Alert>Стандарт: 90 дней на patch до публикации; bounty после fix в prod.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default ResponsibleDisclosurePlayInner;
`,

  K8sTrafficPathPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, Pipeline, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {K8S_TRAFFIC_STEPS} from '@/components/shared/kb/infraSecurityEngines';

function K8sTrafficPathPlayInner() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell>
      <DemoCard title="Сетевой путь в Kubernetes" subtitle="Client → Ingress → Service → kube-proxy → Pod">
        <InfraRoot>
          <Pipeline steps={K8S_TRAFFIC_STEPS} activeIndex={step} onSelect={setStep} vertical />
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= K8S_TRAFFIC_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Следующий hop</button>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Назад</button>
          </ActionRow>
          {step === 3 && <Alert>kube-proxy применяет DNAT: ClusterIP → IP одного из Pod-бэкендов.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default K8sTrafficPathPlayInner;
`,

  SharedResponsibilityPlay: `import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, Alert} from '@/components/shared/infra/InfraPlayUi';
import {SHARED_RESP_ITEMS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

const OWNER_LABELS = {provider: 'Провайдер', customer: 'Заказчик', shared: 'Shared'};

function SharedResponsibilityPlayInner() {
  const [owner, setOwner] = useState(() => Object.fromEntries(SHARED_RESP_ITEMS.map((i) => [i.id, i.owner])));
  const score = useMemo(() => SHARED_RESP_ITEMS.filter((i) => owner[i.id] === i.owner).length, [owner]);

  return (
    <DemoShell>
      <DemoCard title="Shared responsibility model" subtitle="Кто отвечает за физику, ОС, данные и ключи в облаке?">
        <InfraRoot>
          <div className={s.panel}>
            {SHARED_RESP_ITEMS.map((item) => (
              <div key={item.id} className={s.statRow}>
                <span className={s.statKey}>{item.label}</span>
                <select className={s.selectField} value={owner[item.id]} onChange={(e) => setOwner((o) => ({...o, [item.id]: e.target.value}))} aria-label={item.label}>
                  <option value="provider">Провайдер</option>
                  <option value="customer">Заказчик</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
            ))}
          </div>
          <span className={s.scoreBadge}>Верно: {score}/{SHARED_RESP_ITEMS.length}</span>
          {score === SHARED_RESP_ITEMS.length && <Alert tone="success">Модель shared responsibility: провайдер — гипервизор, вы — данные и IAM.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default SharedResponsibilityPlayInner;
`,

  PublicBucketMisconfigPlay: `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatusPill, Alert} from '@/components/shared/infra/InfraPlayUi';
import {BUCKET_POLICIES} from '@/components/shared/kb/infraSecurityEngines';

function PublicBucketMisconfigPlayInner() {
  const [policyId, setPolicyId] = useState(BUCKET_POLICIES[0].id);
  const pol = BUCKET_POLICIES.find((p) => p.id === policyId);

  return (
    <DemoShell>
      <DemoCard title="S3 bucket — публичный доступ?" subtitle="Block Public Access vs опасные ACL и bucket policy">
        <InfraRoot>
          <ChipRow>
            {BUCKET_POLICIES.map((p) => (
              <Chip key={p.id} active={policyId === p.id} warn={p.public} onClick={() => setPolicyId(p.id)}>{p.label}</Chip>
            ))}
          </ChipRow>
          <StatusPill tone={pol.public ? 'error' : 'success'}>
            {pol.public ? 'Публичный доступ — утечка данных' : 'Доступ заблокирован'}
          </StatusPill>
          {pol.public && <Alert tone="error">Включите Block Public Access, проверьте audit-логи и ротируйте ключи при чувствительных данных.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PublicBucketMisconfigPlayInner;
`,
};

for (const [name, body] of Object.entries(FILES)) {
  fs.writeFileSync(path.join(demosDir, `${name}.jsx`), body);
  console.log('upgraded', name);
}

console.log('Done', Object.keys(FILES).length);
