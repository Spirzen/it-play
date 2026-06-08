export const DOCKER_QUICK_COMMANDS = [
  {label: 'docker ps', cmd: 'docker ps'},
  {label: 'docker images', cmd: 'docker images'},
  {label: 'help', cmd: 'help'},
  {label: 'clear', cmd: 'clear'},
];

export const BUILD_STEPS = [
  'Step 1/5 : FROM alpine:latest',
  'Step 2/5 : RUN apk add --no-cache nodejs npm',
  'Step 3/5 : WORKDIR /app',
  'Step 4/5 : COPY . .',
  'Step 5/5 : CMD ["node", "index.js"]',
];

export const PUSH_LAYERS = [
  'Layer 1: Pushing [=====>] 24.5MB/24.5MB',
  'Layer 2: Pushing [=====>] 12.3MB/12.3MB',
  'Layer 3: Pushing [=====>] 8.7MB/8.7MB',
];

export const INITIAL_IMAGES = [
  {
    id: 'sha256:a1b2c3d4e5f6',
    repository: 'ubuntu',
    tag: 'latest',
    size: '72.8MB',
    created: '2 weeks ago',
    layers: 4,
  },
  {
    id: 'sha256:f6e5d4c3b2a1',
    repository: 'node',
    tag: '18-alpine',
    size: '178MB',
    created: '5 days ago',
    layers: 6,
  },
  {
    id: 'sha256:123456789abc',
    repository: 'nginx',
    tag: '1.25',
    size: '187MB',
    created: '3 days ago',
    layers: 5,
  },
];

export const INITIAL_CONTAINERS = [
  {
    id: 'abc123def456',
    name: 'web-app-1',
    image: 'nginx:1.25',
    status: 'running',
    ports: '0.0.0.0:8080->80/tcp',
    created: '2 hours ago',
    command: 'nginx -g "daemon off;"',
  },
  {
    id: 'def456ghi789',
    name: 'api-server',
    image: 'node:18-alpine',
    status: 'exited',
    ports: '0.0.0.0:3000->3000/tcp',
    created: '1 day ago',
    command: 'npm start',
  },
];

function nowTime() {
  return new Date().toLocaleTimeString();
}

function randomSha() {
  return `sha256:${Math.random().toString(36).substring(2, 15)}`;
}

function randomId(len = 12) {
  return Math.random().toString(36).substring(2, 2 + len);
}

export function imageRef(img) {
  return `${img.repository}:${img.tag}`;
}

export function shortId(id, len = 12) {
  return id.length > len ? id.substring(0, len) : id;
}

export function createLog(message, type = 'info', command = 'cli') {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: nowTime(),
    command,
    message,
    type,
  };
}

export function welcomeLogs() {
  return [createLog('Docker Emulator — учебный режим. Введите help или выберите команду ниже.', 'info', 'system')];
}

export function pullImage(images, pullImageName) {
  const name = pullImageName.trim();
  if (!name) {
    return {ok: false, images, logs: [createLog('Ошибка: укажите имя образа (например ubuntu:22.04)', 'error', 'pull')]};
  }

  const [repo, tag = 'latest'] = name.split(':');
  const newImage = {
    id: randomSha(),
    repository: repo,
    tag,
    size: `${Math.floor(Math.random() * 450 + 50)}MB`,
    created: 'just now',
    layers: Math.floor(Math.random() * 10 + 3),
  };

  return {
    ok: true,
    images: [...images, newImage],
    logs: [
      createLog(`Pulling ${name}…`, 'info', 'pull'),
      createLog(`Successfully pulled ${name}`, 'success', 'pull'),
      createLog(`Digest: ${newImage.id}`, 'info', 'pull'),
      createLog(`Status: Downloaded newer image for ${name}`, 'info', 'pull'),
    ],
  };
}

export function buildImage(images, buildContext) {
  const ctx = buildContext.trim();
  if (!ctx) {
    return {
      ok: false,
      images,
      logs: [createLog('Ошибка: укажите путь к Dockerfile или контекст сборки', 'error', 'build')],
    };
  }

  const newImage = {
    id: randomSha(),
    repository: 'custom-app',
    tag: 'latest',
    size: `${Math.floor(Math.random() * 300 + 100)}MB`,
    created: 'just now',
    layers: 5,
  };

  return {
    ok: true,
    images: [...images, newImage],
    logs: [
      createLog(`Building from ${ctx}…`, 'info', 'build'),
      ...BUILD_STEPS.map((step) => createLog(step, 'info', 'build')),
      createLog(`Successfully built ${imageRef(newImage)}`, 'success', 'build'),
      createLog(`Image ID: ${newImage.id}`, 'info', 'build'),
    ],
  };
}

function defaultCommand(repo) {
  if (repo === 'node') return 'npm start';
  if (repo === 'nginx') return 'nginx -g "daemon off;"';
  return '/bin/sh -c "while true; do echo running; sleep 10; done"';
}

