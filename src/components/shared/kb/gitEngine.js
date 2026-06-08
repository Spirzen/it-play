export const DEFAULT_FILES = {
  'index.html':
    '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Project</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>',
  'style.css':
    'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: blue;\n}',
  'script.js':
    'console.log("Hello from JavaScript!");\n\nfunction greet() {\n  alert("Welcome to my project!");\n}',
};

export const NEW_BRANCH_FILES = {
  'index.html':
    '<!DOCTYPE html>\n<html>\n  <head>\n    <title>New Branch</title>\n  </head>\n  <body>\n    <h1>New Branch</h1>\n  </body>\n</html>',
};

export function createInitialGitState() {
  return {
    files: {...DEFAULT_FILES},
    stagedFiles: {},
    commits: [],
    currentBranch: 'main',
    branches: ['main'],
  };
}

export function getHeadSnapshot(commits, branch) {
  const branchCommits = commits.filter((c) => c.branch === branch);
  if (branchCommits.length === 0) {
    return branch === 'main' ? {...DEFAULT_FILES} : {...NEW_BRANCH_FILES};
  }
  return {...branchCommits[branchCommits.length - 1].files};
}

export function getFileStatus(filename, files, stagedFiles, headFiles) {
  const inStage = Object.hasOwn(stagedFiles, filename);
  const inWork = Object.hasOwn(files, filename);
  if (!inWork && !inStage) return 'deleted';
  const workContent = files[filename];
  const headContent = headFiles[filename];
  const stagedContent = stagedFiles[filename];
  const modifiedInWork = workContent !== headContent;
  const modifiedInStage = inStage && stagedContent !== headContent;
  if (inStage && modifiedInStage) return 'staged';
  if (modifiedInWork && !inStage) return 'modified';
  if (inStage && !modifiedInStage && workContent === stagedContent) return 'staged';
  return 'clean';
}

export function stageFile(state, filename) {
  if (!Object.hasOwn(state.files, filename)) {
    return {ok: false, state, message: `Файл не найден: ${filename}`};
  }
  return {
    ok: true,
    state: {
      ...state,
      stagedFiles: {...state.stagedFiles, [filename]: state.files[filename]},
    },
    message: `git add ${filename}`,
  };
}

export function unstageFile(state, filename) {
  if (!Object.hasOwn(state.stagedFiles, filename)) {
    return {ok: false, state, message: `Файл не в индексе: ${filename}`};
  }
  const stagedFiles = {...state.stagedFiles};
  delete stagedFiles[filename];
  return {ok: true, state: {...state, stagedFiles}, message: `git reset ${filename}`};
}

export function commitChanges(state, message) {
  const msg = message.trim();
  if (Object.keys(state.stagedFiles).length === 0) {
    return {ok: false, state, error: 'Нет файлов в индексе. Сначала git add.'};
  }
  if (!msg) {
    return {ok: false, state, error: 'Введите сообщение коммита.'};
  }

  const commitId = Math.random().toString(36).substring(2, 8);
  const branchCommits = state.commits.filter((c) => c.branch === state.currentBranch);
  const newCommit = {
    id: commitId,
    message: msg,
    branch: state.currentBranch,
    files: {...state.stagedFiles},
    timestamp: new Date().toLocaleString(),
    parent: branchCommits.length > 0 ? branchCommits[branchCommits.length - 1].id : null,
  };

  return {
    ok: true,
    state: {
      ...state,
      files: {...state.files, ...state.stagedFiles},
      stagedFiles: {},
      commits: [...state.commits, newCommit],
    },
    message: `git commit -m "${msg}" → ${commitId}`,
    commit: newCommit,
  };
}

export function createBranch(state, branchName) {
  const name = branchName.trim();
  if (!name) {
    return {ok: false, state, error: 'Введите имя ветки.'};
  }
  if (state.branches.includes(name)) {
    return {ok: false, state, error: 'Ветка уже существует.'};
  }
  return {
    ok: true,
    state: {...state, branches: [...state.branches, name]},
    message: `git branch ${name}`,
  };
}

export function switchBranch(state, branch, force = false) {
  if (branch === state.currentBranch) {
    return {ok: true, state, message: null};
  }
  if (!state.branches.includes(branch)) {
    return {ok: false, state, error: 'Ветка не найдена.'};
  }
  if (Object.keys(state.stagedFiles).length > 0 && !force) {
    return {ok: false, state, needsConfirm: true};
  }

  const headFiles = getHeadSnapshot(state.commits, branch);
  return {
    ok: true,
    state: {
      ...state,
      currentBranch: branch,
      stagedFiles: {},
      files: headFiles,
    },
    message: `git checkout ${branch}`,
  };
}

export function addNewFile(state, filename) {
  const name = filename.trim();
  if (!name) {
    return {ok: false, state, error: 'Укажите имя файла.'};
  }
  if (Object.hasOwn(state.files, name)) {
    return {ok: false, state, error: 'Файл уже существует.'};
  }
  return {
    ok: true,
    state: {
      ...state,
      files: {...state.files, [name]: '# Новый файл\n\nСодержимое файла.'},
    },
    message: `Создан ${name}`,
    filename: name,
  };
}

export function getBranchCommits(commits, branch) {
  return commits.filter((c) => c.branch === branch);
}
