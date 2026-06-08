import type { ToolMode } from '../types/schema';
import { isShapeTool } from './createElement';

export function isDrawingTool(tool: ToolMode): boolean {
  return tool === 'pen' || tool === 'eraser' || isShapeTool(tool);
}

export function elementsAreInteractive(tool: ToolMode): boolean {
  return tool === 'select' || tool === 'connector' || tool === 'pan';
}
