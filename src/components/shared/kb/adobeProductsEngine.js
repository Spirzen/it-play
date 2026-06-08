/** Данные и отрисовка для демо продуктов Adobe */

export const ADOBE_PRODUCTS = {
  photoshop: {
    id: 'photoshop',
    label: 'Photoshop',
    brand: '#31a8ff',
    subtitle: 'Слои, маски и режимы наложения',
    hint: 'Слои и маски — non-destructive workflow: исходные пиксели не перезаписываются.',
  },
  illustrator: {
    id: 'illustrator',
    label: 'Illustrator',
    brand: '#ff9a00',
    subtitle: 'Векторные кривые Bézier и глобальные цвета',
    hint: 'Каждый объект — параметрическая кривая; масштабирование без потери качества.',
  },
  premiere: {
    id: 'premiere',
    label: 'Premiere Pro',
    brand: '#9999ff',
    subtitle: 'Нелинейный монтаж: дорожки и последовательность',
    hint: 'Проект ссылается на медиа — видео не копируется в .prproj.',
  },
  aftereffects: {
    id: 'aftereffects',
    label: 'After Effects',
    brand: '#d291ff',
    subtitle: 'Композиция, слои и ключевые кадры',
    hint: '2.5D-композитинг: каждый слой — независимая сцена с эффектами и выражениями.',
  },
  acrobat: {
    id: 'acrobat',
    label: 'Acrobat Pro',
    brand: '#ff0000',
    subtitle: 'PDF: страницы, формы и подпись',
    hint: 'Tagged PDF и AcroForms превращают "электронную бумагу" в интерактивный документ.',
  },
  indesign: {
    id: 'indesign',
    label: 'InDesign',
    brand: '#ff3366',
    subtitle: 'Связанные текстовые фреймы и стили',
    hint: 'Текст "течёт" между фреймами — при добавлении контента перестраиваются страницы.',
  },
  lightroom: {
    id: 'lightroom',
    label: 'Lightroom',
    brand: '#31a8ff',
    subtitle: 'RAW-обработка: каталог и неразрушающие правки',
    hint: 'Правки — инструкции в XMP; исходный RAW не изменяется.',
  },
  rush: {
    id: 'rush',
    label: 'Premiere Rush',
    brand: '#8b7cf6',
    subtitle: 'Быстрый монтаж под соцсети',
    hint: 'Auto Reframe и пресеты экспорта под Shorts, Reels, TikTok.',
  },
  xd: {
    id: 'xd',
    label: 'Adobe XD',
    brand: '#ff61f6',
    subtitle: 'Макеты и интерактивный прототип',
    hint: 'Режимы Design и Prototype: триггеры связывают экраны с анимацией.',
  },
  express: {
    id: 'express',
    label: 'Adobe Express',
    brand: '#ff6b9d',
    subtitle: 'Шаблоны и AI для быстрого контента',
    hint: 'Веб-платформа без навыков дизайна: посты, видео, PDF.',
  },
  animate: {
    id: 'animate',
    label: 'Animate',
    brand: '#9999ff',
    subtitle: 'Покадровая и векторная анимация',
    hint: 'Экспорт в HTML5 Canvas, SVG, Lottie — open web standards.',
  },
  dreamweaver: {
    id: 'dreamweaver',
    label: 'Dreamweaver',
    brand: '#5c2d91',
    subtitle: 'Код ↔ Live View',
    hint: 'Синхронизация HTML/CSS между редактором и визуальным превью.',
  },
  stock: {
    id: 'stock',
    label: 'Adobe Stock',
    brand: '#ff3366',
    subtitle: 'Маркетплейс внутри приложений',
    hint: 'Лицензирование и вставка контента без переключения окон.',
  },
  fonts: {
    id: 'fonts',
    brand: '#ff3366',
    label: 'Adobe Fonts',
    subtitle: 'Синхронизация шрифтов в Creative Cloud',
    hint: 'Активированный шрифт появляется в Photoshop, Illustrator, InDesign.',
  },
  documentcloud: {
    id: 'documentcloud',
    label: 'Document Cloud',
    brand: '#ff0000',
    subtitle: 'Acrobat, Sign, Scan — документооборот',
    hint: 'Подписи, аналитика просмотра и облачный обмен.',
  },
  experiencecloud: {
    id: 'experiencecloud',
    label: 'Experience Cloud',
    brand: '#eb1000',
    subtitle: 'AEM, Analytics, Target, Campaign',
    hint: 'Enterprise-маркетинг: персонализация и omnichannel.',
  },
  substance: {
    id: 'substance',
    label: 'Substance 3D Stager',
    brand: '#8b5cf6',
    subtitle: 'Визуализация 3D-сцен без кода',
    hint: 'Импорт OBJ/FBX, освещение и фотореалистичный рендер.',
  },
  audition: {
    id: 'audition',
    label: 'Audition',
    brand: '#9900ff',
    subtitle: 'Спектральное редактирование аудио',
    hint: 'Round-trip с Premiere Pro; шумоподавление на основе ИИ.',
  },
  aero: {
    id: 'aero',
    label: 'Adobe Aero',
    brand: '#00d4aa',
    subtitle: 'AR без программирования',
    hint: '2D/3D в реальном окружении через iPad; экспорт WebXR.',
  },
  incopy: {
    id: 'incopy',
    label: 'InCopy',
    brand: '#ff3366',
    subtitle: 'Текст синхронно с InDesign',
    hint: 'Писатель в InCopy, вёрстка в InDesign — общий макет.',
  },
  fresco: {
    id: 'fresco',
    label: 'Fresco',
    brand: '#ff6b35',
    subtitle: 'Live и Vector Brushes на iPad',
    hint: 'Физика акварели/масла; слои синхронизируются с Photoshop.',
  },
  dimension: {
    id: 'dimension',
    label: 'Dimension',
    brand: '#8b5cf6',
    subtitle: '3D-композитинг для дизайнеров',
    hint: '2D-логотип на 3D-модель из Stock — без знания моделирования.',
  },
};