export function runContainer(images, containers, selectedImage, containerName) {
  const name = containerName.trim();
  if (!selectedImage || !name) {
    return {
      ok: false,
      containers,
      logs: [createLog('Ошибка: укажите образ и имя контейнера', 'error', 'run')],
    };
  }

  const imageExists = images.find((img) => imageRef(img) === selectedImage);
  if (!imageExists) {
    return {
      ok: false,
      containers,
      logs: [createLog(`Ошибка: образ ${selectedImage} не найден локально`, 'error', 'run')],
    };
  }

  const hostPort = Math.floor(Math.random() * 9000 + 1000);
  const containerPort = imageExists.repository === 'nginx' ? 80 : hostPort;
  const newContainer = {
    id: randomId(),
    name,
    image: selectedImage,
    status: 'running',
    ports: `0.0.0.0:${hostPort}->${containerPort}/tcp`,
    created: 'just now',
    command: defaultCommand(imageExists.repository),
  };

  return {
    ok: true,
    containers: [...containers, newContainer],
    logs: [
      createLog(`Creating and starting ${name}…`, 'info', 'run'),
      createLog(`Container ${name} started`, 'success', 'run'),
      createLog(`Container ID: ${newContainer.id}`, 'info', 'run'),
      createLog(`Port mapping: ${newContainer.ports}`, 'info', 'run'),
    ],
  };
}

export function pushImage(images, pushImageName) {
  const name = pushImageName.trim();
  if (!name) {
    return {ok: false, images, logs: [createLog('Ошибка: укажите имя образа для push', 'error', 'push')]};
  }

  const imageExists = images.find((img) => imageRef(img) === name);
  if (!imageExists) {
    return {
      ok: false,
      images,
      logs: [createLog(`Ошибка: образ ${name} не найден локально`, 'error', 'push')],
    };
  }

  return {
    ok: true,
    images,
    logs: [
      createLog(`Pushing ${name} to registry…`, 'info', 'push'),
      createLog('Preparing to push', 'info', 'push'),
      ...PUSH_LAYERS.map((layer) => createLog(`  ${layer}`, 'info', 'push')),
      createLog(`Successfully pushed ${name}`, 'success', 'push'),
      createLog(`Digest: ${randomSha()}`, 'info', 'push'),
    ],
  };
}

export function stopContainer(containers, containerId) {
  return {
    containers: containers.map((c) => (c.id === containerId ? {...c, status: 'exited'} : c)),
    logs: [createLog(`Stopped container ${shortId(containerId)}`, 'warning', 'stop')],
  };
}

export function startContainer(containers, containerId) {
  return {
    containers: containers.map((c) => (c.id === containerId ? {...c, status: 'running'} : c)),
    logs: [createLog(`Started container ${shortId(containerId)}`, 'success', 'start')],
  };
}

export function removeContainer(containers, containerId) {
  const container = containers.find((c) => c.id === containerId);
  if (!container) {
    return {ok: false, containers, logs: []};
  }
  if (container.status === 'running') {
    return {
      ok: false,
      containers,
      logs: [
        createLog(
          `Cannot remove running container ${shortId(containerId)}. Stop it first.`,
          'error',
          'rm',
        ),
      ],
    };
  }
  return {
    ok: true,
    containers: containers.filter((c) => c.id !== containerId),
    logs: [createLog(`Removed container ${shortId(containerId)}`, 'success', 'rm')],
  };
}

export function removeImage(images, containers, imageId) {
  const image = images.find((i) => i.id === imageId);
  if (!image) {
    return {ok: false, images, logs: []};
  }
  const ref = imageRef(image);
  if (containers.some((c) => c.image === ref)) {
    return {
      ok: false,
      images,
      logs: [createLog(`Cannot remove ${ref} (used by containers)`, 'error', 'rmi')],
    };
  }
  return {
    ok: true,
    images: images.filter((i) => i.id !== imageId),
    logs: [createLog(`Removed image ${ref}`, 'success', 'rmi')],
  };
}

export function listRunningContainers(containers) {
  const running = containers.filter((c) => c.status === 'running');
  return [
    createLog(`Listing running containers (${running.length}):`, 'info', 'ps'),
    ...running.map((c) =>
      createLog(`  ${shortId(c.id)}  ${c.name}  ${c.image}  ${c.status}  ${c.ports}`, 'info', 'ps'),
    ),
  ];
}

export function listImages(images) {
  return [
    createLog(`Listing local images (${images.length}):`, 'info', 'images'),
    ...images.map((i) =>
      createLog(
        `  ${imageRef(i)}  ${shortId(i.id)}  ${i.size}  ${i.created}`,
        'info',
        'images',
      ),
    ),
  ];
}

export function helpLogs() {
  return [
    createLog('Доступные команды:', 'info', 'help'),
    createLog('  docker ps       — запущенные контейнеры', 'info', 'help'),
    createLog('  docker images   — локальные образы', 'info', 'help'),
    createLog('  clear           — очистить терминал', 'info', 'help'),
    createLog('Формы выше: pull, build, run, push', 'info', 'help'),
  ];
}

export function parseTerminalCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return {type: 'noop'};
  if (cmd === 'docker ps') return {type: 'ps'};
  if (cmd === 'docker images') return {type: 'images'};
  if (cmd === 'clear') return {type: 'clear'};
  if (cmd === 'help') return {type: 'help'};
  return {type: 'unknown', raw};
}

export function dockerStats(images, containers) {
  const running = containers.filter((c) => c.status === 'running').length;
  return {imageCount: images.length, containerCount: containers.length, running};
}
