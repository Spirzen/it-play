/**
 * Scaffold infra-security play meta.json + demo components.
 * Run: node scripts/scaffold-infra-security-new-plays.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const playsDir = path.join(root, 'plays', 'infra-security');
const demosDir = path.join(root, 'src', 'components', 'demos');

const PLAYS = [
  {slug: 'sbom-blast-radius-play', component: 'SbomBlastRadiusPlay', title: 'SBOM — blast radius', url: '8-12-aktualnye-praktiki/1', order: 30},
  {slug: 'webauthn-challenge-play', component: 'WebauthnChallengePlay', title: 'WebAuthn challenge', url: '8-12-aktualnye-praktiki/2', order: 31},
  {slug: 'security-gate-pipeline-play', component: 'SecurityGatePipelinePlay', title: 'DevSecOps gates', url: '8-12-aktualnye-praktiki/3', order: 32},
  {slug: 'gitops-reconcile-play', component: 'GitopsReconcilePlay', title: 'GitOps reconcile', url: '8-12-aktualnye-praktiki/4', order: 33},
  {slug: 'ru-cloud-picker-play', component: 'RuCloudPickerPlay', title: 'Облака РФ — выбор', url: '8-12-aktualnye-praktiki/5', order: 34},
  {slug: 'golden-path-builder-play', component: 'GoldenPathBuilderPlay', title: 'Golden path IDP', url: '8-12-aktualnye-praktiki/6', order: 35},
  {slug: 'prompt-injection-sandbox-play', component: 'PromptInjectionSandboxPlay', title: 'Prompt injection sandbox', url: '8-12-aktualnye-praktiki/7', order: 36},
  {slug: 'pkce-auth-code-flow-play', component: 'PkceAuthCodeFlowPlay', title: 'OIDC + PKCE flow', url: '8-12-aktualnye-praktiki/8', order: 37},
  {slug: 'gateway-route-policy-play', component: 'GatewayRoutePolicyPlay', title: 'API Gateway routes', url: '8-12-aktualnye-praktiki/9', order: 38},
  {slug: 'stride-threat-model-play', component: 'StrideThreatModelPlay', title: 'STRIDE threat model', url: '8-12-aktualnye-praktiki/10', order: 39},
  {slug: 'phishing-red-flags-play', component: 'PhishingRedFlagsPlay', title: 'Фишинг — red flags', url: '8-12-aktualnye-praktiki/11', order: 40},
  {slug: 'infra-lifecycle-play', component: 'InfraLifecyclePlay', title: 'Жизненный цикл инфраструктуры', url: '8-00-osnovy-infrastruktury/1', order: 41},
  {slug: 'dev-staging-prod-play', component: 'DevStagingProdPlay', title: 'dev / staging / prod', url: '8-00-osnovy-infrastruktury/1', order: 42},
  {slug: 'scaling-when-play', component: 'ScalingWhenPlay', title: 'Когда масштабировать', url: '8-00-osnovy-infrastruktury/2', order: 43},
  {slug: 'incident-response-play', component: 'IncidentResponsePlay', title: 'Инцидент и rollback', url: '8-00-osnovy-infrastruktury/3', order: 44},
  {slug: 'argocd-app-status-play', component: 'ArgocdAppStatusPlay', title: 'Argo CD Application', url: '8-13-praktikum-gitops/1', order: 45},
  {slug: 'vault-unseal-flow-play', component: 'VaultUnsealFlowPlay', title: 'Vault unseal', url: '8-14-praktikum-vault/1', order: 46},
  {slug: 'rto-rpo-slider-play', component: 'RtoRpoSliderPlay', title: 'RTO / RPO слайдер', url: '8-15-praktikum-dr/1', order: 47},
  {slug: 'cloud-leak-calculator-play', component: 'CloudLeakCalculatorPlay', title: 'FinOps — утечки', url: '8-16-finops-pet-project/1', order: 48},
  {slug: 'pentest-ptes-play', component: 'PentestPtesPlay', title: 'PTES фазы', url: '8-10-testirovanie-na-proniknovenie/6', order: 49},
  {slug: 'engagement-scope-play', component: 'EngagementScopePlay', title: 'Black / grey / white box', url: '8-10-testirovanie-na-proniknovenie/1', order: 50},
  {slug: 'bug-bounty-scope-quiz-play', component: 'BugBountyScopeQuizPlay', title: 'Bug Bounty scope', url: '8-09-belyy-haking-i-bug-bounty/3', order: 51},
  {slug: 'responsible-disclosure-play', component: 'ResponsibleDisclosurePlay', title: 'Responsible disclosure', url: '8-09-belyy-haking-i-bug-bounty/2', order: 52},
  {slug: 'k8s-traffic-path-play', component: 'K8sTrafficPathPlay', title: 'K8s traffic path', url: '8-06-konteynerizatsiya-i-orkestratsiya/120', order: 53},
  {slug: 'shared-responsibility-play', component: 'SharedResponsibilityPlay', title: 'Shared responsibility', url: '8-01-oblachnye-tehnologii/12', order: 54},
  {slug: 'public-bucket-misconfig-play', component: 'PublicBucketMisconfigPlay', title: 'Public S3 bucket', url: '8-01-oblachnye-tehnologii/11', order: 55},
];

function writeMeta(p) {
  const dir = path.join(playsDir, p.slug);
  fs.mkdirSync(dir, {recursive: true});
  const meta = {
    title: p.title,
    description: `Интерактивное демо «${p.title}» — раздел Энциклопедия · Инфраструктура и безопасность.`,
    category: 'infra-security',
    categoryTitle: 'Энциклопедия · Инфраструктура и безопасность',
    component: p.slug,
    tags: ['infra-security', 'encyclopedia'],
    encyclopediaUrl: `https://spirzen.ru/encyclopedia/8-infra-security/${p.url}`,
    order: p.order,
  };
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
}

function writeDemo(p) {
  const file = path.join(demosDir, `${p.component}.jsx`);
  if (fs.existsSync(file)) {
    console.log('skip exists', p.component);
    return;
  }
  const body = generateComponent(p);
  fs.writeFileSync(file, body);
  console.log('created', p.component);
}

function generateComponent(p) {
  const name = p.component;
  const inner = `${name}Inner`;
  const templates = {
    SbomBlastRadiusPlay: sbomTemplate,
    WebauthnChallengePlay: webauthnTemplate,
    SecurityGatePipelinePlay: securityGateTemplate,
    GitopsReconcilePlay: gitopsTemplate,
    RuCloudPickerPlay: ruCloudTemplate,
    GoldenPathBuilderPlay: goldenPathTemplate,
    PromptInjectionSandboxPlay: promptTemplate,
    PkceAuthCodeFlowPlay: pkceTemplate,
    GatewayRoutePolicyPlay: gatewayTemplate,
    StrideThreatModelPlay: strideTemplate,
    PhishingRedFlagsPlay: phishingTemplate,
    InfraLifecyclePlay: lifecycleTemplate,
    DevStagingProdPlay: envTemplate,
    ScalingWhenPlay: scalingTemplate,
    IncidentResponsePlay: incidentTemplate,
    ArgocdAppStatusPlay: argoTemplate,
    VaultUnsealFlowPlay: vaultTemplate,
    RtoRpoSliderPlay: rtoTemplate,
    CloudLeakCalculatorPlay: leakTemplate,
    PentestPtesPlay: ptesTemplate,
    EngagementScopePlay: engagementTemplate,
    BugBountyScopeQuizPlay: bountyTemplate,
    ResponsibleDisclosurePlay: disclosureTemplate,
    K8sTrafficPathPlay: k8sTrafficTemplate,
    SharedResponsibilityPlay: sharedTemplate,
    PublicBucketMisconfigPlay: bucketTemplate,
  };
  const gen = templates[name];
  if (!gen) throw new Error(`No template for ${name}`);
  return gen(inner, name);
}

// --- templates (abbreviated but complete) ---

function sbomTemplate(inner, name) {
  return `import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SBOM_GRAPH} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [pkgId, setPkgId] = useState('lodash');
  const pkg = SBOM_GRAPH.packages.find((p) => p.id === pkgId);
  const affected = useMemo(
    () => SBOM_GRAPH.services.filter((s) => s.deps.includes(pkgId)),
    [pkgId],
  );

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="SBOM blast radius" subtitle="Клик по уязвимому пакету — какие сервисы затронуты">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {SBOM_GRAPH.packages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, pkgId === p.id && toolStyles.chipActive)}
              onClick={() => setPkgId(p.id)}
            >
              {p.label}
              {p.cve && ' ⚠'}
            </button>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.statRow}><span>Пакет</span><strong>{pkg?.label}</strong></div>
          <div className={styles.statRow}><span>CVE</span><strong>{pkg?.cve ?? '—'}</strong></div>
          <div className={styles.statRow}><span>Сервисы</span><strong>{affected.map((s) => s.label).join(', ') || '—'}</strong></div>
        </div>
        {pkg?.cve && (
          <p className="it-demo__hint" style={{marginTop: '0.65rem'}}>
            Blast radius: обновите {pkg.label} во всех образах выше и пересоберите SBOM.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function webauthnTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {WEBAUTHN_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [mode, setMode] = useState('register');
  const [step, setStep] = useState(0);
  const flow = WEBAUTHN_STEPS.find((f) => f.id === mode);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="WebAuthn challenge flow" subtitle="Регистрация и вход без передачи пароля">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {WEBAUTHN_STEPS.map((f) => (
            <button key={f.id} type="button" className={clsx(toolStyles.chip, mode === f.id && toolStyles.chipActive)} onClick={() => { setMode(f.id); setStep(0); }}>
              {f.label}
            </button>
          ))}
        </div>
        <ol style={{margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem'}}>
          {flow.steps.map((s, i) => (
            <li key={s} style={{opacity: i <= step ? 1 : 0.4, fontWeight: i === step ? 700 : 400}}>{s}</li>
          ))}
        </ol>
        <div className={styles.row} style={{marginTop: '0.75rem'}}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Назад</button>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= flow.steps.length - 1} onClick={() => setStep((s) => s + 1)}>Далее</button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function securityGateTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DEVSECOPS_GATES, simulateGates} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(DEVSECOPS_GATES.map((l) => [l.id, l.defaultOn])));
  const [run, setRun] = useState(null);
  const [running, setRunning] = useState(false);

  const toggle = (id) => { setEnabled((e) => ({...e, [id]: !e[id]})); setRun(null); };

  const execute = async () => {
    setRunning(true);
    setRun(null);
    await new Promise((r) => setTimeout(r, 400));
    setRun(simulateGates(DEVSECOPS_GATES, enabled));
    setRunning(false);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="DevSecOps security gates" subtitle="Включите слои проверок и запустите симуляцию merge в prod">
        <div className={styles.layerList}>
          {DEVSECOPS_GATES.map((layer) => {
            const on = enabled[layer.id];
            const result = run?.results.find((r) => r.id === layer.id);
            return (
              <div key={layer.id} className={clsx(styles.layerRow, !on && styles.layerSkip, result && (result.passed ? styles.layerPass : styles.layerFail))}>
                <input type="checkbox" checked={on} onChange={() => toggle(layer.id)} aria-label={layer.label} />
                <div><strong>{layer.label}</strong><div style={{fontSize: '0.75rem', opacity: 0.85}}>{layer.log}</div></div>
                <span style={{fontSize: '0.8rem'}}>{!on && '—'}{result && (result.passed ? '✓' : '✗')}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.row} style={{marginTop: '0.75rem'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={execute} disabled={running}>{running ? 'Пайплайн…' : 'Запустить gates'}</button>
          {run && <span style={{fontWeight: 600, color: run.ok ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)'}}>{run.ok ? 'Deploy разрешён' : 'Pipeline failed'}</span>}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function gitopsTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GITOPS_CLUSTER, GITOPS_MANIFEST} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [status, setStatus] = useState('Synced');
  const [drift, setDrift] = useState(false);

  const sync = () => { setDrift(false); setStatus('Synced'); };
  const kubectlPatch = () => { setDrift(true); setStatus('OutOfSync'); };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="GitOps reconcile" subtitle="Git — источник истины; ручной kubectl создаёт drift">
        <div className={styles.grid2}>
          <div><label className="it-demo__label">Git (desired)</label><pre className={styles.mono}>{GITOPS_MANIFEST}</pre></div>
          <div><label className="it-demo__label">Cluster (actual)</label><pre className={styles.mono}>{drift ? GITOPS_CLUSTER : GITOPS_MANIFEST}</pre></div>
        </div>
        <p style={{fontWeight: 700, margin: '0.65rem 0'}}>Argo CD: <span style={{color: status === 'Synced' ? '#43a047' : '#e53935'}}>{status}</span></p>
        <div className={styles.row}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={kubectlPatch}>kubectl set image (drift)</button>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={sync}>Sync from Git</button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function ruCloudTemplate(inner) {
  return `import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {RU_CLOUD_SCENARIOS, RU_PROVIDERS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [scenarioId, setScenarioId] = useState(RU_CLOUD_SCENARIOS[0].id);
  const scenario = RU_CLOUD_SCENARIOS.find((s) => s.id === scenarioId);
  const pick = useMemo(() => RU_PROVIDERS[scenario.best], [scenario]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Облака РФ — подбор провайдера" subtitle="Сценарий → рекомендация с trade-offs">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {RU_CLOUD_SCENARIOS.map((s) => (
            <button key={s.id} type="button" className={clsx(toolStyles.chip, scenarioId === s.id && toolStyles.chipActive)} onClick={() => setScenarioId(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.statRow}><span>Рекомендация</span><strong>{pick.name}</strong></div>
          <div className={styles.statRow}><span>Почему</span><span style={{textAlign: 'right', maxWidth: '60%'}}>{scenario.why}</span></div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function goldenPathTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GOLDEN_PATHS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [pathId, setPathId] = useState(GOLDEN_PATHS[0].id);
  const path = GOLDEN_PATHS.find((p) => p.id === pathId);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Platform Engineering — golden path" subtitle="Self-service шаблон для нового сервиса">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {GOLDEN_PATHS.map((p) => (
            <button key={p.id} type="button" className={clsx(toolStyles.chip, pathId === p.id && toolStyles.chipActive)} onClick={() => setPathId(p.id)}>{p.label}</button>
          ))}
        </div>
        <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem'}}>
          {path.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="it-demo__hint" style={{marginTop: '0.65rem'}}>Время до первого deploy: {path.time}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function promptTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PROMPT_SCENARIOS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [id, setId] = useState(PROMPT_SCENARIOS[0].id);
  const [sandbox, setSandbox] = useState(true);
  const sc = PROMPT_SCENARIOS.find((s) => s.id === id);
  const blocked = sc.poisoned && sandbox;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Prompt injection sandbox" subtitle="Агент с MCP tools — sandbox блокирует опасные вызовы">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {PROMPT_SCENARIOS.map((s) => (
            <button key={s.id} type="button" className={clsx(toolStyles.chip, id === s.id && toolStyles.chipActive)} onClick={() => setId(s.id)}>{s.id}</button>
          ))}
        </div>
        <label style={{display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem'}}>
          <input type="checkbox" checked={sandbox} onChange={(e) => setSandbox(e.target.checked)} /> Tool sandbox + allowlist
        </label>
        <pre className={styles.mono} style={{marginTop: '0.5rem'}}>{sc.input}</pre>
        {sc.toolCall && (
          <p style={{color: blocked ? '#e53935' : '#fb8c00', fontWeight: 600}}>
            {blocked ? \`⛔ Blocked tool: \${sc.toolCall}\` : \`⚠ Allowed: \${sc.toolCall}\`}
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function pkceTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PKCE_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [step, setStep] = useState(0);
  const current = PKCE_STEPS[step];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Authorization Code + PKCE" subtitle="Пошаговый OAuth 2.0 для SPA и mobile">
        <div className={styles.flowSteps}>
          {PKCE_STEPS.map((s, i) => (
            <button key={s.id} type="button" className={\`\${styles.flowStep} \${i === step ? styles.flowStepActive : ''}\`} onClick={() => setStep(i)}>{s.label}</button>
          ))}
        </div>
        <div className={styles.panel}><strong>{current.label}</strong><p style={{margin: '0.35rem 0 0', fontSize: '0.85rem'}}>{current.detail}</p></div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function gatewayTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GATEWAY_ROUTES} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [path, setPath] = useState(GATEWAY_ROUTES[0].path);
  const [hasToken, setHasToken] = useState(true);
  const [rps, setRps] = useState(50);
  const route = GATEWAY_ROUTES.find((r) => r.path === path);
  const denied = (route.auth && !hasToken) || rps > route.limit;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="API Gateway — маршрут и политики" subtitle="Path → backend, JWT и rate limit">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {GATEWAY_ROUTES.map((r) => (
            <button key={r.path} type="button" className={clsx(toolStyles.chip, path === r.path && toolStyles.chipActive)} onClick={() => setPath(r.path)}>{r.path}</button>
          ))}
        </div>
        <label className="it-demo__label">RPS: {rps}</label>
        <input className={styles.slider} type="range" min={1} max={250} value={rps} onChange={(e) => setRps(Number(e.target.value))} />
        <label style={{display: 'flex', gap: '0.5rem', fontSize: '0.85rem'}}><input type="checkbox" checked={hasToken} onChange={(e) => setHasToken(e.target.checked)} /> Bearer JWT</label>
        <p style={{fontWeight: 700, marginTop: '0.5rem', color: denied ? '#e53935' : '#43a047'}}>
          {denied ? (rps > route.limit ? '429 Too Many Requests' : '401 Unauthorized') : \`→ \${route.backend}\`}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function strideTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {STRIDE_ELEMENTS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [elId, setElId] = useState(STRIDE_ELEMENTS[0].id);
  const [letter, setLetter] = useState('S');
  const el = STRIDE_ELEMENTS.find((e) => e.id === elId);
  const letters = ['S', 'T', 'R', 'I', 'D', 'E'];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="STRIDE threat modeling" subtitle="Компонент → угроза по категории STRIDE">
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {STRIDE_ELEMENTS.map((e) => (
            <button key={e.id} type="button" className={clsx(toolStyles.chip, elId === e.id && toolStyles.chipActive)} onClick={() => setElId(e.id)}>{e.label}</button>
          ))}
        </div>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {letters.map((l) => (
            <button key={l} type="button" className={clsx(toolStyles.chip, letter === l && toolStyles.chipActive)} onClick={() => setLetter(l)}>{l}</button>
          ))}
        </div>
        <div className={styles.panel}><strong>{el.label} — {letter}</strong><p style={{margin: '0.35rem 0 0'}}>{el.threats[letter]}</p></div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function phishingTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PHISHING_EMAILS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [idx, setIdx] = useState(0);
  const [guess, setGuess] = useState(null);
  const email = PHISHING_EMAILS[idx];

  const check = (isPhish) => {
    setGuess(isPhish === !email.safe ? 'correct' : 'wrong');
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Фишинг — найди red flags" subtitle="Учебные письма без реальных ссылок">
        <div className={styles.panel}>
          <div><strong>From:</strong> {email.from}</div>
          <div><strong>Subject:</strong> {email.subject}</div>
        </div>
        <div className={styles.row} style={{marginTop: '0.65rem'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => check(true)}>Фишинг</button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => check(false)}>Легитимно</button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => { setIdx((i) => (i + 1) % PHISHING_EMAILS.length); setGuess(null); }}>Следующее</button>
        </div>
        {guess === 'correct' && <p style={{color: '#43a047'}}>Верно! Flags: {email.flags.join(', ') || 'нет'}</p>}
        {guess === 'wrong' && <p style={{color: '#e53935'}}>Неверно. Подсказка: {email.flags.join(', ') || 'корпоративный домен OK'}</p>}
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function lifecycleTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {INFRA_LIFECYCLE} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [active, setActive] = useState(0);
  const node = INFRA_LIFECYCLE[active];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Путь кода к пользователю" subtitle="От коммита до prod — клик по этапу">
        <div className={styles.flowSteps}>
          {INFRA_LIFECYCLE.map((n, i) => (
            <button key={n.id} type="button" className={\`\${styles.flowStep} \${i === active ? styles.flowStepActive : ''}\`} onClick={() => setActive(i)}>{n.label}</button>
          ))}
        </div>
        <div className={styles.panel}><div className={styles.statRow}><span>Роль</span><strong>{node.role}</strong></div><p style={{margin: '0.35rem 0 0', fontSize: '0.85rem'}}>{node.detail}</p></div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function envTemplate(inner) {
  return `import React from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ENV_COMPARE} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  return (
    <DemoShell className={styles.root}>
      <DemoCard title="dev / staging / prod" subtitle="Чем отличаются среды — не только URL">
        <table style={{width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse'}}>
          <thead><tr><th align="left">Параметр</th><th>dev</th><th>staging</th><th>prod</th></tr></thead>
          <tbody>
            {ENV_COMPARE.map((row) => (
              <tr key={row.key}><td style={{padding: '0.35rem 0', borderBottom: '1px dashed var(--ifm-color-emphasis-200)'}}>{row.key}</td><td>{row.dev}</td><td>{row.staging}</td><td>{row.prod}</td></tr>
            ))}
          </tbody>
        </table>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function scalingTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SCALING_TREE} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [idx, setIdx] = useState(0);
  const item = SCALING_TREE[idx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Масштабирование по сигналу" subtitle="Не усложняйте стек без измеренного узкого места">
        <p style={{fontWeight: 600}}>Сигнал: {item.signal}</p>
        <div className={styles.panel} style={{marginTop: '0.5rem'}}><span style={{color: '#43a047'}}>✓ {item.action}</span></div>
        <div className={styles.panel} style={{marginTop: '0.35rem'}}><span style={{color: '#e53935'}}>✗ {item.wrong}</span></div>
        <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" style={{marginTop: '0.65rem'}} onClick={() => setIdx((i) => (i + 1) % SCALING_TREE.length)}>Следующий сигнал</button>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function incidentTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {INCIDENT_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Инцидент → rollback" subtitle="Алерт, триаж, откат, postmortem">
        <div className={styles.flowSteps}>
          {INCIDENT_STEPS.map((s, i) => (
            <button key={s.id} type="button" className={\`\${styles.flowStep} \${i === step ? styles.flowStepActive : ''}\`} onClick={() => setStep(i)}>{s.label}</button>
          ))}
        </div>
        <pre className={styles.mono}>{INCIDENT_STEPS[step].log}</pre>
        <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= INCIDENT_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Далее</button>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function argoTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ARGO_STATUSES} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [status, setStatus] = useState('Synced');

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Argo CD Application status" subtitle="Synced / OutOfSync / Progressing / Degraded">
        <div className={toolStyles.chips}>
          {ARGO_STATUSES.map((s) => (
            <button key={s} type="button" className={clsx(toolStyles.chip, status === s && toolStyles.chipActive)} onClick={() => setStatus(s)}>{s}</button>
          ))}
        </div>
        <div className={styles.panel} style={{marginTop: '0.65rem'}}>
          {status === 'Synced' && 'Кластер совпадает с Git. Health: Healthy.'}
          {status === 'OutOfSync' && 'Drift: image tag отличается. Нужен Sync или revert commit.'}
          {status === 'Progressing' && 'Rolling update: 1/3 pods ready.'}
          {status === 'Degraded' && 'CrashLoopBackOff — проверьте логи и манифест.'}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function vaultTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {VAULT_MODES} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [mode, setMode] = useState('dev');
  const [unsealed, setUnsealed] = useState(mode === 'dev');
  const cfg = VAULT_MODES[mode];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Vault: dev vs prod unseal" subtitle="Только lab использует -dev с root token">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {['dev', 'prod'].map((m) => (
            <button key={m} type="button" className={clsx(toolStyles.chip, mode === m && toolStyles.chipActive)} onClick={() => { setMode(m); setUnsealed(m === 'dev'); }}>{m}</button>
          ))}
        </div>
        <ol style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem'}}>{cfg.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        {mode === 'prod' && (
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" style={{marginTop: '0.65rem'}} onClick={() => setUnsealed(true)} disabled={unsealed}>
            {unsealed ? 'Unsealed (3/5 keys)' : 'Unseal'}
          </button>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function rtoTemplate(inner) {
  return `import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [backupHours, setBackupHours] = useState(6);
  const [restoreHours, setRestoreHours] = useState(1);
  const rpo = useMemo(() => \`\${backupHours}ч данных при сбое в случайный момент\`, [backupHours]);
  const rto = useMemo(() => \`\${restoreHours}ч простоя до восстановления\`, [restoreHours]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="RTO / RPO слайдеры" subtitle="Частота бэкапа vs время восстановления">
        <label className="it-demo__label">Интервал бэкапа: {backupHours}ч (RPO)</label>
        <input className={styles.slider} type="range" min={1} max={24} value={backupHours} onChange={(e) => setBackupHours(Number(e.target.value))} />
        <label className="it-demo__label">Время restore: {restoreHours}ч (RTO)</label>
        <input className={styles.slider} type="range" min={0.5} max={8} step={0.5} value={restoreHours} onChange={(e) => setRestoreHours(Number(e.target.value))} />
        <div className={styles.panel} style={{marginTop: '0.5rem'}}>
          <div className={styles.statRow}><span>RPO</span><strong>{rpo}</strong></div>
          <div className={styles.statRow}><span>RTO</span><strong>{rto}</strong></div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function leakTemplate(inner) {
  return `import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CLOUD_LEAKS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [on, setOn] = useState(() => Object.fromEntries(CLOUD_LEAKS.map((l) => [l.id, false])));
  const total = useMemo(() => CLOUD_LEAKS.filter((l) => on[l.id]).reduce((s, l) => s + l.cost, 0), [on]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="FinOps — калькулятор утечек" subtitle="Забытые ресурсы pet-проекта">
        {CLOUD_LEAKS.map((l) => (
          <label key={l.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.85rem'}}>
            <span><input type="checkbox" checked={on[l.id]} onChange={() => setOn((o) => ({...o, [l.id]: !o[l.id]}))} /> {l.label}</span>
            <span>\${l.cost}/мес</span>
          </label>
        ))}
        <div className={styles.budgetBar}><div className={styles.budgetFill} style={{width: \`\${Math.min(100, total)}%\`, background: total > 50 ? '#e53935' : '#43a047'}} /></div>
        <strong>Итого: \${total}/мес</strong>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function ptesTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PTES_PHASES} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [idx, setIdx] = useState(0);
  const phase = PTES_PHASES[idx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="PTES — фазы пентеста" subtitle="Pre-engagement → reporting">
        <div className={styles.flowSteps}>
          {PTES_PHASES.map((p, i) => (
            <button key={p.id} type="button" className={\`\${styles.flowStep} \${i === idx ? styles.flowStepActive : ''}\`} onClick={() => setIdx(i)}>{p.label}</button>
          ))}
        </div>
        <p style={{fontSize: '0.85rem'}}>Инструменты: {phase.tools.join(', ')}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function engagementTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ENGAGEMENT_TYPES} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [id, setId] = useState(ENGAGEMENT_TYPES[0].id);
  const t = ENGAGEMENT_TYPES.find((e) => e.id === id);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Black / grey / white box" subtitle="Один target — разный объём знаний">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {ENGAGEMENT_TYPES.map((e) => (
            <button key={e.id} type="button" className={clsx(toolStyles.chip, id === e.id && toolStyles.chipActive)} onClick={() => setId(e.id)}>{e.label}</button>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.statRow}><span>Знания</span><span>{t.knowledge}</span></div>
          <div className={styles.statRow}><span>Находит</span><span>{t.finds}</span></div>
          <div className={styles.statRow}><span>Может пропустить</span><span>{t.miss}</span></div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function bountyTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {BOUNTY_SCOPE} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const item = BOUNTY_SCOPE[idx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Bug Bounty — in scope?" subtitle="Проверьте target перед тестом">
        <p style={{fontWeight: 600}}>{item.target}</p>
        <div className={styles.row}>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => setAnswer(item.inScope ? 'ok' : 'bad')}>In scope</button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => setAnswer(!item.inScope ? 'ok' : 'bad')}>Out of scope</button>
        </div>
        {answer === 'ok' && <p style={{color: '#43a047'}}>Верно: {item.reason}</p>}
        {answer === 'bad' && <p style={{color: '#e53935'}}>Неверно. {item.reason}</p>}
        <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => { setIdx((i) => (i + 1) % BOUNTY_SCOPE.length); setAnswer(null); }}>Следующий</button>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function disclosureTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DISCLOSURE_TIMELINE} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [day, setDay] = useState(0);
  const events = DISCLOSURE_TIMELINE.filter((e) => e.day <= day);
  const maxDay = DISCLOSURE_TIMELINE[DISCLOSURE_TIMELINE.length - 1].day;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Coordinated disclosure" subtitle="День 0 → публичное раскрытие">
        <label className="it-demo__label">День {day}</label>
        <input className={styles.slider} type="range" min={0} max={maxDay} value={day} onChange={(e) => setDay(Number(e.target.value))} />
        <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem'}}>
          {events.map((e) => <li key={e.day}><strong>D{e.day}:</strong> {e.event} — {e.action}</li>)}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function k8sTrafficTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {K8S_TRAFFIC_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Сетевой путь в Kubernetes" subtitle="Client → Ingress → Service → kube-proxy → Pod">
        <div className={styles.hubRow}>
          {K8S_TRAFFIC_STEPS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <span className={styles.hubArrow}>→</span>}
              <div className={\`\${styles.hubNode} \${i <= step ? styles.hubPulse : ''}\`} style={{opacity: i <= step ? 1 : 0.35}} onClick={() => setStep(i)} role="button" tabIndex={0}>{label}</div>
            </React.Fragment>
          ))}
        </div>
        <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= K8S_TRAFFIC_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Следующий hop</button>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function sharedTemplate(inner) {
  return `import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SHARED_RESP_ITEMS} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';

function ${inner}() {
  const [owner, setOwner] = useState(() => Object.fromEntries(SHARED_RESP_ITEMS.map((i) => [i.id, i.owner])));

  const score = SHARED_RESP_ITEMS.filter((i) => owner[i.id] === i.owner).length;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Shared responsibility model" subtitle="Кто отвечает: провайдер или заказчик?">
        {SHARED_RESP_ITEMS.map((item) => (
          <div key={item.id} className={styles.statRow}>
            <span>{item.label}</span>
            <select value={owner[item.id]} onChange={(e) => setOwner((o) => ({...o, [item.id]: e.target.value}))} style={{fontSize: '0.8rem'}}>
              <option value="provider">Провайдер</option>
              <option value="customer">Заказчик</option>
              <option value="shared">Shared</option>
            </select>
          </div>
        ))}
        <p style={{marginTop: '0.65rem'}}>Верно: {score}/{SHARED_RESP_ITEMS.length}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

function bucketTemplate(inner) {
  return `import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {BUCKET_POLICIES} from '@/components/shared/kb/infraSecurityEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ${inner}() {
  const [policyId, setPolicyId] = useState(BUCKET_POLICIES[0].id);
  const pol = BUCKET_POLICIES.find((p) => p.id === policyId);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="S3 bucket — публичный доступ?" subtitle="Block Public Access vs опасные ACL/policy">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {BUCKET_POLICIES.map((p) => (
            <button key={p.id} type="button" className={clsx(toolStyles.chip, policyId === p.id && toolStyles.chipActive)} onClick={() => setPolicyId(p.id)}>{p.label}</button>
          ))}
        </div>
        <p style={{fontWeight: 700, color: pol.public ? '#e53935' : '#43a047'}}>
          {pol.public ? '⚠ Bucket доступен из интернета — типичная утечка' : '✓ Публичный доступ заблокирован'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ${inner};
`;
}

for (const p of PLAYS) {
  writeMeta(p);
  writeDemo(p);
}

console.log(`Done: ${PLAYS.length} plays`);
