import type { AnchorIndex, SchemaElement } from '../types/schema';
import { getElementBounds } from './bounds';

export interface Point {
  x: number;
  y: number;
}

export { getElementBounds };

/** Eight anchors around the bounding box (N, NE, E, SE, S, SW, W, NW). */
export function getAnchors(el: SchemaElement): Point[] {
  const { x, y, width, height } = getElementBounds(el);
  const cx = x + width / 2;
  const cy = y + height / 2;
  return [
    { x: cx, y },
    { x: x + width, y },
    { x: x + width, y: cy },
    { x: x + width, y: y + height },
    { x: cx, y: y + height },
    { x, y: y + height },
    { x, y: cy },
    { x, y },
  ];
}

export function getAnchorPoint(el: SchemaElement, index: AnchorIndex): Point {
  return getAnchors(el)[index];
}

export function nearestAnchor(
  el: SchemaElement,
  point: Point,
): { index: AnchorIndex; dist: number } {
  const anchors = getAnchors(el);
  let best: AnchorIndex = 0;
  let minDist = Infinity;
  anchors.forEach((a, i) => {
    const d = Math.hypot(a.x - point.x, a.y - point.y);
    if (d < minDist) {
      minDist = d;
      best = i as AnchorIndex;
    }
  });
  return { index: best, dist: minDist };
}
