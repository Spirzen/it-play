export const VERSION_STRATEGIES = [
  {
    id: 'uri',
    label: 'URI (/v1/)',
    buildUrl: (base, v) => `${base}/v${v}/users`,
    pros: 'Понятно в логах и curl',
    cons: 'Несколько URI на один ресурс',
  },
  {
    id: 'query',
    label: 'Query (?version=)',
    buildUrl: (base, v) => `${base}/users?version=${v}`,
    pros: 'URI ресурса не меняется',
    cons: 'Кэши и прокси могут путать версии',
  },
  {
    id: 'header',
    label: 'Accept header',
    buildUrl: (base, v) => `${base}/users`,
    header: (v) => `Accept: application/vnd.shop.v${v}+json`,
    pros: 'Соответствует content negotiation',
    cons: 'Сложнее отлаживать в браузере',
  },
];

export const RESOURCE_EXAMPLES = [
  {bad: 'GET /getUsers', good: 'GET /users', why: 'Ресурс — существительное, действие — HTTP-метод'},
  {bad: 'POST /users/delete/5', good: 'DELETE /users/5', why: 'Удаление через DELETE, не глагол в пути'},
  {bad: 'GET /api/user', good: 'GET /api/v1/users', why: 'Множественное число + версия в URI'},
];

export const ERROR_EXAMPLES = {
  400: {
    title: 'Bad Request',
    body: {
      type: 'https://api.example.com/problems/validation-error',
      title: 'Нарушение валидации',
      status: 400,
      invalidParams: [{name: 'email', reason: 'неверный формат'}],
    },
  },
  401: {title: 'Unauthorized', body: {title: 'Токен отсутствует или просрочен', status: 401}},
  409: {
    title: 'Conflict',
    body: {title: 'Заказ уже подтверждён', status: 409, instance: '/orders/123'},
  },
};

export function buildVersionPreview(strategyId, version) {
  const s = VERSION_STRATEGIES.find((x) => x.id === strategyId);
  const base = 'https://api.example.com';
  return {
    url: s.buildUrl(base, version),
    header: s.header ? s.header(version) : null,
  };
}
