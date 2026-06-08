export const GITFLOW_STEPS = [
  {
    id: 'start',
    title: 'Старт: v1.0.0 в production',
    branches: {main: ['v1.0.0'], develop: ['A', 'B'], feature: [], release: [], hotfix: []},
    commands: ['main: v1.0.0', 'develop: фичи A, B'],
    active: 'develop',
  },
  {
    id: 'feature',
    title: 'feature/cart от develop',
    branches: {main: ['v1.0.0'], develop: ['A', 'B'], feature: ['cart-1', 'cart-2'], release: [], hotfix: []},
    commands: [
      'git checkout develop',
      'git checkout -b feature/cart',
      '# коммиты…',
      'git checkout develop && git merge --no-ff feature/cart',
    ],
    active: 'feature',
  },
  {
    id: 'release',
    title: 'release/1.1.0 — стабилизация',
    branches: {
      main: ['v1.0.0'],
      develop: ['A', 'B', 'cart'],
      feature: [],
      release: ['fix-qa', 'bump'],
      hotfix: [],
    },
    commands: ['git checkout -b release/1.1.0 develop', 'git commit -m "Bump version to 1.1.0"'],
    active: 'release',
  },
  {
    id: 'ship',
    title: 'Релиз v1.1.0 в main',
    branches: {
      main: ['v1.0.0', 'v1.1.0'],
      develop: ['A', 'B', 'cart', 'fixes'],
      feature: [],
      release: [],
      hotfix: [],
    },
    commands: [
      'git checkout main && git merge --no-ff release/1.1.0',
      'git tag -a v1.1.0',
      'git checkout develop && git merge --no-ff release/1.1.0',
    ],
    active: 'main',
  },
  {
    id: 'hotfix',
    title: 'hotfix v1.1.1 в production',
    branches: {
      main: ['v1.0.0', 'v1.1.0', 'v1.1.1'],
      develop: ['A', 'B', 'cart', 'fixes', 'pay-fix'],
      feature: [],
      release: [],
      hotfix: ['pay-fix'],
    },
    commands: [
      'git checkout main',
      'git checkout -b hotfix/payment-order-fix',
      'git merge --no-ff hotfix/… && git tag v1.1.1',
      'git checkout develop && git merge --no-ff hotfix/…',
    ],
    active: 'hotfix',
  },
];
