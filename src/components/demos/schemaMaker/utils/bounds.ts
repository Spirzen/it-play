import type { SchemaElement } from '../types/schema';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getElementBounds(el: SchemaElement): Bounds {
  if (el.type === 'pen' || el.type === 'line' || el.type === 'arrow') {
    const pts = el.points ?? [];
    if (pts.length < 2) {
      return { x: el.x, y: el.y, width: 40, height: 40 };
    }
    let minX = pts[0];
    let minY = pts[1];
    let maxX = pts[0];
    let maxY = pts[1];
    for (let i = 2; i < pts.length; i += 2) {
      minX = Math.min(minX, pts[i]);
      minY = Math.min(minY, pts[i + 1]);
      maxX = Math.max(maxX, pts[i]);
      maxY = Math.max(maxY, pts[i + 1]);
    }
    const pad = el.type === 'pen' ? el.strokeWidth + 4 : 8;
    return {
      x: el.x + minX - pad,
      y: el.y + minY - pad,
      width: maxX - minX + pad * 2 || 1,
      height: maxY - minY + pad * 2 || 1,
    };
  }

  if (el.type === 'connector') {
    const pts = el.points ?? [];
    if (pts.length < 4) return { x: 0, y: 0, width: 1, height: 1 };
    let minX = pts[0];
    let minY = pts[1];
    let maxX = pts[0];
    let maxY = pts[1];
    for (let i = 2; i < pts.length; i += 2) {
      minX = Math.min(minX, pts[i]);
      minY = Math.min(minY, pts[i + 1]);
      maxX = Math.max(maxX, pts[i]);
      maxY = Math.max(maxY, pts[i + 1]);
    }
    return { x: minX, y: minY, width: maxX - minX || 1, height: maxY - minY || 1 };
  }

  return {
    x: el.x,
    y: el.y,
    width: el.width ?? 120,
    height: el.height ?? 80,
  };
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

export function findElementsInRect(
  elements: SchemaElement[],
  rect: Bounds,
): string[] {
  return elements
    .filter((el) => el.type !== 'connector')
    .filter((el) => boundsIntersect(getElementBounds(el), rect))
    .map((el) => el.id);
}
