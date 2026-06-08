import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BUILD_SUBSTEPS,
  DEMO_COMMITS,
  DEPLOY_SUBSTEPS,
  ENV_LABELS,
  INITIAL_ENVIRONMENTS,
  PIPELINE_STEPS,
  applyDeploymentToEnvironments,
  createDeployment,
  createLog,
  delay,
  envStatusLabel,
  generateTestSuite,
} from '@/components/shared/kb/cicdEngine';
import {useTerminalBodyScroll} from '@/components/shared/kb/useTerminalBodyScroll';
import styles from '@/components/demos/CicdDemo.module.css';

const GITLAB_YAML = `# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm run build

test:
  stage: test
  script:
    - npm test

deploy_production:
  stage: deploy
  script:
    - npm run deploy:prod
  only:
    - main
  when: manual`;

const GITHUB_YAML = `# .github/workflows/ci.yml
name: CI/CD
on:
  push:
    branches: [main, develop]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy:prod`;

function stepState(stepIndex, currentIndex, status) {
  if (status === 'failed' && stepIndex === currentIndex) return 'failed';
  if (stepIndex < currentIndex) return 'done';
  if (stepIndex === currentIndex && status === 'running') return 'active';
  if (stepIndex === currentIndex && status === 'success') return 'done';
  return 'pending';
}

