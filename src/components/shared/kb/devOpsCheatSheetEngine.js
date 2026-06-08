export const CHEAT_CATEGORIES = [
  {
    id: 'git',
    label: 'Git',
    commands: [
      {cmd: 'git clone <url>', desc: 'Клонировать репозиторий', out: 'Cloning into project…\nremote: Enumerating objects: 1204'},
      {cmd: 'git status', desc: 'Состояние рабочей копии', out: 'On branch main\nChanges not staged for commit'},
      {cmd: 'git pull', desc: 'Забрать изменения с remote', out: 'Already up to date.'},
    ],
  },
  {
    id: 'docker',
    label: 'Docker',
    commands: [
      {cmd: 'docker build -t myapp:latest .', desc: 'Собрать образ из Dockerfile', out: 'Step 5/5 : exporting layers\nSuccessfully tagged myapp:latest'},
      {cmd: 'docker run -d -p 8080:8080 --name api myapp', desc: 'Запуск контейнера в фоне', out: 'a1b2c3d4e5f6…'},
      {cmd: 'docker compose up --build', desc: 'Поднять стек из compose-файла', out: 'Container db Healthy\nContainer app Started'},
      {cmd: 'docker logs -f api', desc: 'Поток логов контейнера', out: '2026/05/22 10:01:02 Listening :8080'},
    ],
  },
  {
    id: 'k8s',
    label: 'Kubernetes',
    commands: [
      {cmd: 'kubectl apply -f deployment.yaml', desc: 'Применить манифест', out: 'deployment.apps/my-app created'},
      {cmd: 'kubectl get pods', desc: 'Статус подов', out: 'NAME           READY   STATUS    RESTARTS\nmy-app-xxxxx   1/1     Running   0'},
      {cmd: 'kubectl scale deployment my-app --replicas=5', desc: 'Масштабирование', out: 'deployment.apps/my-app scaled'},
      {cmd: 'kubectl port-forward svc/my-app 8080:80', desc: 'Доступ с localhost', out: 'Forwarding from 127.0.0.1:8080 -> 80'},
    ],
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    commands: [
      {cmd: 'docker push registry/myapp:latest', desc: 'Публикация образа в registry', out: 'latest: digest: sha256:abc… size: 42MB'},
      {cmd: 'kubectl apply -f deployment.yaml', desc: 'Деплой в кластер после сборки', out: 'deployment.apps/my-app configured'},
    ],
  },
];
