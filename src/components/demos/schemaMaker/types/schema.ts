export type ToolMode =
  | 'select'
  | 'pan'
  | 'pen'
  | 'eraser'
  | 'rectangle'
  | 'roundedRect'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'connector'
  | 'text'
  | 'comment';

export type ElementType =
  | 'rectangle'
  | 'roundedRect'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'connector'
  | 'pen'
  | 'text'
  | 'comment';

export interface SchemaElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  points?: number[];
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity?: number;
  fontSize?: number;
  fontStyle?: string;
  fromId?: string;
  toId?: string;
  fromAnchor?: AnchorIndex;
  toAnchor?: AnchorIndex;
  cornerRadius?: number;
}

export type AnchorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Viewport {
  scale: number;
  x: number;
  y: number;
}

export interface SchemaDocument {
  version: 1;
  name: string;
  viewport: Viewport;
  elements: SchemaElement[];
  createdAt: string;
  updatedAt: string;
}

export const PALETTE = [
  '#e8ecf4',
  '#dce8e0',
  '#f0e8e4',
  '#ebe4f0',
  '#f4efe4',
  '#d4dce8',
  '#c9ddd0',
  '#e8d4d4',
  '#e4eef4',
  '#eef0e4',
  '#f4e8f0',
  '#e8f0ee',
  '#f0ece4',
  '#ddd8f0',
  '#d8f0e8',
  '#f0d8e8',
  '#ffffff',
  '#f8f6f3',
  '#8b9dc3',
  '#a8c4b4',
  '#c9a8a8',
  '#b8a8c4',
  '#d4c4a8',
  '#9cb4c4',
  '#b4c49c',
  '#c49cb4',
  '#a894c4',
  '#c4b494',
  '#7a94b4',
  '#94b47a',
  '#b47a94',
  '#4a5568',
  '#5c6578',
  '#3d4556',
] as const;

export const STROKE_COLORS = [
  '#8b9dc3',
  '#a8c4b4',
  '#c9a8a8',
  '#b8a8c4',
  '#d4c4a8',
  '#9cb4c4',
  '#b4c49c',
  '#c49cb4',
  '#a894c4',
  '#c4b494',
  '#7a94b4',
  '#94b47a',
  '#b47a94',
  '#6b7a94',
  '#5a6a82',
  '#4a5568',
  '#3d4556',
  '#2d3544',
] as const;

export const DEFAULT_FILL = '#e8ecf4';
export const DEFAULT_STROKE = '#8b9dc3';