export const PS_LAYERS = [
  {id: 'bg', label: 'Фон', color: '#4a5568', opacity: 100, visible: true},
  {id: 'photo', label: 'Фото', color: '#3182ce', opacity: 100, visible: true},
  {id: 'adj', label: 'Кривые', color: '#48bb78', opacity: 80, visible: true},
  {id: 'text', label: 'Текст', color: '#ed8936', opacity: 100, visible: true},
];

export const PS_BLEND_MODES = [
  {id: 'normal', label: 'Normal'},
  {id: 'multiply', label: 'Multiply'},
  {id: 'screen', label: 'Screen'},
  {id: 'overlay', label: 'Overlay'},
];

export const PR_TRACKS = [
  {id: 'v2', label: 'V2 — графика', type: 'video', clips: [{start: 0.1, w: 0.25}]},
  {id: 'v1', label: 'V1 — видео', type: 'video', clips: [{start: 0, w: 0.9}]},
  {id: 'a1', label: 'A1 — диалог', type: 'audio', clips: [{start: 0.05, w: 0.7}]},
  {id: 'a2', label: 'A2 — музыка', type: 'audio', clips: [{start: 0, w: 1}]},
];

export const AE_LAYERS = [
  {id: 'cam', label: 'Camera 1'},
  {id: 'text', label: 'Title'},
  {id: 'shape', label: 'Shape Layer'},
  {id: 'footage', label: 'footage.mp4'},
];

export const LR_SLIDERS = [
  {id: 'exposure', label: 'Экспозиция', min: -2, max: 2, def: 0},
  {id: 'contrast', label: 'Контраст', min: -50, max: 50, def: 0},
  {id: 'highlights', label: 'Света', min: -100, max: 100, def: 0},
  {id: 'shadows', label: 'Тени', min: -100, max: 100, def: 0},
];

export const RUSH_FORMATS = [
  {id: '169', label: '16:9', w: 320, h: 180},
  {id: '916', label: '9:16', w: 120, h: 213},
  {id: '11', label: '1:1', w: 180, h: 180},
];

export const XD_SCREENS = [
  {id: 'home', label: 'Главная'},
  {id: 'list', label: 'Каталог'},
  {id: 'detail', label: 'Карточка'},
];

export const EXPRESS_TEMPLATES = [
  {id: 'story', label: 'Story 9:16'},
  {id: 'post', label: 'Post 1:1'},
  {id: 'banner', label: 'Баннер'},
  {id: 'video', label: 'Видео'},
];

