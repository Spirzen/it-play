import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/OrgHierarchyPlay.module.css';

const STRUCTURES = [
  {id: 'linear', label: 'Линейная'},
  {id: 'functional', label: 'Функциональная'},
  {id: 'matrix', label: 'Матричная'},
  {id: 'project', label: 'Проектная'},
];

const LEVEL_META = {
  strategic: {label: 'Стратегический', className: styles.levelStrategic},
  tactical: {label: 'Тактический', className: styles.levelTactical},
  operational: {label: 'Операционный', className: styles.levelOperational},
  customer: {label: 'Заказчик', className: styles.levelCustomer},
};

const ORG_MODELS = {
  linear: {
    hint: 'Один руководитель — один подчинённый. Быстрые решения, но "бутылочные горлышки".',
    rows: [
      [{id: 'ceo', title: 'CEO', role: 'Стратегия', level: 'strategic'}],
      [{id: 'dir', title: 'Директор IT', role: 'Тактика', level: 'tactical'}],
      [{id: 'tl', title: 'Team Lead', role: 'Координация', level: 'tactical'}],
      [
        {id: 'dev', title: 'Разработчик', role: 'Исполнение', level: 'operational'},
        {id: 'qa', title: 'Тестировщик', role: 'Исполнение', level: 'operational'},
      ],
    ],
  },
  functional: {
    hint: 'Подразделения по компетенциям: разработка, QA, безопасность. Риск — "силосы" между отделами.',
    rows: [
      [{id: 'ceo', title: 'CEO', role: 'Стратегия', level: 'strategic'}],
      [
        {id: 'dev-dir', title: 'Директор разработки', role: 'Backend/Frontend', level: 'tactical'},
        {id: 'qa-dir', title: 'Директор QA', role: 'Качество', level: 'tactical'},
      ],
      [
        {id: 'be', title: 'Backend', role: 'Код', level: 'operational'},
        {id: 'fe', title: 'Frontend', role: 'UI', level: 'operational'},
        {id: 'qa', title: 'QA-группа', role: 'Тесты', level: 'operational'},
      ],
    ],
  },
  matrix: {
    hint: 'Два руководителя: функциональный (качество) и проектный (сроки). Нужна RACI-матрица.',
    rows: [
      [{id: 'ceo', title: 'CEO', role: 'Портфель', level: 'strategic'}],
      [
        {id: 'func', title: 'Tech Lead', role: 'Функциональный', level: 'tactical'},
        {id: 'pm', title: 'Project Manager', role: 'Проектный', level: 'tactical'},
      ],
      [{id: 'dev', title: 'Разработчик', role: 'Двойное подчинение', level: 'operational'}],
    ],
  },
  project: {
    hint: 'Временные сквады вокруг продукта. Гибкость выше, координация сложнее.',
    rows: [
      [{id: 'cust', title: 'Заказчик', role: 'Scope / SLA', level: 'customer'}],
      [{id: 'pm', title: 'PM подрядчика', role: 'Контракт', level: 'tactical'}],
      [
        {id: 'po', title: 'Product Owner', role: 'Приоритеты', level: 'tactical'},
        {id: 'tl', title: 'Tech Lead', role: 'Архитектура', level: 'tactical'},
      ],
      [
        {id: 'dev', title: 'Разработчик', role: 'Delivery', level: 'operational'},
        {id: 'qa', title: 'QA', role: 'Приёмка', level: 'operational'},
      ],
    ],
  },
};

const NODE_DETAILS = {
  ceo: 'Определяет миссию и цели на 3–10 лет. Решения нормативные, не операционные.',
  dir: 'Декомпозирует стратегию в планы на 6–24 месяца, координирует подразделения.',
  tl: 'Мост между тактикой и операцией: сроки, риски, 1:1, эскалация.',
  dev: 'Локальные решения в рамках процедур. Не меняет scope без согласования.',
  qa: 'Контроль качества в рамках заданных критериев приёмки.',
  'dev-dir': 'Владеет экспертизой домена, распределяет ресурсы внутри функции.',
  'qa-dir': 'Отвечает за стандарты тестирования и релизную дисциплину.',
  be: 'Реализация серверной логики; эскалация архитектуры — через Tech Lead.',
  fe: 'Интерфейсы и интеграция с API; согласование UX — через аналитика/PO.',
  func: 'Критерии качества кода, ревью, ADR. Конфликт с PM — эскалация директору.',
  pm: 'Сроки, бюджет, коммуникация с заказчиком. Не задаёт технологический стек напрямую.',
  po: 'Приоритет backlog. Не даёт указания разработчику в обход Team Lead.',
  cust: 'Де-факто уровень выше CEO подрядчика по влиянию на контракт. Общение — через PM.',
};

