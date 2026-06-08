/** Симуляция Docker-контейнера и pod'ов Kubernetes. */

export const DOCKER_STEPS = [
  {id: 'image', label: 'Образ', desc: 'Dockerfile → слои → image myapp:1.0'},
  {id: 'run', label: 'Запуск', desc: 'docker run создаёт изолированный контейнер из образа'},
  {id: 'isolate', label: 'Изоляция', desc: 'Namespaces + cgroups ограничивают процессы и ресурсы'},
  {id: 'share', label: 'Сеть', desc: 'Контейнер получает IP в bridge-сети docker0'},
];

export const K8S_STEPS = [
  {id: 'manifest', label: 'Манифест', desc: 'Deployment описывает желаемое состояние (replicas, image)'},
  {id: 'schedule', label: 'Scheduler', desc: 'Control plane назначает pod на worker-ноду'},
  {id: 'kubelet', label: 'Kubelet', desc: 'Агент ноды запускает контейнеры внутри pod'},
  {id: 'service', label: 'Service', desc: 'ClusterIP / Ingress направляет трафик на готовые pod'},
];

export function makeContainer(id, name, status = 'running') {
  return {id, name, status, cpu: `${10 + (id % 5) * 5}%`, mem: `${64 + id * 32}Mi`};
}

export function makePod(id, ready = true) {
  return {
    id: `pod-${id}`,
    name: `myapp-${id}`,
    status: ready ? 'Running' : 'Pending',
    restarts: id % 3,
  };
}

export function scalePods(count) {
  return Array.from({length: count}, (_, i) => makePod(i + 1, i < count));
}
