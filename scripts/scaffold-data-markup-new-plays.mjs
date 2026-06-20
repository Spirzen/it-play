/**
 * Scaffolds meta.json + plays-manifest entries for new data-markup plays.
 * Component .jsx files are authored separately in src/components/demos/.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PLAYS_DIR = path.join(ROOT, 'plays', 'data-markup');
const MANIFEST_PATH = path.join(ROOT, 'scripts', 'plays-manifest.json');

/** @type {Array<{key:string, slug:string, title:string, component:string, url:string, order:number}>} */
export const NEW_PLAYS = [
  {key: 'EndiannessBytePlay', slug: 'endianness-byte-play', title: 'Endianness — порядок байтов', component: 'endianness-byte-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-01-prodvinutye-operatsii-s-dannymi/113', order: 60},
  {key: 'DataPipelinePlay', slug: 'data-pipeline-play', title: 'Конвейер обработки данных', component: 'data-pipeline-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-01-prodvinutye-operatsii-s-dannymi/1', order: 61},
  {key: 'BitMaskPlay', slug: 'bit-mask-play', title: 'Битовые маски', component: 'bit-mask-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-01-prodvinutye-operatsii-s-dannymi/113', order: 62},
  {key: 'HashCollisionPlay', slug: 'hash-collision-play', title: 'Коллизии хеш-таблицы', component: 'hash-collision-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-02-struktury-dannyh/2', order: 63},
  {key: 'BTreePagePlay', slug: 'b-tree-page-play', title: 'B-дерево и страницы', component: 'b-tree-page-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-02-struktury-dannyh/2', order: 64},
  {key: 'ProbabilisticStructuresPlay', slug: 'probabilistic-structures-play', title: 'Bloom filter', component: 'probabilistic-structures-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-02-struktury-dannyh/2', order: 65},
  {key: 'StructurePickerQuiz', slug: 'structure-picker-quiz', title: 'Выбор структуры данных', component: 'structure-picker-quiz', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-02-struktury-dannyh/3', order: 66},
  {key: 'RelationalAlgebraPlay', slug: 'relational-algebra-play', title: 'Реляционная алгебра', component: 'relational-algebra-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/322', order: 67},
  {key: 'GraphTheoryPlay', slug: 'graph-theory-play', title: 'Теория графов', component: 'graph-theory-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/323', order: 68},
  {key: 'MatrixTransformPlay', slug: 'matrix-transform-play', title: 'Матричные преобразования', component: 'matrix-transform-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/34', order: 69},
  {key: 'ProbabilityBayesPlay', slug: 'probability-bayes-play', title: 'Байес — условная вероятность', component: 'probability-bayes-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/35', order: 70},
  {key: 'GrammarDerivationPlay', slug: 'grammar-derivation-play', title: 'Вывод в КС-грамматике', component: 'grammar-derivation-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/41', order: 71},
  {key: 'TuringMachinePlay', slug: 'turing-machine-play', title: 'Машина Тьюринга', component: 'turing-machine-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/45', order: 72},
  {key: 'OntologyGraphPlay', slug: 'ontology-graph-play', title: 'Онтология и граф знаний', component: 'ontology-graph-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-03-myslitelnaya-baza/328', order: 73},
  {key: 'CsvParsePlay', slug: 'csv-parse-play', title: 'CSV — разбор', component: 'csv-parse-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-04-konfiguratsii-i-dannye/219', order: 74},
  {key: 'TomlJsonComparePlay', slug: 'toml-json-compare-play', title: 'TOML ↔ JSON', component: 'toml-json-compare-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-04-konfiguratsii-i-dannye/218', order: 75},
  {key: 'JsonSchemaValidatorPlay', slug: 'json-schema-validator-play', title: 'JSON Schema', component: 'json-schema-validator-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-04-konfiguratsii-i-dannye/220', order: 76},
  {key: 'GraphQLQueryPlay', slug: 'graph-ql-query-play', title: 'GraphQL — запрос', component: 'graph-ql-query-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-04-konfiguratsii-i-dannye/221', order: 77},
  {key: 'ProtobufWirePlay', slug: 'protobuf-wire-play', title: 'Protobuf wire format', component: 'protobuf-wire-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-04-konfiguratsii-i-dannye/216', order: 78},
  {key: 'ParquetColumnPlay', slug: 'parquet-column-play', title: 'Parquet — колоночное хранение', component: 'parquet-column-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-04-konfiguratsii-i-dannye/222', order: 79},
  {key: 'CoddRulesCheckerPlay', slug: 'codd-rules-checker-play', title: '12 правил Кодда', component: 'codd-rules-checker-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-05-osnovy-baz-dannyh/5', order: 80},
  {key: 'NormalizationPlay', slug: 'normalization-play', title: 'Нормализация БД', component: 'normalization-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-07-sql/103', order: 81},
  {key: 'AcidTransactionPlay', slug: 'acid-transaction-play', title: 'ACID и транзакции', component: 'acid-transaction-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-05-osnovy-baz-dannyh/4', order: 82},
  {key: 'WalRecoveryPlay', slug: 'wal-recovery-play', title: 'WAL и восстановление', component: 'wal-recovery-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-05-osnovy-baz-dannyh/8', order: 83},
  {key: 'SqlWindowFunctionsPlay', slug: 'sql-window-functions-play', title: 'SQL — оконные функции', component: 'sql-window-functions-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-07-sql/7', order: 84},
  {key: 'SqlExecutionOrderPlay', slug: 'sql-execution-order-play', title: 'Порядок выполнения SQL', component: 'sql-execution-order-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-07-sql/2', order: 85},
  {key: 'SqlNullLogicPlay', slug: 'sql-null-logic-play', title: 'SQL и NULL', component: 'sql-null-logic-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-07-sql/103', order: 86},
  {key: 'SqlIndexComparePlay', slug: 'sql-index-compare-play', title: 'Seq Scan vs Index Scan', component: 'sql-index-compare-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-07-sql/44', order: 87},
  {key: 'PostgresTuningSandboxPlay', slug: 'postgres-tuning-sandbox-play', title: 'PostgreSQL — tuning', component: 'postgres-tuning-sandbox-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-08-upravlenie-rsubd/2', order: 88},
  {key: 'VacuumBloatPlay', slug: 'vacuum-bloat-play', title: 'VACUUM и bloat', component: 'vacuum-bloat-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-08-upravlenie-rsubd/2', order: 89},
  {key: 'PgHbaRulePlay', slug: 'pg-hba-rule-play', title: 'pg_hba.conf', component: 'pg-hba-rule-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-08-upravlenie-rsubd/2', order: 90},
  {key: 'BackupRestoreTimelinePlay', slug: 'backup-restore-timeline-play', title: 'Backup и PITR', component: 'backup-restore-timeline-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-08-upravlenie-rsubd/2', order: 91},
  {key: 'WebComponentsPlay', slug: 'web-components-play', title: 'Web Components', component: 'web-components-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-09-html/25', order: 92},
  {key: 'CssHasPlay', slug: 'css-has-play', title: 'CSS :has()', component: 'css-has-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-10-css/114', order: 93},
  {key: 'CssSpecificityCalculatorPlay', slug: 'css-specificity-calculator-play', title: 'Специфичность CSS', component: 'css-specificity-calculator-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-10-css/5', order: 94},
  {key: 'A11yLandmarksPlay', slug: 'a11y-landmarks-play', title: 'A11y — landmarks', component: 'a11y-landmarks-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-09-html/21', order: 95},
  {key: 'StatisticsTrapsPlay', slug: 'statistics-traps-play', title: 'Ловушки статистики', component: 'statistics-traps-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-11-analiz-dannyh/3', order: 96},
  {key: 'GoodhartMetricPlay', slug: 'goodhart-metric-play', title: 'Закон Гудхарта', component: 'goodhart-metric-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-11-analiz-dannyh/3', order: 97},
  {key: 'RegressionLinePlay', slug: 'regression-line-play', title: 'Линейная регрессия', component: 'regression-line-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-11-analiz-dannyh/2', order: 98},
  {key: 'TimeSeriesDecomposePlay', slug: 'time-series-decompose-play', title: 'Декомпозиция ряда', component: 'time-series-decompose-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-11-analiz-dannyh/424', order: 99},
  {key: 'CapTheoremPlay', slug: 'cap-theorem-play', title: 'CAP-теорема', component: 'cap-theorem-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-06-nosql/intro', order: 100},
  {key: 'ConsistencyModelPlay', slug: 'consistency-model-play', title: 'Модели согласованности', component: 'consistency-model-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-06-nosql/1', order: 101},
  {key: 'NosqlChooserPlay', slug: 'nosql-chooser-play', title: 'Выбор NoSQL', component: 'nosql-chooser-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-06-nosql/intro', order: 102},
  {key: 'GaussianEliminationPlay', slug: 'gaussian-elimination-play', title: 'Жордан–Гаусс', component: 'gaussian-elimination-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-12-matematicheskoe-programmirovanie/3', order: 103},
  {key: 'TransportProblemPlay', slug: 'transport-problem-play', title: 'Транспортная задача', component: 'transport-problem-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-12-matematicheskoe-programmirovanie/intro', order: 104},
  {key: 'IntegerLpCuttingPlay', slug: 'integer-lp-cutting-play', title: 'Целочисленное LP', component: 'integer-lp-cutting-play', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-12-matematicheskoe-programmirovanie/intro', order: 105},
];

function writeMeta(play) {
  const dir = path.join(PLAYS_DIR, play.slug);
  fs.mkdirSync(dir, {recursive: true});
  const meta = {
    title: play.title,
    description: `Интерактивное демо «${play.title}» — раздел Энциклопедия · Данные и разметка.`,
    category: 'data-markup',
    categoryTitle: 'Энциклопедия · Данные и разметка',
    component: play.component,
    tags: ['data-markup', 'encyclopedia'],
    encyclopediaUrl: play.url,
    order: play.order,
  };
  fs.writeFileSync(path.join(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
}

function updateManifest() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  for (const play of NEW_PLAYS) {
    manifest[play.key] = {
      example: `data-markup/${play.slug}`,
      title: play.title,
      component: play.component,
    };
  }
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

for (const play of NEW_PLAYS) {
  writeMeta(play);
}
updateManifest();
console.log(`Scaffolded ${NEW_PLAYS.length} plays.`);
