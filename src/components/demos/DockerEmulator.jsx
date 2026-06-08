import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  BUILD_STEPS,
  DOCKER_QUICK_COMMANDS,
  INITIAL_CONTAINERS,
  INITIAL_IMAGES,
  buildImage,
  createLog,
  dockerStats,
  helpLogs,
  imageRef,
  listImages,
  listRunningContainers,
  parseTerminalCommand,
  pullImage,
  pushImage,
  removeContainer,
  removeImage,
  runContainer,
  shortId,
  startContainer,
  stopContainer,
  welcomeLogs,
} from '@/components/shared/kb/dockerEngine';
import {useTerminalBodyScroll} from '@/components/shared/kb/useTerminalBodyScroll';
import styles from '@/components/demos/DockerEmulator.module.css';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const LOG_CLASS = {
  error: styles.logError,
  success: styles.logSuccess,
  warning: styles.logWarn,
};

function DockerEmulatorInner() {
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [logs, setLogs] = useState(welcomeLogs);
  const [terminalInput, setTerminalInput] = useState('');
  const [pullName, setPullName] = useState('');
  const [buildCtx, setBuildCtx] = useState('');
  const [runImage, setRunImage] = useState('');
  const [runName, setRunName] = useState('');
  const [pushName, setPushName] = useState('');
  const [busy, setBusy] = useState(false);

  const termBodyRef = useRef(null);

  const appendLogs = useCallback((entries) => {
    setLogs((prev) => [...prev, ...entries]);
  }, []);

  useTerminalBodyScroll(termBodyRef, [logs, busy]);

  const runAsync = useCallback(async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }, []);

  const handlePull = () =>
    runAsync(async () => {
      appendLogs([createLog(`Pulling ${pullName || '…'}`, 'info', 'pull')]);
      await wait(900);
      const result = pullImage(images, pullName);
      if (result.ok) setImages(result.images);
      appendLogs(result.logs);
      if (result.ok) setPullName('');
    });

  const handleBuild = () =>
    runAsync(async () => {
      appendLogs([createLog(`Building from ${buildCtx || '…'}`, 'info', 'build')]);
      await wait(1200);
      for (const step of BUILD_STEPS) {
        appendLogs([createLog(step, 'info', 'build')]);
        await wait(180);
      }
      const result = buildImage(images, buildCtx);
      if (result.ok) setImages(result.images);
      appendLogs(result.logs.slice(1));
      if (result.ok) setBuildCtx('');
    });

  const handleRun = () =>
    runAsync(async () => {
      await wait(700);
      const result = runContainer(images, containers, runImage, runName);
      if (result.ok) {
        setContainers(result.containers);
        setRunImage('');
        setRunName('');
      }
      appendLogs(result.logs);
    });

  const handlePush = () =>
    runAsync(async () => {
      appendLogs([createLog(`Pushing ${pushName || '…'}`, 'info', 'push')]);
      await wait(1000);
      const result = pushImage(images, pushName);
      appendLogs(result.logs);
      if (result.ok) setPushName('');
    });

  const runTerminal = useCallback(
    (raw) => {
      const parsed = parseTerminalCommand(raw);
      if (parsed.type === 'noop') return;

      if (parsed.type === 'clear') {
        setLogs(welcomeLogs());
        setTerminalInput('');
        return;
      }
      if (parsed.type === 'help') {
        appendLogs(helpLogs());
        setTerminalInput('');
        return;
      }
      if (parsed.type === 'ps') {
        appendLogs(listRunningContainers(containers));
        setTerminalInput('');
        return;
      }
      if (parsed.type === 'images') {
        appendLogs(listImages(images));
        setTerminalInput('');
        return;
      }
      appendLogs([
        createLog(`Unknown command: ${parsed.raw}. Type help`, 'error', 'unknown'),
      ]);
      setTerminalInput('');
    },
    [appendLogs, containers, images],
  );

  const stats = dockerStats(images, containers);

  return (
    <DemoShell>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.buttons}>
            <button
              type="button"
              className={clsx(styles.winBtn, styles.winBtnRed)}
              aria-label="Очистить терминал"
              onClick={() => setLogs(welcomeLogs())}
            />
            <button
              type="button"
              className={clsx(styles.winBtn, styles.winBtnYellow)}
              aria-label="Справка"
              onClick={() => appendLogs(helpLogs())}
            />
          </div>
          <div className={styles.title}>docker — universe-it training</div>
          <div className={styles.stats}>
            <span className={styles.stat}>{stats.imageCount} images</span>
            <span className={styles.stat}>
              {stats.running}/{stats.containerCount} up
            </span>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.actions}>
            <div className={clsx(styles.actionCard, styles.actionCardPull)}>
              <h3 className={styles.actionTitle}>docker pull</h3>
              <div className={styles.actionRow}>
                <input
                  className={styles.input}
                  value={pullName}
                  onChange={(e) => setPullName(e.target.value)}
                  placeholder="ubuntu:22.04"
                  disabled={busy}
                />
                <button type="button" className={styles.btn} disabled={busy} onClick={handlePull}>
                  Pull
                </button>
              </div>
            </div>
            <div className={clsx(styles.actionCard, styles.actionCardBuild)}>
              <h3 className={styles.actionTitle}>docker build</h3>
              <div className={styles.actionRow}>
                <input
                  className={styles.input}
                  value={buildCtx}
                  onChange={(e) => setBuildCtx(e.target.value)}
                  placeholder="./Dockerfile"
                  disabled={busy}
                />
                <button type="button" className={styles.btn} disabled={busy} onClick={handleBuild}>
                  Build
                </button>
              </div>
            </div>
            <div className={clsx(styles.actionCard, styles.actionCardRun)}>
              <h3 className={styles.actionTitle}>docker run</h3>
              <select
                className={styles.select}
                value={runImage}
                onChange={(e) => setRunImage(e.target.value)}
                disabled={busy}
              >
                <option value="">Образ</option>
                {images.map((img) => (
                  <option key={img.id} value={imageRef(img)}>
                    {imageRef(img)}
                  </option>
                ))}
              </select>
              <div className={styles.actionRow} style={{marginTop: '0.35rem'}}>
                <input
                  className={styles.input}
                  value={runName}
                  onChange={(e) => setRunName(e.target.value)}
                  placeholder="container-name"
                  disabled={busy}
                />
                <button
                  type="button"
                  className={styles.btn}
                  disabled={busy || !runImage || !runName.trim()}
                  onClick={handleRun}
                >
                  Run
                </button>
              </div>
            </div>
            <div className={clsx(styles.actionCard, styles.actionCardPush)}>
              <h3 className={styles.actionTitle}>docker push</h3>
              <div className={styles.actionRow}>
                <input
                  className={styles.input}
                  value={pushName}
                  onChange={(e) => setPushName(e.target.value)}
                  placeholder="user/repo:tag"
                  disabled={busy}
                />
                <button type="button" className={styles.btn} disabled={busy} onClick={handlePush}>
                  Push
                </button>
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <span>Images ({images.length})</span>
                <button type="button" className={styles.miniBtn} onClick={() => appendLogs(listImages(images))}>
                  list
                </button>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.tableHead}>
                  <span>REPOSITORY</span>
                  <span>ID</span>
                  <span>SIZE</span>
                  <span />
                </div>
                {images.map((img) => (
                  <div key={img.id} className={styles.tableRow}>
                    <span>{imageRef(img)}</span>
                    <span>{shortId(img.id)}</span>
                    <span>{img.size}</span>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => {
                        const r = removeImage(images, containers, img.id);
                        if (r.ok) setImages(r.images);
                        appendLogs(r.logs);
                      }}
                    >
                      rmi
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <span>Containers ({containers.length})</span>
                <button
                  type="button"
                  className={styles.miniBtn}
                  onClick={() => appendLogs(listRunningContainers(containers))}
                >
                  ps
                </button>
              </div>
              <div className={styles.panelBody}>
                {containers.map((c) => (
                  <div
                    key={c.id}
                    className={clsx(
                      styles.containerCard,
                      c.status === 'exited' && styles.containerCardExited,
                    )}
                  >
                    <div className={styles.containerTop}>
                      <div>
                        <div className={styles.containerName}>
                          <span className={styles.statusDot} />
                          {c.name}
                        </div>
                        <div className={styles.containerMeta}>
                          {c.image} · {shortId(c.id)} · {c.ports}
                        </div>
                      </div>
                      <div className={styles.containerActions}>
                        {c.status === 'exited' ? (
                          <button
                            type="button"
                            className={styles.miniBtn}
                            onClick={() => {
                              const r = startContainer(containers, c.id);
                              setContainers(r.containers);
                              appendLogs(r.logs);
                            }}
                          >
                            start
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.miniBtn}
                            onClick={() => {
                              const r = stopContainer(containers, c.id);
                              setContainers(r.containers);
                              appendLogs(r.logs);
                            }}
                          >
                            stop
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.dangerBtn}
                          onClick={() => {
                            const r = removeContainer(containers, c.id);
                            if (r.ok) setContainers(r.containers);
                            appendLogs(r.logs);
                          }}
                        >
                          rm
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className={styles.terminal}>
            <div className={styles.termHead}>
              <span>Terminal</span>
              <button type="button" className={styles.miniBtn} onClick={() => setLogs(welcomeLogs())}>
                clear
              </button>
            </div>
            <div ref={termBodyRef} className={styles.termBody}>
              {logs.map((log) => (
                <div key={log.id} className={styles.logLine}>
                  <span className={styles.logTime}>[{log.time}]</span>
                  {log.command !== 'system' && (
                    <span className={styles.logCmd}> [{log.command}]</span>
                  )}
                  <span className={LOG_CLASS[log.type] ?? ''}> {log.message}</span>
                </div>
              ))}
              <div className={styles.inputRow}>
                <span className={styles.prompt}>$</span>
                <input
                  className={styles.termInput}
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runTerminal(terminalInput);
                  }}
                  placeholder="docker ps, help…"
                  disabled={busy}
                  spellCheck={false}
                />
                <span className={styles.cursor} aria-hidden />
              </div>
            </div>
            <div className={styles.hints}>
              {DOCKER_QUICK_COMMANDS.map(({label, cmd}) => (
                <button
                  key={cmd}
                  type="button"
                  className={styles.hintBtn}
                  onClick={() => runTerminal(cmd)}
                  disabled={busy}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {busy && (
          <div className={styles.overlay} role="status">
            <div className={styles.overlayBox}>
              <div className={styles.spinner} />
              Docker operation…
            </div>
          </div>
        )}
      </div>
    </DemoShell>
  );
}

export default DockerEmulatorInner;
