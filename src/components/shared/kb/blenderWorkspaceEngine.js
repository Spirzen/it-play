/** Данные для демо рабочего пространства Blender */

export const BLENDER_PANELS = [
  {id: 'viewport', label: '3D Viewport', icon: '◫'},
  {id: 'outliner', label: 'Outliner', icon: '☰'},
  {id: 'shader', label: 'Shader Editor', icon: '⬡'},
];

export const SCENE_TREE = [
  {id: 'collection', label: 'Collection', type: 'collection', children: [
    {id: 'mesh', label: 'Suzanne', type: 'mesh', icon: '▣'},
    {id: 'light', label: 'Area Light', type: 'light', icon: '☀'},
    {id: 'camera', label: 'Camera', type: 'camera', icon: '▶'},
  ]},
  {id: 'world', label: 'World', type: 'world', icon: '🌐'},
];

export const SHADER_NODES = [
  {id: 'tex', label: 'Noise Texture', type: 'input', x: 0, y: 0},
  {id: 'colorramp', label: 'ColorRamp', type: 'process', x: 1, y: 0},
  {id: 'bsdf', label: 'Principled BSDF', type: 'shader', x: 2, y: 0},
  {id: 'out', label: 'Material Output', type: 'output', x: 3, y: 0},
];

export const SHADER_EDGES = [
  ['tex', 'colorramp'],
  ['colorramp', 'bsdf'],
  ['bsdf', 'out'],
];

/** Вершины куба в локальных координатах */
const CUBE_VERTS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];

const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

function rotateY([x, y, z], angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c + z * s, y, -x * s + z * c];
}

function rotateX([x, y, z], angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

/** Ортографическая проекция + лёгкая перспектива */
export function projectVertex(v, rotY, rotX, size, cx, cy) {
  let p = rotateY(v, rotY);
  p = rotateX(p, rotX);
  const scale = size * 0.38;
  const px = cx + p[0] * scale;
  const py = cy - p[1] * scale + p[2] * scale * 0.35;
  const depth = p[2];
  return {x: px, y: py, depth};
}

export function getProjectedCube(rotY, rotX, size, cx, cy) {
  const pts = CUBE_VERTS.map((v) => projectVertex(v, rotY, rotX, size, cx, cy));
  const edges = CUBE_EDGES.map(([a, b]) => ({
    a: pts[a],
    b: pts[b],
    depth: (pts[a].depth + pts[b].depth) / 2,
  }));
  edges.sort((e1, e2) => e1.depth - e2.depth);
  return {points: pts, edges};
}

export function drawBlenderViewport(ctx, width, height, rotY, rotX, mode) {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--ifm-background-color')
    .trim() || '#2b2b2b';
  ctx.fillStyle = mode === 'rendered' ? '#1a1a2e' : '#3d3d3d';
  ctx.fillRect(0, 0, width, height);

  const gridColor = 'rgba(255,255,255,0.08)';
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const cx = width / 2;
  const cy = height / 2;
  for (let i = -4; i <= 4; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * 18, 0);
    ctx.lineTo(cx + i * 18, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, cy + i * 18);
    ctx.lineTo(width, cy + i * 18);
    ctx.stroke();
  }

  const size = Math.min(width, height);
  const {edges, points} = getProjectedCube(rotY, rotX, size, cx, cy);

  if (mode === 'wireframe' || mode === 'solid') {
    if (mode === 'solid') {
      const faces = [
        [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5],
      ];
      const faceDepth = faces.map((f) => ({
        f,
        d: f.reduce((s, i) => s + points[i].depth, 0) / f.length,
      }));
      faceDepth.sort((a, b) => a.d - b.d);
      faceDepth.forEach(({f}) => {
        ctx.beginPath();
        ctx.moveTo(points[f[0]].x, points[f[0]].y);
        f.slice(1).forEach((i) => ctx.lineTo(points[i].x, points[i].y));
        ctx.closePath();
        ctx.fillStyle = 'rgba(230, 126, 34, 0.55)';
        ctx.fill();
      });
    }
    ctx.strokeStyle = mode === 'wireframe' ? '#f39c12' : '#e67e22';
    ctx.lineWidth = mode === 'wireframe' ? 2 : 1.5;
    edges.forEach(({a, b}) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
  }

  if (mode === 'rendered') {
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.45);
    grad.addColorStop(0, '#ff9f43');
    grad.addColorStop(1, '#c0392b');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy - 8, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.ellipse(cx - 18, cy - 28, 22, 12, -0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '11px monospace';
  ctx.fillText('Orbit: drag slider', 8, height - 8);
}

export const VIEW_MODES = [
  {id: 'wireframe', label: 'Wireframe'},
  {id: 'solid', label: 'Solid'},
  {id: 'rendered', label: 'Rendered'},
];

export function describePanel(panelId) {
  const map = {
    viewport: '3D Viewport — orbit, режимы отображения и превью рендера.',
    outliner: 'Outliner — иерархия Collection → объекты сцены (.blend).',
    shader: 'Shader Editor — узловой граф материала (Principled BSDF).',
  };
  return map[panelId] ?? '';
}
