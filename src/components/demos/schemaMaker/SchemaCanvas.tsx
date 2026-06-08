import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Transformer, Arrow } from 'react-konva';
import type Konva from 'konva';
import { v4 as uuid } from 'uuid';
import { SchemaElementView } from './SchemaElementView';
import type { SchemaElement, ToolMode, Viewport, AnchorIndex } from './types/schema';
import { getAnchorPoint, nearestAnchor } from './utils/anchors';
import { findElementsInRect, getElementBounds } from './utils/bounds';
import { eraseAtPoint } from './utils/eraser';
import { isShapeTool } from './utils/createElement';
import { elementsAreInteractive } from './utils/tools';

interface Props {
  elements: SchemaElement[];
  selectedIds: string[];
  tool: ToolMode;
  viewport: Viewport;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  stageRef: React.RefObject<Konva.Stage | null>;
  stageWidth: number;
  stageHeight: number;
  onSelect: (ids: string[], mode?: 'replace' | 'add' | 'toggle') => void;
  onAdd: (el: SchemaElement) => void;
  onUpdate: (id: string, patch: Partial<SchemaElement>) => void;
  onViewport: (v: Partial<Viewport>) => void;
  onElementsReplace: (els: SchemaElement[]) => void;
  onDropShape?: (tool: ToolMode, x: number, y: number) => void;
  onEditText?: (id: string) => void;
}

const GRID = 24;
const STAGE_W = 4000;
const STAGE_H = 3000;
const ERASER_RADIUS = 14;

type ConnectDrag = {
  fromId: string;
  fromAnchor: AnchorIndex;
  points: number[];
};