export const STOCK_ASSETS = [
  {id: '1', type: 'photo', title: 'Город ночью'},
  {id: '2', type: 'video', title: 'Океан 4K'},
  {id: '3', type: 'vector', title: 'Иконки UI'},
  {id: '4', type: '3d', title: 'Бутылка 3D'},
];

export const FONT_SAMPLES = [
  {id: 'source', label: 'Source Sans 3', active: true},
  {id: 'myriad', label: 'Myriad Pro', active: false},
  {id: 'minion', label: 'Minion Pro', active: false},
];

export const EXP_MODULES = [
  {id: 'aem', label: 'Experience Manager'},
  {id: 'analytics', label: 'Analytics'},
  {id: 'target', label: 'Target'},
  {id: 'campaign', label: 'Campaign'},
];

function grid(ctx, w, h, step, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

export function drawPhotoshop(ctx, w, h, layers, blendMode) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);
  const visible = layers.filter((l) => l.visible);
  visible.forEach((layer, i) => {
    ctx.globalAlpha = (layer.opacity / 100) * (i === visible.length - 1 ? 1 : 0.85);
    if (blendMode === 'multiply') ctx.globalCompositeOperation = 'multiply';
    else if (blendMode === 'screen') ctx.globalCompositeOperation = 'screen';
    else if (blendMode === 'overlay') ctx.globalCompositeOperation = 'overlay';
    else ctx.globalCompositeOperation = 'source-over';
    const pad = 20 + i * 12;
    ctx.fillStyle = layer.color;
    ctx.fillRect(pad, pad, w - pad * 2, h - pad * 2);
  });
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '11px sans-serif';
  ctx.fillText(`Blend: ${blendMode}`, 8, h - 8);
}

export function drawIllustrator(ctx, w, h, points) {
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);
  grid(ctx, w, h, 16, 'rgba(0,0,0,0.06)');
  if (points.length < 2) return;
  ctx.strokeStyle = '#ff9a00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    ctx.quadraticCurveTo(cpx, prev.y, p.x, p.y);
  }
  ctx.stroke();
  points.forEach((p, idx) => {
    ctx.fillStyle = idx === 0 || idx === points.length - 1 ? '#ff9a00' : '#fff';
    ctx.strokeStyle = '#ff9a00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

export function drawPremiere(ctx, w, h, playhead, tracks) {
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, w, h);
  const trackH = (h - 24) / tracks.length;
  tracks.forEach((track, ti) => {
    const y = 20 + ti * trackH;
    ctx.fillStyle = '#333';
    ctx.fillRect(0, y, w, trackH - 2);
    ctx.fillStyle = '#aaa';
    ctx.font = '9px monospace';
    ctx.fillText(track.label.slice(0, 12), 4, y + 12);
    track.clips.forEach((clip) => {
      const x = clip.start * w;
      const cw = clip.w * w;
      ctx.fillStyle = track.type === 'video' ? '#4a9eff' : '#48bb78';
      ctx.fillRect(x, y + 14, cw, trackH - 18);
    });
  });
  const px = playhead * w;
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, 0);
  ctx.lineTo(px, h);
  ctx.stroke();
}

export function drawAfterEffects(ctx, w, h, progress, activeLayer) {
  ctx.fillStyle = '#2d2d30';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2 + Math.sin(progress * Math.PI * 2) * 60;
  const cy = h / 2 + Math.cos(progress * Math.PI * 2) * 30;
  ctx.fillStyle = activeLayer === 'shape' ? '#d291ff' : '#666';
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, w - 80, h - 80);
  ctx.fillStyle = '#999';
  ctx.font = '10px monospace';
  ctx.fillText('Comp 1920×1080', 48, 52);
}

export function drawAcrobat(ctx, w, h, page, hasForm) {
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, w, h);
  const pw = w * 0.55;
  const ph = h * 0.75;
  const px = (w - pw) / 2;
  const py = (h - ph) / 2;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeRect(px, py, pw, ph);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`Страница ${page}`, px + 12, py + 24);
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Tagged PDF · WCAG', px + 12, py + 42);
  if (hasForm) {
    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(px + 12, py + 60, pw - 24, 22);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Поле формы (AcroForm)', px + 16, py + 75);
  }
}

