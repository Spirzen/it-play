export const GIT_WORKFLOW = [
  {
    id: 'init',
    cmd: 'git init',
    desc: 'Создать репозиторий и папку .git',
    state: {repo: false},
  },
  {
    id: 'status',
    cmd: 'git status',
    desc: 'Показать изменённые и неотслеживаемые файлы',
    state: {repo: true, tracked: false},
  },
  {
    id: 'add',
    cmd: 'git add .',
    desc: 'Добавить изменения в индекс (staging)',
    state: {repo: true, tracked: true, staged: false},
  },
  {
    id: 'commit',
    cmd: 'git commit -m "Сообщение"',
    desc: 'Зафиксировать снимок из индекса',
    state: {repo: true, tracked: true, staged: true, committed: false},
  },
  {
    id: 'push',
    cmd: 'git push origin main',
    desc: 'Отправить коммиты на удалённый сервер',
    state: {repo: true, tracked: true, staged: true, committed: true, pushed: false},
  },
];

export function applyWorkflowStep(stepIndex) {
  const step = GIT_WORKFLOW[stepIndex];
  if (!step) return {step: null, files: [], log: []};
  const files = [
    {name: 'app.js', status: 'modified', inIndex: step.state.staged || step.state.committed},
    {name: 'README.md', status: 'untracked', inIndex: step.id !== 'init' && step.state.tracked},
  ];
  const log = GIT_WORKFLOW.slice(0, stepIndex + 1).map((s) => `> ${s.cmd}`);
  return {step, files, log};
}
