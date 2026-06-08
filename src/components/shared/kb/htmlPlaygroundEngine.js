export const PLAYGROUND_MESSAGE_TYPE = 'it-html-playground-error';

export const ERROR_PROBE_SCRIPT = `<script>
(function () {
  function send(msg) {
    try {
      parent.postMessage({ type: '${PLAYGROUND_MESSAGE_TYPE}', message: String(msg) }, '*');
    } catch (e) {}
  }
  window.addEventListener('error', function (e) {
    send((e.filename || 'script') + ': ' + (e.message || 'ошибка'));
  });
  window.addEventListener('unhandledrejection', function (e) {
    send('Promise: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
  });
})();
</script>`;

export const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Мой пример</title>
  <style>
    :root {
      --accent: #7b68ee;
      --bg: #f4f4f9;
    }
    body {
      font-family: system-ui, sans-serif;
      padding: 1.25rem;
      background: var(--bg);
      margin: 0;
    }
    h1 { color: #1e1e2e; margin-top: 0; }
    .box {
      background: #fff;
      padding: 1rem 1.25rem;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      max-width: 28rem;
    }
    button {
      margin-top: 0.75rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      background: var(--accent);
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { filter: brightness(1.08); }
  </style>
</head>
<body>
  <h1>Привет, мир!</h1>
  <div class="box">
    <p>Редактируйте код слева — предпросмотр обновится автоматически.</p>
    <button id="btn" type="button">Нажми меня</button>
  </div>
  <script>
    document.getElementById('btn').addEventListener('click', function () {
      this.textContent = 'Ура! 🎉';
      this.style.background = '#28c840';
    });
  </script>
</body>
</html>`;

export const PRESETS = [
  {id: 'default', label: 'Старт', icon: '🏠', code: DEFAULT_CODE},
  {
    id: 'form',
    label: 'Форма',
    icon: '📝',
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Форма</title>
  <style>
    body { font-family: system-ui; padding: 1.5rem; background: #f0f4ff; }
    form { max-width: 22rem; background: #fff; padding: 1.25rem; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    label { display: block; margin-bottom: 0.35rem; font-size: 0.9rem; color: #444; }
    input { width: 100%; padding: 0.5rem; margin-bottom: 0.75rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
    input:invalid { border-color: #e74c3c; }
    button { width: 100%; padding: 0.6rem; border: none; border-radius: 8px; background: #4361ee; color: #fff; font-weight: 600; cursor: pointer; }
    #msg { margin-top: 0.75rem; font-size: 0.85rem; color: #2d6a4f; }
  </style>
</head>
<body>
  <form id="f" novalidate>
    <label>Email <input type="email" required placeholder="you@mail.ru"></label>
    <label>Пароль <input type="password" minlength="4" required></label>
    <button type="submit">Войти</button>
    <p id="msg"></p>
  </form>
  <script>
    document.getElementById('f').addEventListener('submit', function (e) {
      e.preventDefault();
      if (this.checkValidity()) {
        document.getElementById('msg').textContent = 'Форма валидна ✓';
      } else {
        document.getElementById('msg').textContent = 'Заполните поля корректно';
      }
    });
  </script>
</body>
</html>`,
  },
  {
    id: 'flex',
    label: 'Flexbox',
    icon: '📐',
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Flex</title>
  <style>
    body { margin: 0; font-family: system-ui; background: #1e1e2e; color: #cdd6f4; min-height: 100vh; display: flex; flex-direction: column; }
    header { padding: 1rem; background: #313244; }
    .row { flex: 1; display: flex; gap: 0.5rem; padding: 0.5rem; }
    .col { flex: 1; background: #45475a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; transition: flex 0.3s; }
    .col:hover { flex: 2; background: #7b68ee; }
    footer { padding: 0.75rem; text-align: center; font-size: 0.85rem; opacity: 0.7; }
  </style>
</head>
<body>
  <header><strong>Flex-раскладка</strong> — наведите на колонки</header>
  <div class="row">
    <div class="col">A</div>
    <div class="col">B</div>
    <div class="col">C</div>
  </div>
  <footer>justify-content · align-items · flex-grow</footer>
</body>
</html>`,
  },
  {
    id: 'animation',
    label: 'CSS',
    icon: '✨',
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Анимация</title>
  <style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #667eea, #764ba2); font-family: system-ui; }
  .card {
    width: 10rem; height: 10rem; border-radius: 1rem;
    background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.12) rotate(6deg); }
  }
  p { color: #fff; margin-top: 1.5rem; text-align: center; }
  </style>
</head>
<body>
  <div>
    <div class="card"></div>
    <p>@keyframes + animation</p>
  </div>
</body>
</html>`,
  },
  {
    id: 'tailwind',
    label: 'Tailwind',
    icon: '🎨',
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tailwind</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-dvh flex items-center justify-center bg-indigo-50 p-4">
  <article class="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
    <h1 class="text-xl font-semibold text-slate-900">Tailwind CSS</h1>
    <p class="mt-2 text-slate-600">Редактируйте классы — предпросмотр обновится автоматически.</p>
    <button
      type="button"
      class="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 transition-colors"
    >
      Начать
    </button>
  </article>
</body>
</html>`,
  },
  {
    id: 'dom',
    label: 'DOM',
    icon: '🔧',
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>DOM</title>
  <style>
    body { font-family: system-ui; padding: 1.25rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.5rem 0.75rem; margin: 0.35rem 0; background: #eee; border-radius: 6px; display: flex; justify-content: space-between; }
    li.done { text-decoration: line-through; opacity: 0.55; }
    input, button { padding: 0.45rem 0.65rem; border-radius: 6px; border: 1px solid #ccc; }
    button { background: #2d6a4f; color: #fff; border: none; cursor: pointer; margin-left: 0.35rem; }
  </style>
</head>
<body>
  <h2>Список задач</h2>
  <div>
    <input id="new" placeholder="Новая задача…">
    <button type="button" id="add">Добавить</button>
  </div>
  <ul id="list"></ul>
  <script>
    const list = document.getElementById('list');
    const add = () => {
      const text = document.getElementById('new').value.trim();
      if (!text) return;
      const li = document.createElement('li');
      li.innerHTML = '<span>' + text + '</span><button type="button">✓</button>';
      li.querySelector('button').onclick = () => li.classList.toggle('done');
      list.appendChild(li);
      document.getElementById('new').value = '';
    };
    document.getElementById('add').onclick = add;
    document.getElementById('new').addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
    add();
    document.getElementById('new').value = 'Изучить HTML';
    add();
  </script>
</body>
</html>`,
  },
];

/** Вставляет скрипт отлова ошибок перед </body> или в конец документа. */
export function injectErrorProbe(html) {
  const probe = ERROR_PROBE_SCRIPT;
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${probe}</body>`);
  }
  if (/<\/html>/i.test(html)) {
    return html.replace(/<\/html>/i, `${probe}</html>`);
  }
  return html + probe;
}

export function countLines(text) {
  if (!text) return 1;
  return text.split('\n').length;
}

export function openPreviewInNewTab(code) {
  const blob = new Blob([code], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (win) {
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  return Boolean(win);
}
