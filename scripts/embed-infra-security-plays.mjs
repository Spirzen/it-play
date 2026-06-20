/**
 * Add ExternalPlayEmbed to infra-security encyclopedia articles.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.join(__dirname, '..', '..', 'it-knowledge-base', 'docs', 'encyclopedia', '8-infra-security');

/** @type {{file: string, example: string, title: string, minHeight: number}[]} */
const EMBEDS = [
  {file: '8-12-aktualnye-praktiki/1.md', example: 'infra-security/sbom-blast-radius-play', title: 'SBOM blast radius', minHeight: 420},
  {file: '8-12-aktualnye-praktiki/2.md', example: 'infra-security/webauthn-challenge-play', title: 'WebAuthn challenge flow', minHeight: 440},
  {file: '8-12-aktualnye-praktiki/3.md', example: 'infra-security/security-gate-pipeline-play', title: 'DevSecOps security gates', minHeight: 520},
  {file: '8-12-aktualnye-praktiki/4.md', example: 'infra-security/gitops-reconcile-play', title: 'GitOps reconcile', minHeight: 480},
  {file: '8-12-aktualnye-praktiki/5.md', example: 'infra-security/ru-cloud-picker-play', title: 'Облака РФ — подбор', minHeight: 380},
  {file: '8-12-aktualnye-praktiki/6.md', example: 'infra-security/golden-path-builder-play', title: 'Golden path IDP', minHeight: 380},
  {file: '8-12-aktualnye-praktiki/7.md', example: 'infra-security/prompt-injection-sandbox-play', title: 'Prompt injection sandbox', minHeight: 400},
  {file: '8-12-aktualnye-praktiki/8.md', example: 'infra-security/pkce-auth-code-flow-play', title: 'OIDC + PKCE', minHeight: 400},
  {file: '8-12-aktualnye-praktiki/9.md', example: 'infra-security/gateway-route-policy-play', title: 'API Gateway routes', minHeight: 440},
  {file: '8-12-aktualnye-praktiki/10.md', example: 'infra-security/stride-threat-model-play', title: 'STRIDE threat model', minHeight: 440},
  {file: '8-12-aktualnye-praktiki/11.md', example: 'infra-security/phishing-red-flags-play', title: 'Фишинг — red flags', minHeight: 400},
  {file: '8-00-osnovy-infrastruktury/1.md', example: 'infra-security/infra-lifecycle-play', title: 'Путь кода к пользователю', minHeight: 400},
  {file: '8-00-osnovy-infrastruktury/1.md', example: 'infra-security/dev-staging-prod-play', title: 'dev / staging / prod', minHeight: 420},
  {file: '8-00-osnovy-infrastruktury/1.md', example: 'about/infra-diagram-studio', title: 'Infra Diagram Studio', minHeight: 560},
  {file: '8-00-osnovy-infrastruktury/2.md', example: 'infra-security/scaling-when-play', title: 'Когда масштабировать', minHeight: 400},
  {file: '8-00-osnovy-infrastruktury/3.md', example: 'infra-security/incident-response-play', title: 'Инцидент и rollback', minHeight: 400},
  {file: '8-13-praktikum-gitops/1.md', example: 'infra-security/argocd-app-status-play', title: 'Argo CD Application status', minHeight: 400},
  {file: '8-14-praktikum-vault/1.md', example: 'infra-security/vault-unseal-flow-play', title: 'Vault unseal flow', minHeight: 420},
  {file: '8-15-praktikum-dr/1.md', example: 'infra-security/rto-rpo-slider-play', title: 'RTO / RPO слайдеры', minHeight: 420},
  {file: '8-16-finops-pet-project/1.md', example: 'infra-security/cloud-leak-calculator-play', title: 'FinOps — калькулятор утечек', minHeight: 440},
  {file: '8-10-testirovanie-na-proniknovenie/6.md', example: 'infra-security/pentest-ptes-play', title: 'PTES фазы пентеста', minHeight: 400},
  {file: '8-10-testirovanie-na-proniknovenie/1.md', example: 'infra-security/engagement-scope-play', title: 'Black / grey / white box', minHeight: 420},
  {file: '8-09-belyy-haking-i-bug-bounty/3.md', example: 'infra-security/bug-bounty-scope-quiz-play', title: 'Bug Bounty scope quiz', minHeight: 400},
  {file: '8-09-belyy-haking-i-bug-bounty/2.md', example: 'infra-security/responsible-disclosure-play', title: 'Coordinated disclosure', minHeight: 400},
  {file: '8-06-konteynerizatsiya-i-orkestratsiya/120.md', example: 'infra-security/k8s-traffic-path-play', title: 'Сетевой путь в Kubernetes', minHeight: 400},
  {file: '8-01-oblachnye-tehnologii/12.md', example: 'infra-security/shared-responsibility-play', title: 'Shared responsibility', minHeight: 480},
  {file: '8-01-oblachnye-tehnologii/11.md', example: 'infra-security/public-bucket-misconfig-play', title: 'Public bucket misconfig', minHeight: 380},
];

const IMPORT_LINE = "import ExternalPlayEmbed from '@site/src/components/ExternalPlayEmbed';";

function embedBlock({example, title, minHeight}) {
  return `\n<ExternalPlayEmbed example="${example}" title="${title}" minHeight={${minHeight}} />\n`;
}

function findInsertPos(content) {
  const tagsEnd = content.indexOf('</div>', content.indexOf('article-tags'));
  if (tagsEnd > 0) return tagsEnd + 6;
  const h1 = content.indexOf('\n# ');
  if (h1 < 0) return -1;
  const lineEnd = content.indexOf('\n', h1 + 1);
  return lineEnd > 0 ? lineEnd : h1;
}

for (const item of EMBEDS) {
  const filePath = path.join(docsRoot, item.file);
  if (!fs.existsSync(filePath)) {
    console.warn('missing', item.file);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(`example="${item.example}"`)) {
    console.log('skip', item.file, item.example);
    continue;
  }

  if (!content.includes('ExternalPlayEmbed')) {
    const fmEnd = content.indexOf('---', 4);
    const insertAt = fmEnd >= 0 ? fmEnd + 3 : 0;
    content = content.slice(0, insertAt) + '\n\n' + IMPORT_LINE + content.slice(insertAt);
  }

  const pos = findInsertPos(content);
  if (pos < 0) {
    console.warn('no insert pos', item.file);
    continue;
  }
  content = content.slice(0, pos) + embedBlock(item) + content.slice(pos);
  fs.writeFileSync(filePath, content);
  console.log('patched', item.file, item.example);
}

console.log('Done');
