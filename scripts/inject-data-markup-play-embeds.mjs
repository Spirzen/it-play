/**
 * Injects ExternalPlayEmbed into encyclopedia chapters for new data-markup plays.
 * Usage: node scripts/inject-data-markup-play-embeds.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {NEW_PLAYS} from './scaffold-data-markup-new-plays.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_DOCS = path.join(__dirname, '..', '..', 'it-knowledge-base', 'docs', 'encyclopedia', '3-data-markup');

/** @type {Record<string, {files: string[], minHeight?: number}>} */
const EMBED_MAP = {
  'endianness-byte-play': {files: ['3-01-prodvinutye-operatsii-s-dannymi/113.md']},
  'data-pipeline-play': {files: ['3-01-prodvinutye-operatsii-s-dannymi/1.md']},
  'bit-mask-play': {files: ['3-01-prodvinutye-operatsii-s-dannymi/113.md']},
  'hash-collision-play': {files: ['3-02-struktury-dannyh/2.md']},
  'b-tree-page-play': {files: ['3-02-struktury-dannyh/2.md']},
  'probabilistic-structures-play': {files: ['3-02-struktury-dannyh/2.md']},
  'structure-picker-quiz': {files: ['3-02-struktury-dannyh/3.md']},
  'relational-algebra-play': {files: ['3-03-myslitelnaya-baza/322.md']},
  'graph-theory-play': {files: ['3-03-myslitelnaya-baza/323.md']},
  'matrix-transform-play': {files: ['3-03-myslitelnaya-baza/34.md']},
  'probability-bayes-play': {files: ['3-03-myslitelnaya-baza/35.md']},
  'grammar-derivation-play': {files: ['3-03-myslitelnaya-baza/41.md']},
  'turing-machine-play': {files: ['3-03-myslitelnaya-baza/45.md']},
  'ontology-graph-play': {files: ['3-03-myslitelnaya-baza/328.md']},
  'csv-parse-play': {files: ['3-04-konfiguratsii-i-dannye/219.md']},
  'toml-json-compare-play': {files: ['3-04-konfiguratsii-i-dannye/218.md']},
  'json-schema-validator-play': {files: ['3-04-konfiguratsii-i-dannye/220.md']},
  'graph-ql-query-play': {files: ['3-04-konfiguratsii-i-dannye/221.md']},
  'protobuf-wire-play': {files: ['3-04-konfiguratsii-i-dannye/216.md']},
  'parquet-column-play': {files: ['3-04-konfiguratsii-i-dannye/222.md']},
  'codd-rules-checker-play': {files: ['3-05-osnovy-baz-dannyh/5.md']},
  'normalization-play': {files: ['3-07-sql/103.md']},
  'acid-transaction-play': {files: ['3-05-osnovy-baz-dannyh/4.md']},
  'wal-recovery-play': {files: ['3-05-osnovy-baz-dannyh/8.md']},
  'sql-window-functions-play': {files: ['3-07-sql/7.md']},
  'sql-execution-order-play': {files: ['3-07-sql/2.md']},
  'sql-null-logic-play': {files: ['3-07-sql/103.md']},
  'sql-index-compare-play': {files: ['3-07-sql/44.md']},
  'postgres-tuning-sandbox-play': {files: ['3-08-upravlenie-rsubd/2.md']},
  'vacuum-bloat-play': {files: ['3-08-upravlenie-rsubd/2.md']},
  'pg-hba-rule-play': {files: ['3-08-upravlenie-rsubd/2.md']},
  'backup-restore-timeline-play': {files: ['3-08-upravlenie-rsubd/2.md']},
  'web-components-play': {files: ['3-09-html/25.md']},
  'css-has-play': {files: ['3-10-css/114.md']},
  'css-specificity-calculator-play': {files: ['3-10-css/5.md']},
  'a11y-landmarks-play': {files: ['3-09-html/21.md']},
  'statistics-traps-play': {files: ['3-11-analiz-dannyh/3.md']},
  'goodhart-metric-play': {files: ['3-11-analiz-dannyh/3.md']},
  'regression-line-play': {files: ['3-11-analiz-dannyh/2.md']},
  'time-series-decompose-play': {files: ['3-11-analiz-dannyh/424.md']},
  'cap-theorem-play': {files: ['3-06-nosql/intro.md']},
  'consistency-model-play': {files: ['3-06-nosql/1.md']},
  'nosql-chooser-play': {files: ['3-06-nosql/intro.md']},
  'gaussian-elimination-play': {files: ['3-12-matematicheskoe-programmirovanie/3.md']},
  'transport-problem-play': {files: ['3-12-matematicheskoe-programmirovanie/intro.md']},
  'integer-lp-cutting-play': {files: ['3-12-matematicheskoe-programmirovanie/intro.md']},
};

const IMPORT_LINE = "import ExternalPlayEmbed from '@site/src/components/ExternalPlayEmbed';";

function injectFile(filePath, slug, title, minHeight = 480) {
  if (!fs.existsSync(filePath)) {
    console.warn('Missing:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const embedTag = `<ExternalPlayEmbed example="data-markup/${slug}" title="${title}" minHeight={${minHeight}} />`;
  if (content.includes(embedTag) || content.includes(`example="data-markup/${slug}"`)) {
    console.log('Skip (exists):', filePath, slug);
    return;
  }
  if (!content.includes(IMPORT_LINE)) {
    const fmEnd = content.indexOf('---', content.indexOf('---') + 3);
    const insertAt = fmEnd >= 0 ? fmEnd + 3 : 0;
    content = `${content.slice(0, insertAt)}\n\n${IMPORT_LINE}\n${content.slice(insertAt)}`;
  }
  const h1 = content.match(/^# .+$/m);
  const insertAfter = h1 ? content.indexOf(h1[0]) + h1[0].length : 0;
  const block = `\n\n${embedTag}\n`;
  content = content.slice(0, insertAfter) + block + content.slice(insertAfter);
  fs.writeFileSync(filePath, content);
  console.log('Injected:', filePath, slug);
}

const titleBySlug = Object.fromEntries(NEW_PLAYS.map((p) => [p.slug, p.title]));

for (const [slug, cfg] of Object.entries(EMBED_MAP)) {
  const title = titleBySlug[slug] ?? slug;
  for (const rel of cfg.files) {
    injectFile(path.join(KB_DOCS, rel), slug, title, cfg.minHeight ?? 480);
  }
}

console.log('Done.');
