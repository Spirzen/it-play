import type { SchemaElement } from '../types/schema';

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export function penStrokeHit(
  el: SchemaElement,
  wx: number,
  wy: number,
  radius: number,
): boolean {
  if (el.type !== 'pen' || !el.points) return false;
  const pts = el.points;
  const ox = el.x;
  const oy = el.y;
  for (let i = 0; i < pts.length - 2; i += 2) {
    const d = distToSegment(
      wx,
      wy,
      ox + pts[i],
      oy + pts[i + 1],
      ox + pts[i + 2],
      oy + pts[i + 3],
    );
    if (d <= radius + el.strokeWidth) return true;
  }
  if (pts.length >= 2) {
    const d = Math.hypot(wx - (ox + pts[0]), wy - (oy + pts[1]));
    if (d <= radius + el.strokeWidth) return true;
  }
  return false;
}

export function eraseAtPoint(
  elements: SchemaElement[],
  wx: number,
  wy: number,
  radius: number,
): SchemaElement[] {
  const toRemove = new Set<string>();
  for (const el of elements) {
    if (el.type === 'pen' && penStrokeHit(el, wx, wy, radius)) {
      toRemove.add(el.id);
    }
  }
  if (toRemove.size === 0) return elements;
  return elements.filter(
    (el) =>
      !toRemove.has(el.id) &&
      !toRemove.has(el.fromId ?? '') &&
      !toRemove.has(el.toId ?? ''),
  );
}
