import { v4 as uuid } from 'uuid';
import type { SchemaElement, ToolMode } from '../types/schema';

const DEFAULT_SIZES: Partial<Record<ToolMode, { w: number; h: number }>> = {
  rectangle: { w: 140, h: 90 },
  roundedRect: { w: 140, h: 90 },
  circle: { w: 100, h: 100 },
  diamond: { w: 120, h: 90 },
  triangle: { w: 120, h: 100 },
  text: { w: 140, h: 48 },
  comment: { w: 200, h: 100 },
  line: { w: 120, h: 0 },
  arrow: { w: 120, h: 0 },
};

export function createElementAt(
  tool: ToolMode,
  x: number,
  y: number,
  colors: { fill: string; stroke: string; strokeWidth: number },
): SchemaElement | null {
  const id = uuid();
  const { fill, stroke, strokeWidth } = colors;

  switch (tool) {
    case 'rectangle':
      return {
        id,
        type: 'rectangle',
        x: x - 70,
        y: y - 45,
        width: 140,
        height: 90,
        fill,
        stroke,
        strokeWidth,
      };
    case 'roundedRect':
      return {
        id,
        type: 'roundedRect',
        x: x - 70,
        y: y - 45,
        width: 140,
        height: 90,
        cornerRadius: 12,
        fill,
        stroke,
        strokeWidth,
      };
    case 'circle':
      return {
        id,
        type: 'circle',
        x: x - 50,
        y: y - 50,
        width: 100,
        height: 100,
        fill,
        stroke,
        strokeWidth,
      };
    case 'diamond':
      return {
        id,
        type: 'diamond',
        x: x - 60,
        y: y - 45,
        width: 120,
        height: 90,
        fill,
        stroke,
        strokeWidth,
      };
    case 'triangle':
      return {
        id,
        type: 'triangle',
        x: x - 60,
        y: y - 50,
        width: 120,
        height: 100,
        fill,
        stroke,
        strokeWidth,
      };
    case 'line':
      return {
        id,
        type: 'line',
        x: x - 60,
        y,
        points: [0, 0, 120, 0],
        fill: 'transparent',
        stroke,
        strokeWidth,
      };
    case 'arrow':
      return {
        id,
        type: 'arrow',
        x: x - 60,
        y,
        points: [0, 0, 120, 0],
        fill: stroke,
        stroke,
        strokeWidth,
      };
    case 'text':
      return {
        id,
        type: 'text',
        x: x - 70,
        y: y - 24,
        width: 140,
        height: 48,
        text: 'Подпись',
        fontSize: 18,
        fill: 'transparent',
        stroke,
        strokeWidth: 0,
      };
    case 'comment':
      return {
        id,
        type: 'comment',
        x: x - 100,
        y: y - 50,
        width: 200,
        height: 100,
        text: 'Комментарий…',
        cornerRadius: 8,
        fill: '#faf6e8',
        stroke: '#d4c4a8',
        strokeWidth: 1.5,
      };
    default:
      return null;
  }
}

export function isShapeTool(tool: ToolMode): boolean {
  return tool in DEFAULT_SIZES;
}
