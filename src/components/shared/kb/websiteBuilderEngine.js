/** Блоки конструктора сайтов (учебная модель Tilda / Wix). */

export const BLOCK_PALETTE = [
  {type: 'hero', label: 'Обложка', icon: '🖼️'},
  {type: 'heading', label: 'Заголовок', icon: 'H'},
  {type: 'text', label: 'Текст', icon: '¶'},
  {type: 'button', label: 'Кнопка', icon: '▶'},
  {type: 'image', label: 'Картинка', icon: '📷'},
  {type: 'form', label: 'Форма', icon: '✉️'},
];

export const TEMPLATES = [
  {
    id: 'landing',
    label: 'Лендинг',
    blocks: [
      {type: 'hero', props: {title: 'Новый курс', subtitle: 'Старт 1 сентября'}},
      {type: 'text', props: {body: 'Короткое описание предложения в два-три предложения.'}},
      {type: 'button', props: {label: 'Оставить заявку', href: '#form'}},
      {type: 'form', props: {fields: ['Имя', 'Email']}},
    ],
  },
  {
    id: 'card',
    label: 'Визитка',
    blocks: [
      {type: 'heading', props: {text: 'Иван Петров'}},
      {type: 'text', props: {body: 'Разработчик · Москва · ivan@example.com'}},
      {type: 'button', props: {label: 'Написать в Telegram', href: 'https://t.me/example'}},
    ],
  },
];

let blockSeq = 1;

export function newBlock(type) {
  const id = `b${blockSeq++}`;
  const defaults = {
    hero: {title: 'Заголовок страницы', subtitle: 'Подзаголовок'},
    heading: {text: 'Раздел'},
    text: {body: 'Текст блока. Его можно редактировать в панели справа.'},
    button: {label: 'Подробнее', href: '#'},
    image: {alt: 'Иллюстрация', caption: 'Подпись к изображению'},
    form: {fields: ['Имя', 'Телефон']},
  };
  return {id, type, props: {...(defaults[type] ?? {})}};
}

export function renderBlockHtml(block) {
  const p = block.props;
  switch (block.type) {
    case 'hero':
      return `<header class="wb-hero"><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p></header>`;
    case 'heading':
      return `<h2 class="wb-h">${esc(p.text)}</h2>`;
    case 'text':
      return `<p class="wb-p">${esc(p.body)}</p>`;
    case 'button':
      return `<a class="wb-btn" href="${escAttr(p.href)}">${esc(p.label)}</a>`;
    case 'image':
      return `<figure class="wb-img"><div class="wb-ph" aria-label="${escAttr(p.alt)}"></div><figcaption>${esc(p.caption)}</figcaption></figure>`;
    case 'form':
      return `<form class="wb-form">${(p.fields || [])
        .map((f) => `<label>${esc(f)}<input type="text" name="${escAttr(f)}" /></label>`)
        .join('')}</form>`;
    default:
      return '';
  }
}

export function buildPageHtml(blocks) {
  const body = blocks.map(renderBlockHtml).join('\n');
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Сайт из конструктора</title>
<style>
body{font-family:system-ui,sans-serif;margin:0;padding:0;background:#f6f7fb;color:#1a1a2e;}
.wb-hero{background:linear-gradient(135deg,#4a5fc1,#7b68ee);color:#fff;padding:2.5rem 1.5rem;text-align:center;}
.wb-hero h1{margin:0 0 0.5rem;font-size:1.75rem;}
.wb-h{padding:1rem 1.5rem 0;margin:0;font-size:1.35rem;}
.wb-p{padding:0.5rem 1.5rem 1rem;line-height:1.55;margin:0;color:#444;}
.wb-btn{display:inline-block;margin:0 1.5rem 1.25rem;padding:0.6rem 1.2rem;background:#264de4;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;}
.wb-img{padding:1rem 1.5rem;}
.wb-ph{height:120px;border-radius:10px;background:linear-gradient(145deg,#dde2f0,#c5cce0);}
.wb-form{padding:1rem 1.5rem 1.5rem;display:flex;flex-direction:column;gap:0.65rem;max-width:320px;}
.wb-form label{font-size:0.85rem;display:flex;flex-direction:column;gap:0.25rem;}
.wb-form input{padding:0.45rem 0.55rem;border:1px solid #ccc;border-radius:6px;}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

export function publishSteps(blocks) {
  return [
    {step: 1, label: 'Редактор', detail: 'Вы собрали страницу из блоков в браузере конструктора.'},
    {step: 2, label: 'Облако CMS', detail: `Контент ${blocks.length} блоков сохранён в базе провайдера.`},
    {step: 3, label: 'Генерация', detail: 'Сервер собрал HTML, CSS и при необходимости JS.'},
    {step: 4, label: 'Публикация', detail: 'Файлы размещены на веб-сервере — сайт доступен по URL.'},
  ];
}
