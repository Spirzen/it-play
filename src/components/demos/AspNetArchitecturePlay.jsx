import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import Link from '@/components/shared/KbLink';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  APP_MODELS,
  ASPNET_PACKAGE_GRAPH,
  ASPNET_PACKAGE_SCENARIOS,
  EVOLUTION_ERAS,
  META,
  MIDDLEWARE_CHAIN,
  MODES,
  REQUEST_LAYERS,
  REQUEST_SCENARIOS,
  SOLUTION_SCENARIOS,
  SOLUTION_TREE,
  TOOL_ITEMS,
} from '@/components/shared/kb/aspnetArchitectureEngine';
import baseStyles from '@/components/demos/JavaDatabasePlay.module.css';
import styles from '@/components/demos/AspNetArchitecturePlay.module.css';

function useStepPlayer(scenarios, defaultScenarioId) {
  const [scenarioId, setScenarioId] = useState(defaultScenarioId);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setSpotlight([]);
    setPacket(null);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight ?? step.highlight ?? step.nodes ?? []);
      setPacket(step.packet ?? null);
    },
    [scenario.steps],
  );

  const playScenario = useCallback(() => {
    clearTimers();
    setPlaying(true);
    setStepIndex(-1);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        schedule(() => run(i + 1), 2200);
      } else {
        schedule(() => setPlaying(false), 2200);
      }
    };
    schedule(() => run(0), 200);
  }, [applyStep, clearTimers, scenario.steps, schedule]);

  const stepManual = (delta) => {
    if (playing) return;
    const next = Math.max(0, Math.min(scenario.steps.length - 1, stepIndex + delta));
    applyStep(next);
  };

  const selectScenario = (id) => {
    if (playing) return;
    setScenarioId(id);
    reset();
  };

  return {
    scenario,
    scenarioId,
    currentStep,
    stepIndex,
    playing,
    spotlight,
    packet,
    reset,
    playScenario,
    stepManual,
    selectScenario,
    scenarios,
  };
}

function StepControls({player}) {
  const {scenario, stepIndex, playing, reset, playScenario, stepManual} = player;
  return (
    <>
      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={playScenario}
          disabled={playing}
        >
          {playing ? 'Воспроизведение…' : 'Пройти сценарий'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => stepManual(-1)}
          disabled={playing || stepIndex <= 0}
        >
          ← Назад
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => stepManual(1)}
          disabled={playing || stepIndex >= scenario.steps.length - 1}
        >
          Вперёд →
        </button>
        {stepIndex >= 0 && (
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        )}
      </div>
      <div className={styles.stepDots} aria-hidden>
        {scenario.steps.map((_, i) => (
          <span
            key={i}
            className={clsx(
              styles.stepDot,
              i <= stepIndex && styles.stepDotDone,
              i === stepIndex && styles.stepDotCurrent,
            )}
          />
        ))}
      </div>
    </>
  );
}

function ScenarioTabs({player}) {
  const {scenarios, scenarioId, playing, selectScenario} = player;
  return (
    <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии">
      {scenarios.map((s) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={scenarioId === s.id}
          disabled={playing}
          className={clsx(styles.scenarioTab, scenarioId === s.id && styles.scenarioTabActive)}
          onClick={() => selectScenario(s.id)}
        >
          {s.title.split(' — ')[0]}
        </button>
      ))}
    </div>
  );
}

function StepCard({player}) {
  const {scenario, currentStep, stepIndex} = player;
  if (!currentStep) return null;
  return (
    <div className={styles.stepCard}>
      <span className={styles.stepBadge}>
        Шаг {stepIndex + 1} / {scenario.steps.length}
      </span>
      <p className={styles.stepTitle}>{currentStep.label}</p>
      <p className={styles.stepDetail}>{currentStep.detail}</p>
    </div>
  );
}

function LayerDiagram({layers, player}) {
  const isActive = (id) => player.spotlight.includes(id);
  return (
    <div className={styles.diagram} aria-label="Слои архитектуры">
      {layers.map((tier, tierIndex) => (
        <React.Fragment key={tier.id}>
          {tierIndex > 0 && (
            <div className={styles.connector} aria-hidden>
              <span
                className={clsx(
                  styles.connectorLine,
                  player.packet === 'down' && tierIndex <= 3 && styles.connectorPulseDown,
                  player.packet === 'response' && tierIndex >= 2 && styles.connectorPulseUp,
                )}
              />
            </div>
          )}
          <section
            className={clsx(
              styles.tier,
              tier.nodes.some((n) => isActive(n.id)) && styles.tierActive,
            )}
          >
            <header className={styles.tierHeader}>
              <span className={styles.tierIcon}>{tier.icon}</span>
              <span className={styles.tierLabel}>{tier.label}</span>
              <span className={styles.tierShort}>{tier.short}</span>
            </header>
            <div className={styles.tierNodes}>
              {tier.nodes.map((node) => (
                <div
                  key={node.id}
                  className={clsx(styles.node, isActive(node.id) && styles.nodeActive)}
                >
                  <span className={styles.nodeName}>{node.label}</span>
                  <span className={styles.nodeRole}>{node.role}</span>
                </div>
              ))}
            </div>
          </section>
        </React.Fragment>
      ))}
    </div>
  );
}

