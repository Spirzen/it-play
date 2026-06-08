/** 2D-проекция эмбеддингов для демо (x,y — семантическая близость). */
export const EMBEDDINGS = [
  {id: 'king', label: 'король', x: 0.82, y: 0.71, group: 'royal'},
  {id: 'queen', label: 'королева', x: 0.78, y: 0.55, group: 'royal'},
  {id: 'prince', label: 'принц', x: 0.88, y: 0.62, group: 'royal'},
  {id: 'apple', label: 'яблоко', x: 0.22, y: 0.78, group: 'fruit'},
  {id: 'pear', label: 'груша', x: 0.18, y: 0.62, group: 'fruit'},
  {id: 'banana', label: 'банан', x: 0.28, y: 0.55, group: 'fruit'},
  {id: 'car', label: 'автомобиль', x: 0.55, y: 0.18, group: 'transport'},
  {id: 'bus', label: 'автобус', x: 0.48, y: 0.08, group: 'transport'},
  {id: 'train', label: 'поезд', x: 0.62, y: 0.12, group: 'transport'},
];

export function cosine2d(a, b) {
  const dot = a.x * b.x + a.y * b.y;
  const na = Math.hypot(a.x, a.y) || 1;
  const nb = Math.hypot(b.x, b.y) || 1;
  return dot / (na * nb);
}

export function nearest(queryId, k = 3) {
  const q = EMBEDDINGS.find((e) => e.id === queryId);
  if (!q) return [];
  return EMBEDDINGS.map((e) => ({
    ...e,
    score: cosine2d(q, e),
  }))
    .filter((e) => e.id !== queryId)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export const METRICS = [
  {id: 'cosine', label: 'Косинусная', desc: 'Угол между векторами; норма не важна'},
  {id: 'euclid', label: 'Евклидова', desc: 'Прямое расстояние в пространстве'},
  {id: 'dot', label: 'Скалярное произв.', desc: 'Быстрее при нормализованных векторах'},
];
