import { useCallback, useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import type {
  SchemaDocument,
  SchemaElement,
  ToolMode,
  Viewport,
} from '../types/schema';
import { DEFAULT_FILL, DEFAULT_STROKE } from '../types/schema';

interface State {
  elements: SchemaElement[];
  selectedIds: string[];
  tool: ToolMode;
  viewport: Viewport;
  docName: string;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}

type Action =
  | { type: 'SET_TOOL'; tool: ToolMode }
  | { type: 'SET_ELEMENTS'; elements: SchemaElement[] }
  | { type: 'ADD_ELEMENT'; element: SchemaElement }
  | { type: 'UPDATE_ELEMENT'; id: string; patch: Partial<SchemaElement> }
  | { type: 'DELETE_SELECTED' }
  | { type: 'SELECT'; ids: string[]; mode?: 'replace' | 'add' | 'toggle' }
  | { type: 'SET_VIEWPORT'; viewport: Partial<Viewport> }
  | { type: 'SET_COLORS'; stroke?: string; fill?: string }
  | { type: 'SET_STROKE_WIDTH'; width: number }
  | { type: 'SET_DOC_NAME'; name: string }
  | { type: 'LOAD_DOCUMENT'; doc: SchemaDocument }
  | { type: 'BRING_FORWARD' }
  | { type: 'SEND_BACKWARD' };

const initialViewport: Viewport = { scale: 1, x: 0, y: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, tool: action.tool };
    case 'SET_ELEMENTS':
      return { ...state, elements: action.elements };
    case 'ADD_ELEMENT':
      return { ...state, elements: [...state.elements, action.element] };
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.id ? { ...el, ...action.patch } : el,
        ),
      };
    case 'DELETE_SELECTED':
      return {
        ...state,
        elements: state.elements.filter(
          (el) =>
            !state.selectedIds.includes(el.id) &&
            !state.selectedIds.some(
              (sid) => el.fromId === sid || el.toId === sid,
            ),
        ),
        selectedIds: [],
      };
    case 'SELECT': {
      const mode = action.mode ?? 'replace';
      if (mode === 'replace') return { ...state, selectedIds: action.ids };
      if (mode === 'add') {
        const merged = [...new Set([...state.selectedIds, ...action.ids])];
        return { ...state, selectedIds: merged };
      }
      let next = [...state.selectedIds];
      for (const id of action.ids) {
        if (next.includes(id)) next = next.filter((x) => x !== id);
        else next.push(id);
      }
      return { ...state, selectedIds: next };
    }
    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: { ...state.viewport, ...action.viewport },
      };
    case 'SET_COLORS':
      return {
        ...state,
        strokeColor: action.stroke ?? state.strokeColor,
        fillColor: action.fill ?? state.fillColor,
      };
    case 'SET_STROKE_WIDTH':
      return { ...state, strokeWidth: action.width };
    case 'SET_DOC_NAME':
      return { ...state, docName: action.name };
    case 'LOAD_DOCUMENT':
      return {
        ...state,
        elements: action.doc.elements,
        viewport: action.doc.viewport,
        docName: action.doc.name,
        selectedIds: [],
      };
    case 'BRING_FORWARD': {
      if (state.selectedIds.length !== 1) return state;
      const idx = state.elements.findIndex((e) => e.id === state.selectedIds[0]);
      if (idx < 0 || idx >= state.elements.length - 1) return state;
      const next = [...state.elements];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return { ...state, elements: next };
    }
    case 'SEND_BACKWARD': {
      if (state.selectedIds.length !== 1) return state;
      const idx = state.elements.findIndex((e) => e.id === state.selectedIds[0]);
      if (idx <= 0) return state;
      const next = [...state.elements];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return { ...state, elements: next };
    }
    default:
      return state;
  }
}

export function useSchemaStore() {
  const [state, dispatch] = useReducer(reducer, {
    elements: [],
    selectedIds: [],
    tool: 'select',
    viewport: initialViewport,
    docName: 'Без названия',
    strokeColor: DEFAULT_STROKE,
    fillColor: DEFAULT_FILL,
    strokeWidth: 2,
  });

  const createShape = useCallback(
    (
      type: SchemaElement['type'],
      x: number,
      y: number,
      width?: number,
      height?: number,
      extra?: Partial<SchemaElement>,
    ): SchemaElement => ({
      id: uuid(),
      type,
      x,
      y,
      width: width ?? (type === 'comment' ? 200 : 120),
      height: height ?? (type === 'comment' ? 100 : 80),
      fill: state.fillColor,
      stroke: state.strokeColor,
      strokeWidth: state.strokeWidth,
      text: type === 'text' ? 'Текст' : type === 'comment' ? 'Комментарий' : '',
      fontSize: type === 'text' ? 18 : 14,
      cornerRadius: type === 'roundedRect' ? 12 : type === 'comment' ? 8 : 0,
      ...extra,
    }),
    [state.fillColor, state.strokeColor, state.strokeWidth],
  );

  const toDocument = useCallback((): SchemaDocument => {
    const now = new Date().toISOString();
    return {
      version: 1,
      name: state.docName,
      viewport: state.viewport,
      elements: state.elements,
      createdAt: now,
      updatedAt: now,
    };
  }, [state.docName, state.viewport, state.elements]);

  return { state, dispatch, createShape, toDocument };
}