function EvolutionMode() {
  const [eraId, setEraId] = useState('core');
  const era = EVOLUTION_ERAS.find((e) => e.id === eraId) ?? EVOLUTION_ERAS[3];

  const mwActive = eraId === 'core' ? new Set(MIDDLEWARE_CHAIN.map((m) => m.id)) : new Set();

  return (
    <>
      <div className={styles.timeline} role="list" aria-label="Эволюция ASP.NET">
        {EVOLUTION_ERAS.map((e) => (
          <button
            key={e.id}
            type="button"
            role="listitem"
            className={clsx(
              styles.eraCard,
              e.legacy && styles.eraCardLegacy,
              eraId === e.id && styles.eraCardActive,
            )}
            onClick={() => setEraId(e.id)}
          >
            <span className={styles.eraYear}>{e.year}</span>
            <span>
              <p className={styles.eraName}>
                {e.name}{' '}
                <span className={styles.eraTag}>{e.tag}</span>
              </p>
              <div className={styles.eraTraits}>
                {e.traits.map((t) => (
                  <span key={t} className={styles.eraTrait}>
                    {t}
                  </span>
                ))}
              </div>
            </span>
          </button>
        ))}
      </div>
      <p className={styles.eraDetail}>
        <strong>{era.name}</strong> — {era.note}
      </p>
      {eraId === 'core' && (
        <>
          <p className={styles.graphTitle}>Рекомендуемый порядок middleware</p>
          <div className={styles.middlewareStrip}>
            {MIDDLEWARE_CHAIN.map((mw) => (
              <span key={mw.id} className={clsx(styles.mwChip, mwActive.has(mw.id) && styles.mwChipActive)}>
                <span className={styles.mwOrder}>{mw.order}</span>
                {mw.label}
              </span>
            ))}
          </div>
        </>
      )}
      <p className={styles.graphTitle}>Инструменты экосистемы</p>
      <div className={styles.toolsGrid}>
        {TOOL_ITEMS.map((t) => (
          <div key={t.id} className={styles.toolChip}>
            <span className={styles.toolLabel}>{t.label}</span>
            <span className={styles.toolRole}>{t.role}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function RequestMode() {
  const player = useStepPlayer(REQUEST_SCENARIOS, 'api-get');
  return (
    <>
      <ScenarioTabs player={player} />
      <p className={styles.scenarioHint}>
        <strong>{player.scenario.title}</strong> — {player.scenario.subtitle}
      </p>
      <LayerDiagram layers={REQUEST_LAYERS} player={player} />
      <StepCard player={player} />
      <StepControls player={player} />
    </>
  );
}

const TREE_INDENT = {sln: 0, src: 1, program: 2, controllers: 2, pages: 2, services: 2, config: 2, tests: 1, docker: 1};

function SolutionMode() {
  const player = useStepPlayer(SOLUTION_SCENARIOS, 'new');
  const highlight = new Set(player.spotlight);
  const [selectedId, setSelectedId] = useState('program');
  const selected = SOLUTION_TREE.find((n) => n.id === selectedId) ?? SOLUTION_TREE[1];

  return (
    <>
      <ScenarioTabs player={player} />
      <p className={styles.scenarioHint}>
        <strong>{player.scenario.title}</strong> — {player.scenario.subtitle}
      </p>
      <div className={styles.solutionLayout}>
        <div className={styles.treePanel} aria-label="Структура решения">
          {SOLUTION_TREE.map((node) => {
            const indent = TREE_INDENT[node.id] ?? 0;
            return (
              <button
                key={node.id}
                type="button"
                className={clsx(
                  styles.treeRow,
                  indent === 1 && styles.treeIndent1,
                  indent === 2 && styles.treeIndent2,
                  (highlight.has(node.id) || selectedId === node.id) && styles.treeRowActive,
                )}
                onClick={() => setSelectedId(node.id)}
              >
                <span>{node.type === 'folder' || node.type === 'root' ? '📁' : '📄'} {node.label}</span>
                {node.role && <span className={styles.treeRole}>{node.role}</span>}
              </button>
            );
          })}
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepBadge}>Узел</span>
          <p className={styles.stepTitle}>{selected.label}</p>
          <p className={styles.stepDetail}>
            {selected.role ??
              'Solution объединяет веб-проект, тесты и Docker. Program.cs — точка сборки pipeline и DI.'}
          </p>
        </div>
      </div>
      <StepCard player={player} />
      <StepControls player={player} />
    </>
  );
}

function PackagesMode() {
  const player = useStepPlayer(ASPNET_PACKAGE_SCENARIOS, 'web');
  const highlight = new Set(player.spotlight);

  const csprojSnippet = useMemo(() => {
    const refs = ASPNET_PACKAGE_GRAPH.packages
      .filter((p) => highlight.has(p.id) || highlight.has('project'))
      .filter((p) => p.id !== 'shared' && p.id !== 'sdk-web')
      .map((p) => `  <PackageReference Include="${p.label}" Version="${p.version}" />`);
    if (refs.length === 0) {
      return `<Project Sdk="Microsoft.NET.Sdk.Web">\n  <PropertyGroup>\n    <TargetFramework>net10.0</TargetFramework>\n  </PropertyGroup>\n</Project>`;
    }
    return `<Project Sdk="Microsoft.NET.Sdk.Web">\n  <ItemGroup>\n${refs.join('\n')}\n  </ItemGroup>\n</Project>`;
  }, [highlight]);

  return (
    <>
      <ScenarioTabs player={player} />
      <p className={styles.scenarioHint}>
        <strong>{player.scenario.title}</strong> — {player.scenario.subtitle}
      </p>
      <div className={styles.packageLayout}>
        <div
          className={clsx(
            styles.projectBox,
            highlight.has('project') && styles.projectBoxActive,
          )}
        >
          <p className={styles.projectTitle}>{ASPNET_PACKAGE_GRAPH.project.label}</p>
          <pre className={styles.codePanel}>{csprojSnippet}</pre>
        </div>
        <div className={styles.graphArea}>
          <p className={styles.graphTitle}>Граф пакетов</p>
          <div className={styles.pkgList}>
            {ASPNET_PACKAGE_GRAPH.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={clsx(styles.pkgChip, highlight.has(pkg.id) && styles.pkgChipActive)}
              >
                <span className={styles.pkgName}>{pkg.label}</span>
                <span className={styles.pkgVer}>v{pkg.version}</span>
                {pkg.deps.length > 0 && (
                  <span className={styles.pkgVer}>→ {pkg.deps.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <StepCard player={player} />
      <StepControls player={player} />
    </>
  );
}

function ModelsMode() {
  const [modelId, setModelId] = useState('webapi');
  const model = APP_MODELS.find((m) => m.id === modelId) ?? APP_MODELS[1];

  return (
    <>
      <div className={styles.modelsGrid} role="tablist" aria-label="Модели разработки">
        {APP_MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={modelId === m.id}
            className={clsx(styles.modelCard, modelId === m.id && styles.modelCardActive)}
            onClick={() => setModelId(m.id)}
          >
            <p className={styles.modelName}>{m.name}</p>
            <p className={styles.modelStack}>{m.stack}</p>
            <div className={styles.flowRow} aria-hidden>
              {m.flow.map((step, i) => (
                <React.Fragment key={step}>
                  {i > 0 && <span className={styles.flowArrow}>→</span>}
                  <span className={styles.flowStep}>{step}</span>
                </React.Fragment>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className={styles.modelDetail}>
        <strong>{model.name}</strong> — {model.when}
        <div className={styles.flowRow} style={{marginTop: '0.5rem'}}>
          {model.flow.map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <span className={styles.flowArrow}>→</span>}
              <span className={styles.flowStep}>{step}</span>
            </React.Fragment>
          ))}
        </div>
        <Link className={styles.modelLink} to={model.link}>
          Практика в энциклопедии →
        </Link>
      </div>
    </>
  );
}

function AspNetArchitecturePlayInner() {
  const [mode, setMode] = useState('evolution');

  return (
    <DemoShell className={styles.root}>
      <DemoCard title={META.title} subtitle={META.subtitle}>
        <div className={styles.accentBar} aria-hidden />
        <div className={baseStyles.modeTabs} role="tablist" aria-label="Режимы демо">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(baseStyles.modeTab, mode === m.id && baseStyles.modeTabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'evolution' && <EvolutionMode />}
        {mode === 'request' && <RequestMode />}
        {mode === 'solution' && <SolutionMode />}
        {mode === 'packages' && <PackagesMode />}
        {mode === 'models' && <ModelsMode />}

        <p className={styles.footer}>{META.footer}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default AspNetArchitecturePlayInner;