type SelectionDrag = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export function SchemaCanvas({
  elements,
  selectedIds,
  tool,
  viewport,
  strokeColor,
  fillColor,
  strokeWidth,
  stageRef,
  stageWidth,
  stageHeight,
  onSelect,
  onAdd,
  onUpdate,
  onViewport,
  onElementsReplace,
  onDropShape,
  onEditText,
}: Props) {
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [drawing, setDrawing] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    points?: number[];
  } | null>(null);
  const [connectDrag, setConnectDrag] = useState<ConnectDrag | null>(null);
  const [selectionDrag, setSelectionDrag] = useState<SelectionDrag | null>(null);
  const isPanning = useRef(false);
  const isErasing = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });
  const shiftHeld = useRef(false);
  const interactive = elementsAreInteractive(tool);

  const screenToWorld = useCallback(
    (sx: number, sy: number) => ({
      x: (sx - viewport.x) / viewport.scale,
      y: (sy - viewport.y) / viewport.scale,
    }),
    [viewport],
  );

  const getWorldPointer = useCallback(() => {
    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    if (!pos) return null;
    return screenToWorld(pos.x, pos.y);
  }, [screenToWorld, stageRef]);

  const resolvedElements = elements.map((el) => {
    if (el.type !== 'connector' || !el.fromId || !el.toId) return el;
    const from = elements.find((e) => e.id === el.fromId);
    const to = elements.find((e) => e.id === el.toId);
    if (!from || !to) return el;
    const p1 = getAnchorPoint(from, el.fromAnchor ?? 1);
    const p2 = getAnchorPoint(to, el.toAnchor ?? 5);
    const mx = (p1.x + p2.x) / 2;
    return {
      ...el,
      points: [p1.x, p1.y, mx, p1.y, mx, p2.y, p2.x, p2.y],
    };
  });

  const canTransform =
    tool === 'select' &&
    selectedIds.length > 0 &&
    selectedIds.every((id) => {
      const el = elements.find((e) => e.id === id);
      return el && el.type !== 'connector';
    });

  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    if (!canTransform) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }
    const nodes = selectedIds
      .map((id) => stage.findOne(`#node-${id}`))
      .filter(Boolean) as Konva.Node[];
    tr.nodes(nodes);
    tr.getLayer()?.batchDraw();
  }, [selectedIds, elements, stageRef, canTransform]);

  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    const setRotateCursor = (on: boolean) => {
      stage.container().style.cursor = on ? 'grab' : defaultCursor();
    };

    const onMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target?.name?.() === 'rotater') setRotateCursor(true);
    };
    const onMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target?.name?.() === 'rotater') setRotateCursor(false);
    };
    const onTransformStart = (e: Konva.KonvaEventObject<Event>) => {
      if (e.target?.name?.() === 'rotater') {
        stage.container().style.cursor = 'grabbing';
      }
    };
    const onTransformEndCursor = () => {
      stage.container().style.cursor = defaultCursor();
    };

    tr.on('mouseover', onMouseOver);
    tr.on('mouseout', onMouseOut);
    tr.on('transformstart', onTransformStart);
    tr.on('transformend', onTransformEndCursor);

    return () => {
      tr.off('mouseover', onMouseOver);
      tr.off('mouseout', onMouseOut);
      tr.off('transformstart', onTransformStart);
      tr.off('transformend', onTransformEndCursor);
    };
  }, [tool, stageRef]);

  const defaultCursor = () => {
    if (tool === 'pan') return 'grab';
    if (tool === 'eraser') return 'cell';
    if (tool === 'select') return 'default';
    if (tool === 'connector') return 'crosshair';
    return 'crosshair';
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = viewport.scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const scaleBy = 1.08;
    const newScale =
      e.evt.deltaY < 0
        ? Math.min(oldScale * scaleBy, 3)
        : Math.max(oldScale / scaleBy, 0.2);
    const mousePointTo = {
      x: (pointer.x - viewport.x) / oldScale,
      y: (pointer.y - viewport.y) / oldScale,
    };
    onViewport({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const finishShape = useCallback(
    (el: SchemaElement) => {
      onAdd(el);
      setDrawing(null);
      onSelect([el.id], 'replace');
    },
    [onAdd, onSelect],
  );

  const findShapeAtPoint = (wx: number, wy: number): SchemaElement | undefined => {
    const connectable = elements.filter(
      (e) =>
        e.type !== 'connector' &&
        e.type !== 'pen' &&
        e.type !== 'line' &&
        e.type !== 'arrow',
    );
    for (let i = connectable.length - 1; i >= 0; i--) {
      const el = connectable[i];
      const b = getElementBounds(el);
      if (
        wx >= b.x &&
        wx <= b.x + b.width &&
        wy >= b.y &&
        wy <= b.y + b.height
      ) {
        return el;
      }
    }
    return undefined;
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    shiftHeld.current = e.evt.shiftKey;
    const stage = stageRef.current;
    if (!stage) return;
    const clickedOnEmpty =
      e.target === stage || e.target.name() === 'background-grid';

    if (tool === 'pan' || e.evt.button === 1) {
      isPanning.current = true;
      lastPan.current = { x: e.evt.clientX, y: e.evt.clientY };
      return;
    }

    const world = getWorldPointer();
    if (!world) return;

    if (tool === 'eraser') {
      isErasing.current = true;
      onElementsReplace(eraseAtPoint(elements, world.x, world.y, ERASER_RADIUS));
      return;
    }

    if (tool === 'select' && clickedOnEmpty) {
      setSelectionDrag({
        startX: world.x,
        startY: world.y,
        endX: world.x,
        endY: world.y,
      });
      return;
    }

    if (tool === 'connector' && clickedOnEmpty) return;

    if (tool === 'pen') {
      setDrawing({
        startX: world.x,
        startY: world.y,
        endX: world.x,
        endY: world.y,
        points: [0, 0],
      });
      return;
    }

    if (isShapeTool(tool)) {
      setDrawing({
        startX: world.x,
        startY: world.y,
        endX: world.x,
        endY: world.y,
      });
      return;
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning.current) {
      const dx = e.evt.clientX - lastPan.current.x;
      const dy = e.evt.clientY - lastPan.current.y;
      lastPan.current = { x: e.evt.clientX, y: e.evt.clientY };
      onViewport({ x: viewport.x + dx, y: viewport.y + dy });
      return;
    }

    const world = getWorldPointer();
    if (!world) return;

    if (isErasing.current && tool === 'eraser') {
      onElementsReplace(eraseAtPoint(elements, world.x, world.y, ERASER_RADIUS));
      return;
    }

    if (connectDrag) {
      const start = getAnchorPoint(
        elements.find((el) => el.id === connectDrag.fromId)!,
        connectDrag.fromAnchor,
      );
      setConnectDrag({
        ...connectDrag,
        points: [start.x, start.y, world.x, world.y],
      });
      return;
    }

    if (selectionDrag) {
      setSelectionDrag({ ...selectionDrag, endX: world.x, endY: world.y });
      return;
    }

    if (!drawing) return;

    if (tool === 'pen' && drawing.points) {
      const lx = world.x - drawing.startX;
      const ly = world.y - drawing.startY;
      setDrawing({
        ...drawing,
        endX: world.x,
        endY: world.y,
        points: [...drawing.points, lx, ly],
      });
      return;
    }

    setDrawing({ ...drawing, endX: world.x, endY: world.y });
  };

  const handleStageMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      return;
    }

    if (isErasing.current) {
      isErasing.current = false;
      return;
    }

    if (connectDrag) {
      const world = getWorldPointer();
      if (world) {
        const target = findShapeAtPoint(world.x, world.y);
        if (target && target.id !== connectDrag.fromId) {
          const { index } = nearestAnchor(target, world);
          onAdd({
            id: uuid(),
            type: 'connector',
            x: 0,
            y: 0,
            fromId: connectDrag.fromId,
            toId: target.id,
            fromAnchor: connectDrag.fromAnchor,
            toAnchor: index,
            fill: 'transparent',
            stroke: strokeColor,
            strokeWidth,
          });
        }
      }
      setConnectDrag(null);
      return;
    }

    if (selectionDrag) {
      const x = Math.min(selectionDrag.startX, selectionDrag.endX);
      const y = Math.min(selectionDrag.startY, selectionDrag.endY);
      const w = Math.abs(selectionDrag.endX - selectionDrag.startX);
      const h = Math.abs(selectionDrag.endY - selectionDrag.startY);
      if (w > 4 || h > 4) {
        const ids = findElementsInRect(elements, { x, y, width: w, height: h });
        onSelect(ids, shiftHeld.current ? 'add' : 'replace');
      } else if (!shiftHeld.current) {
        onSelect([], 'replace');
      }
      setSelectionDrag(null);
      return;
    }

    if (!drawing) return;

    const { startX, startY, endX, endY, points } = drawing;
    const w = Math.abs(endX - startX) || 1;
    const h = Math.abs(endY - startY) || 1;
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);

    if (tool === 'pen' && points && points.length > 2) {
      finishShape({
        id: uuid(),
        type: 'pen',
        x: startX,
        y: startY,
        points,
        fill: 'transparent',
        stroke: strokeColor,
        strokeWidth,
      });
      return;
    }

    const lineLen = Math.hypot(endX - startX, endY - startY);
    const minSize = 8;
    if (tool === 'line' || tool === 'arrow') {
      if (lineLen < minSize) {
        setDrawing(null);
        return;
      }
    } else if (w < minSize && h < minSize && tool !== 'text') {
      setDrawing(null);
      return;
    }

    const base = { fill: fillColor, stroke: strokeColor, strokeWidth };

    switch (tool) {
      case 'rectangle':
        finishShape({ id: uuid(), type: 'rectangle', x, y, width: w, height: h, ...base });
        break;
      case 'roundedRect':
        finishShape({
          id: uuid(),
          type: 'roundedRect',
          x,
          y,
          width: w,
          height: h,
          cornerRadius: 12,
          ...base,
        });
        break;
      case 'circle':
        finishShape({
          id: uuid(),
          type: 'circle',
          x,
          y,
          width: Math.max(w, h),
          height: Math.max(w, h),
          ...base,
        });
        break;
      case 'diamond':
        finishShape({ id: uuid(), type: 'diamond', x, y, width: w, height: h, ...base });
        break;
      case 'triangle':
        finishShape({ id: uuid(), type: 'triangle', x, y, width: w, height: h, ...base });
        break;
      case 'line':
        finishShape({
          id: uuid(),
          type: 'line',
          x: startX,
          y: startY,
          points: [0, 0, endX - startX, endY - startY],
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth,
        });
        break;
      case 'arrow':
        finishShape({
          id: uuid(),
          type: 'arrow',
          x: startX,
          y: startY,
          points: [0, 0, endX - startX, endY - startY],
          fill: strokeColor,
          stroke: strokeColor,
          strokeWidth,
        });
        break;
      case 'text':
        finishShape({
          id: uuid(),
          type: 'text',
          x,
          y,
          width: Math.max(w, 120),
          height: Math.max(h, 40),
          text: 'Подпись',
          fontSize: 18,
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: 0,
        });
        break;
      case 'comment':
        finishShape({
          id: uuid(),
          type: 'comment',
          x,
          y,
          width: Math.max(w, 180),
          height: Math.max(h, 90),
          text: 'Комментарий…',
          cornerRadius: 8,
          fill: '#faf6e8',
          stroke: '#d4c4a8',
          strokeWidth: 1.5,
        });
        break;
      default:
        setDrawing(null);
    }
  };

  const handleElementSelect = (id: string, shiftKey: boolean) => {
    if (tool === 'connector') return;
    if (tool !== 'select') return;
    onSelect([id], shiftKey ? 'toggle' : 'replace');
  };

  const handleAnchorDragStart = (
    elId: string,
    anchorIndex: number,
    worldX: number,
    worldY: number,
  ) => {
    setConnectDrag({
      fromId: elId,
      fromAnchor: anchorIndex as AnchorIndex,
      points: [worldX, worldY, worldX, worldY],
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const toolName = e.dataTransfer.getData('application/schema-maker-tool') as ToolMode;
    if (!toolName || !isShapeTool(toolName)) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x, y } = screenToWorld(sx, sy);
    onDropShape?.(toolName, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const previewLine =
    drawing && (tool === 'line' || tool === 'arrow')
      ? {
          x: drawing.startX,
          y: drawing.startY,
          points: [0, 0, drawing.endX - drawing.startX, drawing.endY - drawing.startY],
        }
      : null;

  const previewRect =
    drawing && !['pen', 'line', 'arrow'].includes(tool)
      ? {
          x: Math.min(drawing.startX, drawing.endX),
          y: Math.min(drawing.startY, drawing.endY),
          w: Math.abs(drawing.endX - drawing.startX),
          h: Math.abs(drawing.endY - drawing.startY),
        }
      : null;

  const selectionRect = selectionDrag
    ? {
        x: Math.min(selectionDrag.startX, selectionDrag.endX),
        y: Math.min(selectionDrag.startY, selectionDrag.endY),
        w: Math.abs(selectionDrag.endX - selectionDrag.startX),
        h: Math.abs(selectionDrag.endY - selectionDrag.startY),
      }
    : null;

  const isConnectable = (type: SchemaElement['type']) =>
    !['pen', 'connector', 'line', 'arrow'].includes(type);

  return (
    <div
      className="canvas-wrap"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        x={viewport.x}
        y={viewport.y}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onMouseLeave={handleStageMouseUp}
        style={{ cursor: defaultCursor() }}
      >
        <Layer ref={layerRef}>
          <GridBackground />
          {resolvedElements
            .filter((el) => el.type === 'connector')
            .map((el) => (
              <Line
                key={el.id}
                id={`node-${el.id}`}
                points={el.points}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth}
                lineCap="round"
                lineJoin="round"
                bezier
                hitStrokeWidth={14}
                listening={interactive}
                onClick={(ev) => {
                  ev.cancelBubble = true;
                  if (tool === 'select') {
                    onSelect(
                      [el.id],
                      ev.evt.shiftKey ? 'toggle' : 'replace',
                    );
                  }
                }}
              />
            ))}
          {resolvedElements
            .filter((el) => el.type !== 'connector')
            .map((el) => (
              <SchemaElementView
                key={el.id}
                element={el}
                listening={interactive}
                isSelected={selectedIds.includes(el.id)}
                canTransform={tool === 'select' && selectedIds.includes(el.id)}
                showAnchors={
                  (tool === 'connector' && isConnectable(el.type)) ||
                  (tool === 'select' &&
                    selectedIds.includes(el.id) &&
                    isConnectable(el.type))
                }
                onSelect={handleElementSelect}
                onDragEnd={(id, nx, ny) => onUpdate(id, { x: nx, y: ny })}
                onTransformEnd={(id, patch) => onUpdate(id, patch)}
                onEditText={onEditText}
                onAnchorDragStart={
                  tool === 'connector' || tool === 'select'
                    ? handleAnchorDragStart
                    : undefined
                }
              />
            ))}
          {connectDrag && (
            <Line
              points={connectDrag.points}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              dash={[8, 6]}
              lineCap="round"
              listening={false}
            />
          )}
          {drawing && tool === 'pen' && drawing.points && (
            <Line
              points={drawing.points}
              x={drawing.startX}
              y={drawing.startY}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              lineCap="round"
              lineJoin="round"
              tension={0.4}
              listening={false}
            />
          )}
          {previewLine && (
            tool === 'arrow' ? (
              <Arrow
                x={previewLine.x}
                y={previewLine.y}
                points={previewLine.points}
                stroke={strokeColor}
                fill={strokeColor}
                strokeWidth={strokeWidth}
                pointerLength={10}
                pointerWidth={10}
                listening={false}
              />
            ) : (
              <Line
                x={previewLine.x}
                y={previewLine.y}
                points={previewLine.points}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                lineCap="round"
                listening={false}
              />
            )
          )}
          {previewRect && (
            <Rect
              x={previewRect.x}
              y={previewRect.y}
              width={previewRect.w}
              height={previewRect.h}
              stroke={strokeColor}
              strokeWidth={1}
              dash={[6, 4]}
              fill={fillColor}
              opacity={0.5}
              listening={false}
            />
          )}
          {selectionRect && (
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.w}
              height={selectionRect.h}
              stroke="#8b9dc3"
              strokeWidth={1.5}
              dash={[4, 4]}
              fill="rgba(139, 157, 195, 0.12)"
              listening={false}
            />
          )}
          {canTransform && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 16 || newBox.height < 16 ? oldBox : newBox
              }
              borderStroke="#8b9dc3"
              anchorStroke="#8b9dc3"
              anchorFill="#ffffff"
              anchorSize={8}
              rotateEnabled
              enabledAnchors={
                selectedIds.length === 1 &&
                ['line', 'arrow'].includes(
                  elements.find((e) => e.id === selectedIds[0])?.type ?? '',
                )
                  ? ['middle-left', 'middle-right']
                  : undefined
              }
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

function GridBackground() {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < STAGE_W / GRID; i++) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i * GRID, 0, i * GRID, STAGE_H]}
        stroke="#ebe8e3"
        strokeWidth={0.5}
        listening={false}
        name="background-grid"
      />,
    );
  }
  for (let j = 0; j < STAGE_H / GRID; j++) {
    lines.push(
      <Line
        key={`h${j}`}
        points={[0, j * GRID, STAGE_W, j * GRID]}
        stroke="#ebe8e3"
        strokeWidth={0.5}
        listening={false}
        name="background-grid"
      />,
    );
  }
  return (
    <>
      <Rect
        name="background-grid"
        x={0}
        y={0}
        width={STAGE_W}
        height={STAGE_H}
        fill="#fffcf8"
        listening
      />
      {lines}
    </>
  );
}
