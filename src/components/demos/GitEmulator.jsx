import React, {useCallback, useEffect, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  addNewFile,
  commitChanges,
  createBranch,
  createInitialGitState,
  getBranchCommits,
  getFileStatus,
  getHeadSnapshot,
  stageFile,
  switchBranch,
  unstageFile,
} from '@/components/shared/kb/gitEngine';
import styles from '@/components/demos/GitEmulator.module.css';

function CommitGraph({commits, branch}) {
  const branchCommits = getBranchCommits(commits, branch);
  if (branchCommits.length === 0) {
    return <div className={styles.graphEmpty}>Нет коммитов на ветке {branch}</div>;
  }
  return (
    <div className={styles.graphNodes}>
      {branchCommits.map((c, i) => (
        <React.Fragment key={c.id}>
          {i > 0 && <div className={styles.graphLine} aria-hidden />}
          <div className={styles.graphNode} title={c.message}>
            <div className={styles.graphDot} aria-hidden />
            <span className={styles.graphHash}>{c.id}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function GitEmulatorInner() {
  const [git, setGit] = useState(createInitialGitState);
  const [selectedFile, setSelectedFile] = useState('index.html');
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [logLines, setLogLines] = useState(['> Готов к работе. Измените файл и выполните git add.']);
  const [mobileTab, setMobileTab] = useState('files');
  const [isMobile, setIsMobile] = useState(false);

  const headFiles = getHeadSnapshot(git.commits, git.currentBranch);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const log = useCallback((msg) => {
    setLogLines((prev) => [...prev.slice(-40), `> ${msg}`]);
  }, []);

  const handleStage = (filename) => {
    const r = stageFile(git, filename);
    if (r.ok) {
      setGit(r.state);
      log(r.message);
    }
  };

  const handleUnstage = (filename) => {
    const r = unstageFile(git, filename);
    if (r.ok) {
      setGit(r.state);
      log(r.message);
    }
  };

  const handleCommit = () => {
    const r = commitChanges(git, commitMessage);
    if (!r.ok) {
      log(r.error);
      return;
    }
    setGit(r.state);
    setCommitMessage('');
    log(r.message);
  };

  const handleCreateBranch = () => {
    const r = createBranch(git, newBranchName);
    if (!r.ok) {
      log(r.error);
      return;
    }
    setGit(r.state);
    setNewBranchName('');
    log(r.message);
  };

  const handleSwitchBranch = (branch, force = false) => {
    const r = switchBranch(git, branch, force);
    if (r.needsConfirm) {
      if (window.confirm('Есть незакоммиченные изменения в индексе. Переключиться?')) {
        handleSwitchBranch(branch, true);
      }
      return;
    }
    if (!r.ok) {
      log(r.error);
      return;
    }
    setGit(r.state);
    if (r.message) log(r.message);
    const files = Object.keys(r.state.files);
    if (files.length && !files.includes(selectedFile)) {
      setSelectedFile(files[0]);
    }
  };

  const handleAddFile = () => {
    const r = addNewFile(git, newFileName);
    if (!r.ok) {
      log(r.error);
      return;
    }
    setGit(r.state);
    setSelectedFile(r.filename);
    setNewFileName('');
    log(r.message);
  };

  const renderFileList = (area) => {
    const list =
      area === 'working'
        ? Object.keys(git.files)
        : Object.keys(git.stagedFiles);

    if (list.length === 0) {
      return (
        <p style={{textAlign: 'center', color: 'var(--ifm-color-content-secondary)', padding: '1rem'}}>
          {area === 'staging' ? 'Индекс пуст' : 'Нет файлов'}
        </p>
      );
    }

    return list.map((filename) => {
      const status = getFileStatus(filename, git.files, git.stagedFiles, headFiles);
      return (
        <div
          key={filename}
          className={clsx(styles.fileRow, selectedFile === filename && styles.fileRowSelected)}
          onClick={() => setSelectedFile(filename)}
          onKeyDown={(e) => e.key === 'Enter' && setSelectedFile(filename)}
          role="button"
          tabIndex={0}
        >
          <span className={styles.fileName}>📄 {filename}</span>
          {area === 'working' && status === 'modified' && (
            <span className={styles.badgeModified}>M</span>
          )}
          {area === 'staging' && <span className={styles.badgeStaged}>staged</span>}
          {area === 'working' ? (
            <button
              type="button"
              className={clsx(styles.btn, styles.btnAdd)}
              onClick={(e) => {
                e.stopPropagation();
                handleStage(filename);
              }}
            >
              add
            </button>
          ) : (
            <button
              type="button"
              className={clsx(styles.btn, styles.btnReset)}
              onClick={(e) => {
                e.stopPropagation();
                handleUnstage(filename);
              }}
            >
              reset
            </button>
          )}
        </div>
      );
    });
  };

  const workingPanel = (
    <section className={styles.panel}>
      <h4 className={styles.panelTitle}>📁 Рабочая директория</h4>
      <div className={styles.panelBody}>{renderFileList('working')}</div>
      <div className={styles.newFileRow}>
        <input
          className={styles.input}
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="readme.md"
          onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
        />
        <button type="button" className={clsx(styles.btn, styles.btnAdd)} onClick={handleAddFile}>
          +
        </button>
      </div>
    </section>
  );

  const stagingPanel = (
    <section className={styles.panel}>
      <h4 className={styles.panelTitle}>✅ Индекс (staging)</h4>
      <div className={styles.panelBody}>{renderFileList('staging')}</div>
    </section>
  );

  const editorPanel = (
    <section className={styles.panel}>
      <h4 className={styles.panelTitle}>Редактор</h4>
      <select
        className={styles.select}
        value={selectedFile}
        onChange={(e) => setSelectedFile(e.target.value)}
      >
        {Object.keys(git.files).map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <textarea
        className={styles.editor}
        value={git.files[selectedFile] ?? ''}
        onChange={(e) => {
          setGit((prev) => ({
            ...prev,
            files: {...prev.files, [selectedFile]: e.target.value},
          }));
          log(`изменён ${selectedFile}`);
        }}
      />
    </section>
  );

  const commitPanel = (
    <section className={styles.panel}>
      <h4 className={styles.panelTitle}>Коммит</h4>
      <input
        className={styles.input}
        value={commitMessage}
        onChange={(e) => setCommitMessage(e.target.value)}
        placeholder='fix: описание изменений'
        onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
      />
      <button type="button" className={clsx(styles.btn, styles.btnPrimary)} onClick={handleCommit}>
        git commit
      </button>
      <div className={styles.panelBody} style={{marginTop: '0.65rem', maxHeight: 140}}>
        {getBranchCommits(git.commits, git.currentBranch).length === 0 ? (
          <p className={styles.graphEmpty}>История пуста</p>
        ) : (
          getBranchCommits(git.commits, git.currentBranch)
            .slice()
            .reverse()
            .map((c) => (
              <div key={c.id} className={styles.commitItem}>
                <strong>{c.id}</strong> {c.message}
                <br />
                <small>{c.timestamp}</small>
              </div>
            ))
        )}
      </div>
    </section>
  );

  return (
    <DemoShell>
      <div className={styles.root}>
        <header className={styles.header}>
          <h2 className={styles.title}>Git Emulator</h2>
          <p className={styles.subtitle}>working tree → index → repository</p>
        </header>

        <div className={styles.body}>
          <div className={styles.flow}>
            <div className={clsx(styles.flowBox, styles.flowWorking)}>Working</div>
            <span className={styles.flowArrow}>→ git add →</span>
            <div className={clsx(styles.flowBox, styles.flowStaging)}>Staging</div>
            <span className={styles.flowArrow}>→ commit →</span>
            <div className={clsx(styles.flowBox, styles.flowRepo)}>Repository</div>
          </div>

          <div className={styles.branchBar}>
            <span className={styles.branchCurrent}>
              branch: <strong>{git.currentBranch}</strong>
            </span>
            {git.branches.map((b) => (
              <button
                key={b}
                type="button"
                className={clsx(styles.branchPill, git.currentBranch === b && styles.branchPillActive)}
                onClick={() => handleSwitchBranch(b)}
              >
                {b}
              </button>
            ))}
            <div className={styles.branchCreate}>
              <input
                className={styles.input}
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="feature/login"
              />
              <button type="button" className={clsx(styles.btn, styles.btnAdd)} onClick={handleCreateBranch}>
                branch
              </button>
            </div>
          </div>

          <div className={styles.graph}>
            <div className={styles.graphLabel}>История ({git.currentBranch})</div>
            <CommitGraph commits={git.commits} branch={git.currentBranch} />
          </div>

          {isMobile ? (
            <>
              <div className={styles.tabs}>
                {[
                  ['files', 'Файлы'],
                  ['staging', 'Индекс'],
                  ['editor', 'Редактор'],
                  ['commit', 'Коммит'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={clsx(styles.tab, mobileTab === id && styles.tabActive)}
                    onClick={() => setMobileTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className={styles.mobilePanel}>
                {mobileTab === 'files' && workingPanel}
                {mobileTab === 'staging' && stagingPanel}
                {mobileTab === 'editor' && editorPanel}
                {mobileTab === 'commit' && commitPanel}
              </div>
            </>
          ) : (
            <div className={styles.gridDesktop}>
              <div className={styles.grid}>
                {workingPanel}
                {stagingPanel}
              </div>
              <div className={styles.grid}>
                {editorPanel}
                {commitPanel}
              </div>
            </div>
          )}

          <div className={styles.log}>{logLines.join('\n')}</div>

          <div className={styles.hint}>
            <strong>Как учиться:</strong>
            <ol>
              <li>Измените файл в редакторе</li>
              <li>git add переносит в индекс</li>
              <li>git commit сохраняет снимок в репозиторий</li>
              <li>Ветки — параллельные линии разработки</li>
            </ol>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export default GitEmulatorInner;