export function drawInDesign(ctx, w, h, fillLevel) {
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, w, h);
  const f1w = w * 0.38;
  const f2w = w * 0.38;
  const gap = 12;
  const hFrame = h * 0.7;
  const top = (h - hFrame) / 2;
  ctx.strokeStyle = '#ff3366';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, top, f1w, hFrame);
  ctx.strokeRect(16 + f1w + gap, top, f2w, hFrame);
  const overflow = Math.max(0, fillLevel - 0.55);
  const h1 = Math.min(fillLevel, 1) * hFrame;
  ctx.fillStyle = 'rgba(51,65,85,0.15)';
  ctx.fillRect(18, top + 2, f1w - 4, h1);
  if (overflow > 0) {
    ctx.fillRect(18 + f1w + gap + 2, top + 2, f2w - 4, overflow * hFrame * 1.8);
  }
  ctx.fillStyle = '#64748b';
  ctx.font = '9px sans-serif';
  ctx.fillText('Фрейм 1', 20, top - 6);
  ctx.fillText('Фрейм 2 ←', 18 + f1w + gap, top - 6);
}

export function drawLightroom(ctx, w, h, values) {
  const exp = values.exposure ?? 0;
  const cont = values.contrast ?? 0;
  const bright = 0.45 + exp * 0.08 + cont * 0.004;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, `hsl(210, 40%, ${bright * 100}%)`);
  grad.addColorStop(1, `hsl(30, 50%, ${(bright - 0.1) * 100}%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(8, h - 36, w - 16, 28);
  ctx.fillStyle = '#48bb78';
  for (let i = 0; i < 40; i++) {
    const bh = 8 + Math.random() * 18;
    ctx.fillRect(12 + i * ((w - 24) / 40), h - 28 - bh, 4, bh);
  }
}

export function drawSubstance(ctx, w, h, rot, light) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2 + 10;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rot * Math.PI) / 180);
  const g = ctx.createRadialGradient(0, -20, 10, 0, 0, 80);
  g.addColorStop(0, `rgba(255,255,${200 + light * 0.5},0.9)`);
  g.addColorStop(1, 'rgba(100,100,120,0.4)');
  ctx.fillStyle = g;
  ctx.fillRect(-40, -50, 80, 60);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-50, 10, 100, 12);
  ctx.restore();
}

export function drawDimension(ctx, w, h, angle) {
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2 + 20;
  ctx.save();
  ctx.translate(cx, cy);
  const skew = Math.sin((angle * Math.PI) / 180) * 0.3;
  ctx.transform(1, 0, skew, 1, 0, 0);
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(0, 0, 50, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff3366';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LOGO', 0, 5);
  ctx.restore();
}

export function drawFresco(ctx, w, h, brush, pressure) {
  ctx.fillStyle = '#fff8f0';
  ctx.fillRect(0, 0, w, h);
  const strokes = pressure;
  for (let i = 0; i < strokes; i++) {
    const x = 40 + i * 18 + Math.sin(i) * 8;
    const y = h / 2 + Math.cos(i * 0.7) * 30;
    if (brush === 'live') {
      const g = ctx.createRadialGradient(x, y, 0, x, y, 12 + i * 2);
      g.addColorStop(0, 'rgba(59,130,246,0.5)');
      g.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 14 + i, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2 + i * 0.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y - 5);
      ctx.stroke();
    }
  }
}

export function drawAero(ctx, w, h, dist) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#87ceeb');
  bg.addColorStop(1, '#c4b896');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(0, h * 0.55, w, h * 0.45);
  const scale = 0.5 + (1 - dist) * 0.5;
  const ox = w / 2;
  const oy = h * 0.45;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#00d4aa';
  ctx.fillRect(-30, -40, 60, 50);
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AR', 0, -10);
  ctx.restore();
  ctx.fillStyle = '#334155';
  ctx.font = '9px sans-serif';
  ctx.fillText(`Расстояние: ${(dist * 100).toFixed(0)}%`, 8, h - 8);
}

export function getProductMeta(productId) {
  return ADOBE_PRODUCTS[productId] ?? ADOBE_PRODUCTS.photoshop;
}
