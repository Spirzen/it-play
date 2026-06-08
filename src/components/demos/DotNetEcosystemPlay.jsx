import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  APP_CATEGORIES,
  MODES,
  NUGET_FLOW_NODES,
  NUGET_FLOW_SCENARIOS,
  NUGET_STRUCTURE,
  PACKAGE_GRAPH,
  PACKAGE_SCENARIOS,
  RUNTIME_NODES,
  RUNTIME_SCENARIOS,
  STACK_LAYERS,
  STACK_SCENARIOS,
  getVariantMeta,
} from '@/components/shared/kb/dotnetEcosystemEngine';
import baseStyles from '@/components/demos/JavaDatabasePlay.module.css';
import styles from '@/components/demos/DotNetEcosystemPlay.module.css';

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

function ScenarioTabs({player, shortPrefix = true}) {
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
          {shortPrefix ? s.title.split(' — ')[0] : s.title}
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

function StackMode() {
  const player = useStepPlayer(STACK_SCENARIOS, 'build-run');
  const isActive = (id) => player.spotlight.includes(id);

  return (
    <>
      <ScenarioTabs player={player} />
      <p className={styles.scenarioHint}>
        <strong>{player.scenario.title}</strong> — {player.scenario.subtitle}
      </p>
      <div className={styles.diagram} aria-label="Стек платформы .NET">
        {STACK_LAYERS.map((tier, tierIndex) => (
          <React.Fragment key={tier.id}>
            {tierIndex > 0 && (
              <div className={styles.connector} aria-hidden>
                <span
                  className={clsx(
                    styles.connectorLine,
                    player.packet === 'down' && tierIndex <= 3 && styles.connectorPulseDown,
                    player.packet === 'response' && tierIndex >= 3 && styles.connectorPulseUp,
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
      <StepCard player={player} />
      <StepControls player={player} />
    </>
  );
}

function RuntimeMode() {
  const player = useStepPlayer(RUNTIME_SCENARIOS, 'jit');
  const isActive = (id) => player.spotlight.includes(id);

  return (
    <>
      <ScenarioTabs player={player} />
      <p className={styles.scenarioHint}>
        <strong>{player.scenario.title}</strong> — {player.scenario.subtitle}
      </p>
      <div className={styles.runtimeGrid} aria-label="Компоненты CLR">
        {RUNTIME_NODES.map((node) => (
          <div
            key={node.id}
            className={clsx(styles.node, isActive(node.id) && styles.nodeActive)}
          >
            <span className={styles.nodeName}>{node.label}</span>
            <span className={styles.nodeRole}>{node.role}</span>
          </div>
        ))}
      </div>
      <StepCard player={player} />
      <StepControls player={player} />
    </>
  );
}

function PackagesMode() {
  const player = useStepPlayer(PACKAGE_SCENARIOS, 'add');
  const highlight = new Set(player.spotlight);

  const csprojSnippet = useMemo(() => {
    const refs = PACKAGE_GRAPH.packages
      .filter((p) => highlight.has(p.id) || highlight.has('project'))
      .map((p) => `  <PackageReference Include="${p.label}" Version="${p.version}" />`);
    if (refs.length === 0) {
      return `<Project Sdk="Microsoft.NET.Sdk.Web">\n  <PropertyGroup>\n    <TargetFramework>net8.0</TargetFramework>\n  </PropertyGroup>\n</Project>`;
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
          <p className={styles.projectTitle}>{PACKAGE_GRAPH.project.label}</p>
          <pre className={styles.codePanel}>{csprojSnippet}</pre>
        </div>
        <div className={styles.graphArea}>
          <p className={styles.graphTitle}>Граф NuGet-зависимостей</p>
          <div className={styles.pkgList}>
            {PACKAGE_GRAPH.packages.map((pkg) => (
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

function NuGetMode() {
  const player = useStepPlayer(NUGET_FLOW_SCENARIOS, 'install');
  const [structId, setStructId] = useState('lib');
  const structItem = NUGET_STRUCTURE.find((s) => s.id === structId) ?? NUGET_STRUCTURE[0];
  const activeNodes = new Set(player.spotlight);

  return (
    <>
      <ScenarioTabs player={player} />
      <p className={styles.scenarioHint}>
        <strong>{player.scenario.title}</strong> — {player.scenario.subtitle}
      </p>
      <div className={styles.flowRow} aria-label="Поток NuGet">
        {NUGET_FLOW_NODES.map((node, i) => (
          <React.Fragment key={node.id}>
            {i > 0 && <span className={styles.flowArrow} aria-hidden>→</span>}
            <div
              className={clsx(
                styles.flowNode,
                activeNodes.has(node.id) && styles.flowNodeActive,
              )}
            >
              <div className={styles.flowNodeLabel}>{node.label}</div>
              <div className={styles.flowNodeRole}>{node.role}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className={styles.graphTitle}>Структура .nupkg (нажмите папку)</p>
      <div className={styles.nupkgTree}>
        {NUGET_STRUCTURE.map((row) => (
          <button
            key={row.id}
            type="button"
            className={clsx(styles.nupkgRow, structId === row.id && styles.nupkgRowActive)}
            onClick={() => setStructId(row.id)}
          >
            <span className={styles.nupkgFolder}>{row.label}</span>
            <span>
              <strong style={{fontSize: '0.74rem'}}>{row.folder}</strong>
              <p className={styles.nupkgDesc}>{row.desc}</p>
            </span>
          </button>
        ))}
      </div>
      {structItem && (
        <p className={styles.frameworkDetail}>
          <strong>{structItem.label}</strong> — {structItem.desc}
        </p>
      )}
      <StepCard player={player} />
      <StepControls player={player} />
    </>
  );
}

function AppsMode() {
  const [categoryId, setCategoryId] = useState('ui');
  const [itemId, setItemId] = useState('maui');
  const category = APP_CATEGORIES.find((c) => c.id === categoryId) ?? APP_CATEGORIES[0];
  const item = category.items.find((i) => i.id === itemId) ?? category.items[0];

  return (
    <>
      <div className={styles.coreBadge} aria-hidden>
        <span>⚙️</span> CLR · BCL · SDK — общая основа для всех шаблонов
      </div>
      <div className={styles.appsHub}>
        <div className={styles.categoryList} role="tablist" aria-label="Категории">
          {APP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={categoryId === cat.id}
              className={clsx(
                styles.categoryBtn,
                categoryId === cat.id && styles.categoryBtnActive,
              )}
              onClick={() => {
                setCategoryId(cat.id);
                setItemId(cat.items[0]?.id);
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
        <div>
          <div className={styles.frameworkGrid}>
            {category.items.map((fw) => (
              <button
                key={fw.id}
                type="button"
                className={clsx(
                  styles.frameworkCard,
                  itemId === fw.id && styles.frameworkCardActive,
                )}
                onClick={() => setItemId(fw.id)}
              >
                <p className={styles.frameworkName}>{fw.name}</p>
                <p className={styles.frameworkStack}>{fw.stack}</p>
              </button>
            ))}
          </div>
          {item && (
            <div className={styles.frameworkDetail}>
              <strong>{item.name}</strong> ({item.stack}) — {item.note}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DotNetEcosystemPlayInner({variant = 'platform'}) {
  const meta = getVariantMeta(variant);
  const [mode, setMode] = useState(meta.defaultMode);

  useEffect(() => {
    setMode(meta.defaultMode);
  }, [variant, meta.defaultMode]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title={meta.title} subtitle={meta.subtitle}>
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

        {mode === 'stack' && <StackMode />}
        {mode === 'runtime' && <RuntimeMode />}
        {mode === 'packages' && <PackagesMode />}
        {mode === 'nuget' && <NuGetMode />}
        {mode === 'apps' && <AppsMode />}

        <p className={styles.footer}>{meta.footer}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default DotNetEcosystemPlayInner;
