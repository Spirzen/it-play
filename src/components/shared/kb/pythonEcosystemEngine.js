/** Данные для PythonEcosystemPlay — статья 5-02-python/121. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и упаковка'},
  {id: 'modules', label: 'Модули и импорты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'interpreter',
    tag: 'Runtime',
    label: 'Интерпретатор CPython',
    color: '#3776ab',
    icon: '🐍',
    items: ['CPython 3.x', 'GIL · bytecode', 'pip в составе поставки'],
    detail:
      'Исполняет .py-файлы: парсинг, байткод, VM. Один интерпретатор — разные виртуальные окружения с разными наборами пакетов.',
  },
  {
    id: 'stdlib',
    tag: 'Стандартная библиотека',
    label: 'stdlib · batteries included',
    color: '#ffd343',
    icon: '📚',
    items: ['venv · json · asyncio', 'unittest · tkinter', 'pathlib · logging'],
    detail:
      'Входит в поставку Python без pip install. Tkinter для GUI, asyncio для асинхронности, unittest для базового тестирования.',
  },
  {
    id: 'packages',
    tag: 'Зависимости',
    label: 'pip · PyPI · venv',
    color: '#10b981',
    icon: '📦',
    items: ['requirements.txt', 'pyproject.toml', 'Poetry · conda', 'site-packages'],
    detail:
      'pip скачивает пакеты с PyPI в изолированное окружение venv. Poetry и conda расширяют управление зависимостями и сборкой.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Качество и тесты',
    color: '#ec4899',
    icon: '🔧',
    items: ['pytest · black · mypy', 'flake8 · isort', 'Jupyter · PyInstaller'],
    detail:
      'Линтеры и форматтеры поддерживают единый стиль. pytest — де-факто для тестов. PyInstaller упаковывает приложение в .exe/.app.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Веб · GUI · ML',
    color: '#06b6d4',
    icon: '⚙',
    items: ['Django · Flask · FastAPI', 'PyQt · Tkinter · Kivy', 'NumPy · PyTorch · pandas'],
    detail:
      'Фреймворк задаёт архитектуру: Django "всё включено", Flask — минимализм, FastAPI — ASGI и типизация. Библиотеки подключаются точечно.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['main.py · manage.py', 'apps / routers / views', 'models · services · tasks'],
    detail:
      'Прикладные модули: маршруты, модели данных, фоновые задачи Celery. Структура зависит от выбранного фреймворка и домена.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'main', label: 'main.py', type: 'app', x: 200, y: 24},
  {id: 'api', label: 'app/api', type: 'module', x: 80, y: 90},
  {id: 'models', label: 'app/models', type: 'module', x: 200, y: 90},
  {id: 'tasks', label: 'app/tasks', type: 'lazy', x: 320, y: 90},
  {id: 'fastapi', label: 'fastapi', type: 'pypi', x: 60, y: 168},
  {id: 'uvicorn', label: 'uvicorn', type: 'pypi', x: 140, y: 168},
  {id: 'sqlalchemy', label: 'sqlalchemy', type: 'pypi', x: 220, y: 168},
  {id: 'celery', label: 'celery', type: 'pypi', x: 300, y: 168},
  {id: 'redis', label: 'redis', type: 'pypi', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['main', 'api'],
  ['main', 'models'],
  ['main', 'tasks'],
  ['api', 'fastapi'],
  ['api', 'uvicorn'],
  ['models', 'sqlalchemy'],
  ['tasks', 'celery'],
  ['tasks', 'redis'],
  ['celery', 'redis'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной модуль', stroke: '#10b981'},
  lazy: {label: 'Фоновые задачи', stroke: '#f59e0b', dash: '6 4'},
  pypi: {label: 'PyPI-пакет', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'django',
    label: 'Django + DRF',
    toolchain: 'WSGI · manage.py · apps · ORM',
    tree: [
      {
        type: 'dir',
        path: 'crm-django',
        children: [
          {type: 'file', path: 'crm-django/manage.py', role: 'CLI', hint: 'runserver, migrate, createsuperuser'},
          {type: 'file', path: 'crm-django/requirements.txt', role: 'Зависимости', hint: 'django, djangorestframework, psycopg2'},
          {type: 'file', path: 'crm-django/pyproject.toml', role: 'Современный манифест', hint: 'Poetry или PEP 517 build'},
          {
            type: 'dir',
            path: 'crm-django/crm',
            children: [
              {type: 'file', path: 'crm-django/crm/settings.py', role: 'Конфиг', hint: 'INSTALLED_APPS, DATABASES, MIDDLEWARE'},
              {type: 'file', path: 'crm-django/crm/urls.py', role: 'Маршруты', hint: 'path("api/", include("orders.urls"))'},
              {type: 'file', path: 'crm-django/crm/wsgi.py', role: 'WSGI entry', hint: 'gunicorn crm.wsgi:application'},
            ],
          },
          {
            type: 'dir',
            path: 'crm-django/orders',
            role: 'Django app',
            children: [
              {type: 'file', path: 'crm-django/orders/models.py', role: 'ORM-модели', hint: 'class Order(models.Model)'},
              {type: 'file', path: 'crm-django/orders/views.py', role: 'Views / ViewSets', hint: 'DRF serializers + permissions'},
              {type: 'file', path: 'crm-django/orders/tasks.py', role: 'Celery tasks', hint: '@shared_task def send_invoice(...)'},
              {type: 'file', path: 'crm-django/orders/migrations/', role: 'Миграции БД', hint: 'python manage.py migrate'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'fastapi',
    label: 'FastAPI + SQLAlchemy',
    toolchain: 'ASGI · uvicorn · async',
    tree: [
      {
        type: 'dir',
        path: 'api-fastapi',
        children: [
          {type: 'file', path: 'api-fastapi/pyproject.toml', role: 'Poetry / pip', hint: 'fastapi, uvicorn, sqlalchemy, alembic'},
          {type: 'file', path: 'api-fastapi/requirements.txt', role: 'pip freeze', hint: 'Альтернатива pyproject для деплоя'},
          {
            type: 'dir',
            path: 'api-fastapi/app',
            children: [
              {type: 'file', path: 'api-fastapi/app/main.py', role: 'FastAPI app', hint: 'app = FastAPI(); include_router'},
              {
                type: 'dir',
                path: 'api-fastapi/app/routers',
                role: 'Маршруты',
                children: [
                  {type: 'file', path: 'api-fastapi/app/routers/orders.py', role: 'APIRouter', hint: '@router.get("/orders")'},
                  {type: 'file', path: 'api-fastapi/app/routers/users.py', role: 'Роутер', hint: 'Pydantic-схемы валидации'},
                ],
              },
              {
                type: 'dir',
                path: 'api-fastapi/app/models',
                role: 'SQLAlchemy',
                children: [
                  {type: 'file', path: 'api-fastapi/app/models/order.py', role: 'ORM', hint: 'Declarative Base, relationships'},
                  {type: 'file', path: 'api-fastapi/app/models/database.py', role: 'Session', hint: 'async engine, get_db dependency'},
                ],
              },
              {type: 'file', path: 'api-fastapi/app/tasks.py', role: 'Celery (опц.)', hint: 'Фоновая отправка email'},
            ],
          },
          {type: 'file', path: 'api-fastapi/alembic/', role: 'Миграции', hint: 'alembic upgrade head'},
        ],
      },
    ],
  },
  {
    id: 'flask',
    label: 'Flask микросервис',
    toolchain: 'WSGI · blueprints · gunicorn',
    tree: [
      {
        type: 'dir',
        path: 'shop-flask',
        children: [
          {type: 'file', path: 'shop-flask/requirements.txt', role: 'Зависимости', hint: 'flask, gunicorn, redis, celery'},
          {
            type: 'dir',
            path: 'shop-flask/shop',
            children: [
              {type: 'file', path: 'shop-flask/shop/__init__.py', role: 'Application factory', hint: 'create_app() — паттерн Flask'},
              {type: 'file', path: 'shop-flask/shop/config.py', role: 'Конфиг', hint: 'Config classes по окружениям'},
              {
                type: 'dir',
                path: 'shop-flask/shop/blueprints',
                role: 'Модули',
                children: [
                  {type: 'file', path: 'shop-flask/shop/blueprints/catalog.py', role: 'Blueprint', hint: 'catalog_bp = Blueprint("catalog", __name__)'},
                  {type: 'file', path: 'shop-flask/shop/blueprints/orders.py', role: 'Blueprint', hint: 'register_blueprint'},
                ],
              },
              {type: 'file', path: 'shop-flask/run.py', role: 'Точка входа', hint: 'from shop import create_app; app = create_app()'},
            ],
          },
          {type: 'file', path: 'shop-flask/wsgi.py', role: 'Production', hint: 'gunicorn wsgi:app'},
          {type: 'file', path: 'shop-flask/dist/main', role: 'PyInstaller', hint: 'pyinstaller --onefile run.py'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'venv',
    label: 'venv',
    cmd: 'python -m venv .venv\n.venv\\Scripts\\Activate.ps1   # Windows\npip install -r requirements.txt',
    detail: 'Изолированное окружение: пакеты не смешиваются с глобальным Python. Активация — затем pip install.',
  },
  {
    id: 'resolve',
    label: 'Зависимости',
    cmd: 'pip install fastapi uvicorn sqlalchemy celery redis\npip freeze > requirements.txt',
    detail: 'pip разрешает дерево зависимостей и кладёт пакеты в site-packages/. Poetry читает pyproject.toml — тот же принцип.',
  },
  {
    id: 'import',
    label: 'Импорты',
    cmd: 'from app.models import Order\nimport celery',
    detail: 'Python ищет модули в sys.path: проект, site-packages, stdlib. import app.tasks подгружает Celery только при использовании.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: 'uvicorn app.main:app --reload\n# или\ngunicorn crm.wsgi:application',
    detail: 'Dev: uvicorn с reload. Prod: gunicorn + workers для WSGI или uvicorn для ASGI.',
  },
  {
    id: 'package',
    label: 'Упаковка',
    cmd: 'pyinstaller --onefile --windowed run.py\n# dist/main.exe',
    detail: 'PyInstaller собирает интерпретатор, зависимости и ресурсы в один исполняемый файл без Python на целевой машине.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'docker build -t api .\ndocker run -p 8000:8000 api',
    detail: 'Контейнер фиксирует окружение. Альтернатива PyInstaller — образ с venv и gunicorn/uvicorn.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'single',
    label: 'Один модуль',
    era: 'Скрипт · утилита',
    color: '#3776ab',
    syntax: `# main.py — всё в одном файле
import requests

def fetch_orders():
    return requests.get("https://api.example.com/orders").json()

if __name__ == "__main__":
    print(fetch_orders())`,
    traits: ['Без структуры проекта', 'pip install в venv', 'Быстрый прототип'],
    tools: 'python main.py · PyInstaller --onefile',
    use: 'Утилиты, скрипты, обучение',
  },
  {
    id: 'package',
    label: 'Пакет с __init__.py',
    era: 'Приложение · библиотека',
    color: '#10b981',
    syntax: `# app/__init__.py
from .main import create_app

# app/main.py
from app.routers import orders

# pip install -e .
# python -m app.main`,
    traits: ['Пакет app/', 'Относительные импорты', 'pyproject.toml / setup.cfg'],
    tools: 'Poetry · setuptools · pip install -e .',
    use: 'FastAPI, Flask factory, своя библиотека',
  },
  {
    id: 'django-apps',
    label: 'Django apps',
    era: 'Монолит · WSGI',
    color: '#ffd343',
    syntax: `# settings.py
INSTALLED_APPS = ["orders", "users"]

# orders/models.py
from django.db import models

# manage.py migrate && gunicorn crm.wsgi`,
    traits: ['manage.py', 'INSTALLED_APPS', 'Миграции ORM', 'Celery tasks в app'],
    tools: 'django-admin · gunicorn · celery worker',
    use: 'CMS, корпоративные системы, REST через DRF',
  },
];

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPreset(id) {
  return ARCH_PRESETS.find((p) => p.id === id) ?? ARCH_PRESETS[0];
}

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasTasks = enabledNodeIds.has('tasks');
  const pypiCount = DEP_NODES.filter((n) => n.type === 'pypi' && enabledNodeIds.has(n.id)).length;
  const layers = hasTasks
    ? ['main.py', 'app/api · app/models · app/tasks', `PyPI: ${pypiCount} пакетов`]
    : ['main.py', 'app/api · app/models', `PyPI: ${pypiCount - 2} пакетов (без Celery)`];
  return {layers, hasTasks, pypiCount};
}
