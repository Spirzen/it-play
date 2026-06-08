import { useCallback, useEffect, useRef, useState } from 'react';
import type Konva from 'konva';
import { SchemaCanvas } from './SchemaCanvas';
import { ShapePalette } from './ShapePalette';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { TextEditorOverlay } from './TextEditorOverlay';
import { useSchemaStore } from './hooks/useSchemaStore';
import type { SchemaDocument, ToolMode } from './types/schema';
import { createElementAt } from './utils/createElement';
import {
  downloadDataUrl,
  downloadJson,
  exportStageImage,
  exportStagePdf,
} from './utils/export';
import './schemaMakerTheme.css';
import './SchemaMakerApp.css';
import './Toolbar.css';
import './ShapePalette.css';
import './PropertiesPanel.css';
import './TextEditorOverlay.css';

type Props = {
  initialDocument?: SchemaDocument | null;
  defaultDocName?: string;
  height?: number;
};

export function SchemaMakerEditor({
  initialDocument = null,
  defaultDocName = 'Схема',
  height = 560,
}: Props) {
  const { state, dispatch, toDocument } = useSchemaStore();
  const stageRef = useRef<Konva.Stage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ w: 640, h: 480 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  const bootstrapped = useRef(false);

  const editingElement = editingTextId
    ? state.elements.find((e) => e.id === editingTextId) ?? null
    : null;

  const selected =
    state.selectedIds.length === 1
      ? state.elements.find((e) => e.id === state.selectedIds[0]) ?? null
      : null;

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    if (initialDocument?.elements) {
      dispatch({ type: 'LOAD_DOCUMENT', doc: initialDocument });
    } else if (defaultDocName) {
      dispatch({ type: 'SET_DOC_NAME', name: defaultDocName });
    }
  }, [defaultDocName, dispatch, initialDocument]);

  useEffect(() => {
    const node = canvasWrapRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      setStageSize({
        w: Math.max(Math.floor(rect.width), 280),
        h: Math.max(Math.floor(rect.height), 240),
      });
      setCanvasRect(rect);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (editingTextId && canvasWrapRef.current) {
      setCanvasRect(canvasWrapRef.current.getBoundingClientRect());
    }
  }, [editingTextId, state.viewport]);

  const handleDropShape = useCallback(
    (tool: ToolMode, x: number, y: number) => {
      const el = createElementAt(tool, x, y, {
        fill: state.fillColor,
        stroke: state.strokeColor,
        strokeWidth: state.strokeWidth,
      });
      if (el) {
        dispatch({ type: 'ADD_ELEMENT', element: el });
        dispatch({ type: 'SELECT', ids: [el.id], mode: 'replace' });
        dispatch({ type: 'SET_TOOL', tool: 'select' });
      }
    },
    [state.fillColor, state.strokeColor, state.strokeWidth, dispatch],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        dispatch({ type: 'DELETE_SELECTED' });
      }
      if (e.key === 'Escape') {
        if (editingTextId) {
          setEditingTextId(null);
          return;
        }
        dispatch({ type: 'SELECT', ids: [] });
        dispatch({ type: 'SET_TOOL', tool: 'select' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, editingTextId]);

  const handleExportImage = useCallback(
    async (format: 'png' | 'jpeg') => {
      const stage = stageRef.current;
      if (!stage) return;
      const dataUrl = await exportStageImage(stage, format === 'jpeg' ? 'jpeg' : 'png');
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const safeName = state.docName.replace(/[^\wа-яА-ЯёЁ\s-]/gi, '').trim() || 'schema';
      downloadDataUrl(dataUrl, `${safeName}.${ext}`);
    },
    [state.docName],
  );

  const handleExportPdf = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;
    await exportStagePdf(stage);
  }, []);

  const handleExportJson = useCallback(() => {
    const doc = toDocument();
    const safeName = state.docName.replace(/[^\wа-яА-ЯёЁ\s-]/gi, '').trim() || 'schema';
    downloadJson(doc, `${safeName}.json`);
  }, [toDocument, state.docName]);

  const handleImportJson = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string) as SchemaDocument;
          if (!parsed.elements || !Array.isArray(parsed.elements)) {
            throw new Error('Invalid schema');
          }
          dispatch({
            type: 'LOAD_DOCUMENT',
            doc: {
              version: 1,
              name: parsed.name ?? 'Импорт',
              viewport: parsed.viewport ?? { scale: 1, x: 0, y: 0 },
              elements: parsed.elements,
              createdAt: parsed.createdAt ?? new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
        } catch {
          alert('Не удалось прочитать файл. Проверьте формат JSON Schema Maker.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [dispatch],
  );

  return (
    <div className="schema-maker-root">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={onFileChange}
      />
      <div className="app" style={{ height }}>
        <Toolbar
          docName={state.docName}
          onDocNameChange={(name) => dispatch({ type: 'SET_DOC_NAME', name })}
          onExportPng={() => handleExportImage('png')}
          onExportJpg={() => handleExportImage('jpeg')}
          onExportPdf={handleExportPdf}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          selectionCount={state.selectedIds.length}
          onDelete={() => dispatch({ type: 'DELETE_SELECTED' })}
          onZoomIn={() =>
            dispatch({
              type: 'SET_VIEWPORT',
              viewport: {
                scale: Math.min(state.viewport.scale * 1.15, 3),
              },
            })
          }
          onZoomOut={() =>
            dispatch({
              type: 'SET_VIEWPORT',
              viewport: {
                scale: Math.max(state.viewport.scale / 1.15, 0.2),
              },
            })
          }
          onZoomReset={() =>
            dispatch({
              type: 'SET_VIEWPORT',
              viewport: { scale: 1, x: 0, y: 0 },
            })
          }
          zoom={state.viewport.scale}
        />
        <div className="app-body">
          <ShapePalette
            activeTool={state.tool}
            onToolChange={(tool) => dispatch({ type: 'SET_TOOL', tool })}
          />
          <main className={`app-main tool-${state.tool}`}>
            {state.tool === 'connector' && (
              <div className="canvas-hint">
                Потяните от точки на фигуре к другой фигуре
              </div>
            )}
            {state.tool === 'select' && (
              <div className="canvas-hint canvas-hint-subtle">
                Рамкой — выделение · Shift+клик — несколько · углы — размер и поворот
              </div>
            )}
            <div className="canvas-container" ref={canvasWrapRef}>
              <SchemaCanvas
                elements={state.elements}
                selectedIds={state.selectedIds}
                tool={state.tool}
                viewport={state.viewport}
                strokeColor={state.strokeColor}
                fillColor={state.fillColor}
                strokeWidth={state.strokeWidth}
                stageRef={stageRef}
                stageWidth={stageSize.w}
                stageHeight={stageSize.h}
                onSelect={(ids, mode) =>
                  dispatch({ type: 'SELECT', ids, mode: mode ?? 'replace' })
                }
                onDropShape={handleDropShape}
                onAdd={(el) => dispatch({ type: 'ADD_ELEMENT', element: el })}
                onUpdate={(id, patch) =>
                  dispatch({ type: 'UPDATE_ELEMENT', id, patch })
                }
                onViewport={(v) => dispatch({ type: 'SET_VIEWPORT', viewport: v })}
                onElementsReplace={(elements) =>
                  dispatch({ type: 'SET_ELEMENTS', elements })
                }
                onEditText={(id) => {
                  if (canvasWrapRef.current) {
                    setCanvasRect(canvasWrapRef.current.getBoundingClientRect());
                  }
                  setEditingTextId(id);
                }}
              />
              {editingElement && canvasRect && (
                <TextEditorOverlay
                  element={editingElement}
                  viewport={state.viewport}
                  canvasRect={canvasRect}
                  onSave={(text) => {
                    dispatch({
                      type: 'UPDATE_ELEMENT',
                      id: editingElement.id,
                      patch: { text },
                    });
                    setEditingTextId(null);
                  }}
                  onClose={() => setEditingTextId(null)}
                />
              )}
            </div>
          </main>
          <PropertiesPanel
            selected={selected}
            selectionCount={state.selectedIds.length}
            strokeColor={state.strokeColor}
            fillColor={state.fillColor}
            strokeWidth={state.strokeWidth}
            onStrokeColor={(stroke) => dispatch({ type: 'SET_COLORS', stroke })}
            onFillColor={(fill) => dispatch({ type: 'SET_COLORS', fill })}
            onStrokeWidth={(width) =>
              dispatch({ type: 'SET_STROKE_WIDTH', width })
            }
            onUpdateSelected={(patch) => {
              if (state.selectedIds[0]) {
                dispatch({
                  type: 'UPDATE_ELEMENT',
                  id: state.selectedIds[0],
                  patch,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