const COMM_RULES = {
  operational:
    'Не обращаться к заказчику или CEO напрямую без согласования руководителя. Фиксировать риски заранее.',
  tactical:
    'Фильтровать "шум" для стратегического уровня. Эскалировать только отклонения от SLA/бюджета/срока.',
  strategic: 'Не смешивать стратегию с тактикой: делегировать "как" и "когда" среднему звену.',
  customer: 'Запросы заказчика — через PM и change request, не через личные чаты с разработчиком.',
};

function OrgHierarchyPlayInner() {
  const [structureId, setStructureId] = useState('linear');
  const [selectedId, setSelectedId] = useState('tl');
  const [bypass, setBypass] = useState(false);

  const model = ORG_MODELS[structureId];
  const allNodes = useMemo(() => model.rows.flat(), [model]);
  const selected = allNodes.find((n) => n.id === selectedId) ?? allNodes[0];
  const levelMeta = LEVEL_META[selected.level];

  const bypassResult =
    bypass && selected.level === 'operational' && structureId === 'project'
      ? 'Нарушение: разработчик принял задачу от заказчика напрямую → обход PM, риск для контракта и traceability.'
      : bypass && selected.level === 'operational'
        ? 'Нарушение единоначалия: указание минует Team Lead. Дублирование решений и смещение ответственности.'
        : bypass
          ? 'Для этой роли прямой контакт допустим только в рамках официального канала (письмо, CR, встреча с PM).'
          : null;

  return (
    <DemoShell>
      <DemoCard
        title="Организационная иерархия"
        subtitle="Уровни управления, типы структуры и цепочка подчинения — нажмите на роль"
      >
        <div className={styles.chips}>
          {STRUCTURES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.chip, structureId === s.id && styles.chipActive)}
              onClick={() => {
                setStructureId(s.id);
                setBypass(false);
                setSelectedId(ORG_MODELS[s.id].rows[ORG_MODELS[s.id].rows.length - 1][0].id);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="it-demo__hint" style={{marginTop: 0, marginBottom: '0.55rem'}}>
          {model.hint}
        </p>

        <div className={styles.layout}>
          <div className={styles.treeWrap}>
            <div className={styles.tree}>
              {model.rows.map((row, ri) => (
                <React.Fragment key={ri}>
                  {ri > 0 && <div className={styles.connector} aria-hidden />}
                  <div className={styles.row}>
                    {row.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        className={clsx(
                          styles.node,
                          LEVEL_META[node.level].className,
                          selectedId === node.id && styles.nodeActive,
                        )}
                        onClick={() => {
                          setSelectedId(node.id);
                          setBypass(false);
                        }}
                      >
                        <strong>{node.title}</strong>
                        <small>{node.role}</small>
                      </button>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <aside className={styles.panel}>
            <span className={styles.badge} style={{background: 'var(--ifm-color-emphasis-200)'}}>
              {levelMeta.label}
            </span>
            <h5>{selected.title}</h5>
            <p>{NODE_DETAILS[selected.id] || selected.role}</p>
            <p>
              <strong>Субординация:</strong> {COMM_RULES[selected.level]}
            </p>
            {selected.level === 'operational' && (
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                style={{width: '100%', marginTop: '0.35rem'}}
                onClick={() => setBypass(true)}
              >
                Симуляция: запрос "в обход"
              </button>
            )}
            {bypassResult && (
              <div
                className={clsx(
                  styles.scenario,
                  bypassResult.startsWith('Нарушение') ? styles.scenarioWarn : styles.scenarioOk,
                )}
              >
                {bypassResult}
              </div>
            )}
          </aside>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default OrgHierarchyPlayInner;