function CicdDemoInner() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [pipelineStatus, setPipelineStatus] = useState('idle');
  const [stepIndex, setStepIndex] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [testResults, setTestResults] = useState({passed: 0, failed: 0, total: 0});
  const [buildNumber, setBuildNumber] = useState(1);
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [environments, setEnvironments] = useState(INITIAL_ENVIRONMENTS);

  const logsRef = useRef(null);
  const runningRef = useRef(false);

  const pushLog = useCallback((message, type = 'info') => {
    setLogs((prev) => [...prev, createLog(message, type)]);
  }, []);

  useTerminalBodyScroll(logsRef, [logs]);

  const runTests = useCallback(async () => {
    pushLog('Запуск тестов…', 'info');
    await delay(600);
    const tests = generateTestSuite();
    const passed = tests.filter((t) => t.passed).length;
    const failed = tests.length - passed;
    setTestResults({passed, failed, total: tests.length});
    tests.forEach((t) => {
      pushLog(
        `${t.passed ? '✓' : '✗'} ${t.name} (${t.time})`,
        t.passed ? 'success' : 'error',
      );
    });
    pushLog(`Итого: ${passed}/${tests.length} пройдено`, failed === 0 ? 'success' : 'warning');
    return failed === 0;
  }, [pushLog]);

  const runBuild = useCallback(async () => {
    pushLog('Сборка приложения…', 'info');
    for (const step of BUILD_SUBSTEPS) {
      pushLog(`  → ${step}`, 'info');
      await delay(220);
      pushLog(`  ✓ ${step}`, 'success');
    }
    const next = buildNumber + 1;
    setBuildNumber(next);
    pushLog(`Сборка #${next} завершена`, 'success');
    return true;
  }, [buildNumber, pushLog]);

  const deployToEnvironment = useCallback(
    async (environment) => {
      pushLog(`Деплой на ${environment.toUpperCase()}…`, 'info');
      for (const step of DEPLOY_SUBSTEPS(environment)) {
        pushLog(`  → ${step}`, 'info');
        await delay(200);
        pushLog(`  ✓ ${step}`, 'success');
      }
      const deployment = createDeployment(environment, buildNumber);
      setDeployments((prev) => [deployment, ...prev]);
      setEnvironments((prev) => applyDeploymentToEnvironments(prev, deployment));
      pushLog(`Деплой ${deployment.version} на ${environment} — OK`, 'success');
      return true;
    },
    [buildNumber, pushLog],
  );

  const runFullPipeline = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setPipelineStatus('running');
    setLogs([]);
    setStepIndex(0);

    const advance = async (idx) => {
      setStepIndex(idx);
      await delay(80);
    };

    try {
      pushLog('═══ CI/CD PIPELINE START ═══', 'info');
      await advance(0);
      pushLog('Checkout: main @ a7f3e8d', 'success');

      await advance(1);
      pushLog('npm ci — 847 packages', 'success');

      await advance(2);
      pushLog('ESLint: 0 errors, 2 warnings', 'success');

      await advance(3);
      const testsOk = await runTests();
      if (!testsOk) {
        setPipelineStatus('failed');
        pushLog('Пайплайн остановлен: тесты не пройдены', 'error');
        return;
      }

      await advance(4);
      await runBuild();

      await advance(5);
      pushLog('Snyk scan — уязвимостей нет', 'success');

      await advance(6);
      await deployToEnvironment('staging');

      await advance(7);
      pushLog('Smoke-тесты staging — OK', 'success');

      await advance(8);
      if (autoDeploy) {
        await deployToEnvironment('production');
      } else {
        pushLog('Production: ожидает ручного подтверждения', 'warning');
      }

      setStepIndex(PIPELINE_STEPS.length);
      setPipelineStatus('success');
      pushLog('═══ PIPELINE SUCCESS ═══', 'success');
    } finally {
      runningRef.current = false;
    }
  }, [autoDeploy, deployToEnvironment, pushLog, runBuild, runTests]);

  const badgeClass = {
    idle: styles.badgeIdle,
    running: styles.badgeRunning,
    success: styles.badgeSuccess,
    failed: styles.badgeFailed,
  };

  const badgeLabel = {
    idle: 'Готов к запуску',
    running: 'Выполняется…',
    success: 'Успешно',
    failed: 'Ошибка',
  };

  const logClass = {
    success: styles.logSuccess,
    error: styles.logError,
    warning: styles.logWarning,
  };

  return (
    <DemoShell>
      <div className={styles.root}>
        <header className={styles.hero}>
          <h1 className={styles.title}>CI/CD Pipeline</h1>
          <p className={styles.subtitle}>
            Continuous Integration & Continuous Deployment — интерактивная демонстрация
          </p>
          <span className={clsx(styles.badge, badgeClass[pipelineStatus])}>
            {pipelineStatus === 'running' && '◉ '}
            {badgeLabel[pipelineStatus]}
          </span>
        </header>

        <div className={styles.tabs}>
          {[
            ['pipeline', 'Pipeline'],
            ['environments', 'Окружения'],
            ['guide', 'Справка'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={clsx(styles.tab, activeTab === id && styles.tabActive)}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'pipeline' && (
          <>
            <div className={styles.pipelineTrack} aria-label="Шаги пайплайна">
              {PIPELINE_STEPS.map((step, i) => {
                const state = stepState(i, stepIndex, pipelineStatus);
                return (
                  <div
                    key={step.id}
                    className={clsx(
                      styles.pipelineStep,
                      state === 'active' && styles.stepActive,
                      state === 'done' && styles.stepDone,
                      state === 'failed' && styles.stepFailed,
                      state === 'pending' && styles.stepPending,
                    )}
                  >
                    <div className={styles.stepDot}>{state === 'done' ? '✓' : i + 1}</div>
                    <span className={styles.stepLabel}>{step.short}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Управление</h3>
                <div className={styles.controls}>
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--primary"
                    onClick={runFullPipeline}
                    disabled={pipelineStatus === 'running'}
                  >
                    Запустить пайплайн
                  </button>
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--secondary"
                    onClick={() => setLogs([])}
                  >
                    Очистить логи
                  </button>
                </div>
                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={autoDeploy}
                    onChange={(e) => setAutoDeploy(e.target.checked)}
                  />
                  Автодеплой на production после staging
                </label>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Логи</h3>
                <div ref={logsRef} className={styles.logs}>
                  {logs.length === 0 ? (
                    <div className={styles.logEmpty}>Нажмите "Запустить пайплайн"</div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className={styles.logLine}>
                        <span className={styles.logTs}>[{log.timestamp}]</span>
                        <span className={logClass[log.type]}>{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Последние коммиты</h3>
                {DEMO_COMMITS.map((c) => (
                  <div key={c.hash} className={styles.commitRow}>
                    <span className={styles.commitHash}>{c.hash.slice(0, 7)}</span> {c.message}
                    <div className={styles.commitMeta}>
                      {c.author} · {c.time}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Тесты</h3>
                <div className={styles.testStats}>
                  <div className={styles.testStat}>
                    <div className={clsx(styles.testValue, styles.testPassed)}>
                      {testResults.passed}
                    </div>
                    <div>Пройдено</div>
                  </div>
                  <div className={styles.testStat}>
                    <div className={clsx(styles.testValue, styles.testFailed)}>
                      {testResults.failed}
                    </div>
                    <div>Провалено</div>
                  </div>
                  <div className={styles.testStat}>
                    <div className={styles.testValue}>{testResults.total}</div>
                    <div>Всего</div>
                  </div>
                </div>
                {testResults.total > 0 && (
                  <p style={{textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem'}}>
                    Успешность: {Math.round((testResults.passed / testResults.total) * 100)}%
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'environments' && (
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Окружения</h3>
              {Object.entries(environments).map(([env, data]) => (
                <div key={env} className={styles.envCard}>
                  <div className={styles.envHead}>
                    <strong>{ENV_LABELS[env]}</strong>
                    <span
                      className={clsx(
                        styles.envBadge,
                        env === 'development' && styles.envDev,
                        env === 'staging' && styles.envStaging,
                        env === 'production' && styles.envProd,
                      )}
                    >
                      {env}
                    </span>
                  </div>
                  <div>
                    Версия: <span className={styles.envVersion}>{data.version}</span>
                  </div>
                  <div>Статус: {envStatusLabel(data.status)}</div>
                  <div>Деплой: {data.lastDeploy}</div>
                  <div>
                    URL:{' '}
                    <a href={`https://${data.url}`} target="_blank" rel="noreferrer">
                      {data.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
                    style={{marginTop: '0.5rem'}}
                    disabled={pipelineStatus === 'running'}
                    onClick={() => {
                      if (window.confirm(`Деплоить на ${env}?`)) {
                        deployToEnvironment(env);
                      }
                    }}
                  >
                    Деплой на {env}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>История деплоев</h3>
              {deployments.length === 0 ? (
                <p className={styles.logEmpty}>Запустите пайплайн или деплой вручную</p>
              ) : (
                deployments.map((d) => (
                  <div key={d.id} className={styles.deployItem}>
                    <span
                      className={clsx(
                        styles.envBadge,
                        d.environment === 'development' && styles.envDev,
                        d.environment === 'staging' && styles.envStaging,
                        d.environment === 'production' && styles.envProd,
                      )}
                    >
                      {d.environment}
                    </span>{' '}
                    <strong>{d.version}</strong> · build #{d.buildNumber}
                    <div style={{fontSize: '0.8rem', marginTop: '0.25rem'}}>{d.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Что такое CI/CD?</h3>
                <p>
                  <strong>CI</strong> — частые слияния в общую ветку с автосборкой и тестами.
                </p>
                <p>
                  <strong>CD</strong> — автоматическая подготовка и выкладка релиза на окружения.
                </p>
                <ul>
                  <li>Быстрая обратная связь</li>
                  <li>Меньше "интеграционного ада"</li>
                  <li>Предсказуемые релизы</li>
                </ul>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Инструменты</h3>
                <ul>
                  <li>GitHub Actions, GitLab CI</li>
                  <li>Jenkins, CircleCI</li>
                  <li>Azure DevOps</li>
                </ul>
              </div>
            </div>
            <div className={styles.card} style={{marginTop: '1rem'}}>
              <h3 className={styles.cardTitle}>.gitlab-ci.yml</h3>
              <pre className={styles.codeBlock}>{GITLAB_YAML}</pre>
            </div>
            <div className={styles.card} style={{marginTop: '1rem'}}>
              <h3 className={styles.cardTitle}>GitHub Actions</h3>
              <pre className={styles.codeBlock}>{GITHUB_YAML}</pre>
            </div>
            <div className={styles.infoBox}>
              <strong>DORA-метрики:</strong> частота деплоев, lead time, MTTR, change failure rate.
              Elite-команды деплоят многократно в день и восстанавливаются менее чем за час.
            </div>
          </>
        )}
      </div>
    </DemoShell>
  );
}

export default CicdDemoInner;
