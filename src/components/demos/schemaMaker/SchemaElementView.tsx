import { useRef } from 'react';
import { Group, Line, Rect, Circle, RegularPolygon, Text, Arrow } from 'react-konva';
import type Konva from 'konva';
import type { SchemaElement } from './types/schema';
import { getElementBounds } from './utils/bounds';
import { getAnchors } from './utils/anchors';

interface Props {
  element: SchemaElement;
  listening: boolean;
  isSelected: boolean;
  canTransform: boolean;
  showAnchors: boolean;
  onSelect: (id: string, shiftKey: boolean) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onTransformEnd: (id: string, patch: Partial<SchemaElement>) => void;
  onEditText?: (id: string) => void;
  onAnchorDragStart?: (
    elId: string,
    anchorIndex: number,
    worldX: number,
    worldY: number,
  ) => void;
}

export function SchemaElementView({
  element: el,
  listening,
  isSelected,
  canTransform,
  showAnchors,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onEditText,
  onAnchorDragStart,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);

  const isTextLike =
    el.type === 'text' || el.type === 'comment' || Boolean(el.text);

  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    const shift = 'shiftKey' in e.evt ? e.evt.shiftKey : false;
    onSelect(el.id, shift);
  };

  const handleDblClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    if (isTextLike) onEditText?.(el.id);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    onDragEnd(el.id, node.x(), node.y());
  };

  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    node.scaleX(1);
    node.scaleY(1);

    if (el.type === 'line' || el.type === 'arrow') {
      const pts = el.points ?? [0, 0, 100, 0];
      const scaled = pts.map((v, i) => (i % 2 === 0 ? v * scaleX : v * scaleY));
      onTransformEnd(el.id, {
        x: node.x(),
        y: node.y(),
        rotation,
        points: scaled,
      });
      return;
    }

    if (el.type === 'pen' && el.points) {
      const scaled = el.points.map((v, i) =>
        i % 2 === 0 ? v * scaleX : v * scaleY,
      );
      onTransformEnd(el.id, {
        x: node.x(),
        y: node.y(),
        rotation,
        points: scaled,
      });
      return;
    }

    onTransformEnd(el.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(20, (el.width ?? 120) * scaleX),
      height: Math.max(20, (el.height ?? 80) * scaleY),
      rotation,
    });
  };

  const groupProps = {
    ref: groupRef,
    id: `node-${el.id}`,
    x: el.x,
    y: el.y,
    rotation: el.rotation ?? 0,
    listening,
    draggable: canTransform && listening,
    onClick: handleSelect,
    onTap: handleSelect,
    onDblClick: handleDblClick,
    onDragEnd: handleDragEnd,
    onTransformEnd: canTransform ? handleTransformEnd : undefined,
  };

  if (el.type === 'pen' && el.points) {
    const bounds = getElementBounds(el);
    const localPts = el.points;
    return (
      <Group {...groupProps}>
        <Rect
          x={bounds.x - el.x}
          y={bounds.y - el.y}
          width={bounds.width}
          height={bounds.height}
          fill="transparent"
          listening={listening}
        />
        <Line
          points={localPts}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          lineCap="round"
          lineJoin="round"
          tension={0.4}
          listening={false}
        />
      </Group>
    );
  }

  if (el.type === 'line' || el.type === 'arrow') {
    const pts = el.points ?? [0, 0, 100, 0];
    const pad = 12;
    const minX = Math.min(pts[0], pts[2]) - pad;
    const minY = Math.min(pts[1], pts[3]) - pad;
    const maxX = Math.max(pts[0], pts[2]) + pad;
    const maxY = Math.max(pts[1], pts[3]) + pad;
    return (
      <Group {...groupProps}>
        <Rect
          x={minX}
          y={minY}
          width={maxX - minX}
          height={maxY - minY}
          fill="transparent"
          listening={listening}
        />
        {el.type === 'arrow' ? (
          <Arrow
            points={pts}
            stroke={el.stroke}
            fill={el.stroke}
            strokeWidth={el.strokeWidth}
            pointerLength={10}
            pointerWidth={10}
            listening={false}
          />
        ) : (
          <Line
            points={pts}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            lineCap="round"
            listening={false}
          />
        )}
      </Group>
    );
  }

  if (el.type === 'circle') {
    const r = Math.min(el.width ?? 80, el.height ?? 80) / 2;
    return (
      <Group {...groupProps}>
        <Circle
          x={r}
          y={r}
          radius={r}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          shadowColor="rgba(61,61,72,0.08)"
          shadowBlur={isSelected ? 8 : 4}
          shadowOffsetY={2}
        />
        {el.text && (
          <Text
            text={el.text}
            width={r * 2}
            height={r * 2}
            align="center"
            verticalAlign="middle"
            fontSize={el.fontSize ?? 14}
            fill={el.stroke}
            listening={false}
          />
        )}
        {showAnchors && listening && (
          <AnchorPorts el={el} onAnchorDragStart={onAnchorDragStart} />
        )}
      </Group>
    );
  }

  if (el.type === 'diamond') {
    const w = el.width ?? 100;
    const h = el.height ?? 80;
    return (
      <Group {...groupProps}>
        <RegularPolygon
          x={w / 2}
          y={h / 2}
          sides={4}
          radius={Math.min(w, h) / 2}
          rotation={45}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          shadowColor="rgba(61,61,72,0.08)"
          shadowBlur={isSelected ? 8 : 4}
          shadowOffsetY={2}
        />
        {el.text && (
          <Text
            text={el.text}
            width={w}
            height={h}
            align="center"
            verticalAlign="middle"
            fontSize={el.fontSize ?? 14}
            fill={el.stroke}
            listening={false}
          />
        )}
        {showAnchors && listening && (
          <AnchorPorts el={el} onAnchorDragStart={onAnchorDragStart} />
        )}
      </Group>
    );
  }

  if (el.type === 'triangle') {
    const w = el.width ?? 100;
    const h = el.height ?? 80;
    return (
      <Group {...groupProps}>
        <RegularPolygon
          x={w / 2}
          y={h / 2}
          sides={3}
          radius={Math.min(w, h) / 2}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          shadowColor="rgba(61,61,72,0.08)"
          shadowBlur={isSelected ? 8 : 4}
          shadowOffsetY={2}
        />
        {el.text && (
          <Text
            text={el.text}
            width={w}
            height={h}
            align="center"
            verticalAlign="middle"
            fontSize={el.fontSize ?? 14}
            fill={el.stroke}
            listening={false}
          />
        )}
        {showAnchors && listening && (
          <AnchorPorts el={el} onAnchorDragStart={onAnchorDragStart} />
        )}
      </Group>
    );
  }

  const w = el.width ?? 120;
  const h = el.height ?? 80;
  const isComment = el.type === 'comment';
  const isTextOnly = el.type === 'text';
  const showBorder = !isTextOnly || el.strokeWidth > 0;

  return (
    <Group {...groupProps}>
      {showBorder && (
        <Rect
          width={w}
          height={h}
          fill={isComment ? '#faf6e8' : isTextOnly ? el.fill : el.fill}
          stroke={isComment ? '#d4c4a8' : el.stroke}
          strokeWidth={isTextOnly ? el.strokeWidth : el.strokeWidth}
          cornerRadius={el.cornerRadius ?? (el.type === 'roundedRect' ? 12 : 0)}
          dash={isComment ? [6, 4] : undefined}
          shadowColor="rgba(61,61,72,0.08)"
          shadowBlur={isSelected ? 8 : 4}
          shadowOffsetY={2}
        />
      )}
      {isTextOnly && !showBorder && (
        <Rect
          width={w}
          height={h}
          fill={el.fill === 'transparent' ? 'rgba(255,255,255,0.01)' : el.fill}
          strokeWidth={0}
          listening={listening}
        />
      )}
      {isComment && showBorder && (
        <Rect
          x={8}
          y={-6}
          width={24}
          height={12}
          fill="#faf6e8"
          stroke="#d4c4a8"
          strokeWidth={1}
          cornerRadius={2}
          listening={false}
        />
      )}
      {(el.text || el.type === 'text') && (
        <Text
          text={el.text ?? ''}
          x={isTextOnly && !showBorder ? 0 : 12}
          y={isTextOnly && !showBorder ? 0 : 12}
          width={isTextOnly && !showBorder ? w : w - 24}
          height={isTextOnly && !showBorder ? h : h - 24}
          fontSize={el.fontSize ?? 14}
          fill={el.stroke}
          fontStyle={el.type === 'text' ? '500' : 'normal'}
          wrap="word"
          listening={false}
        />
      )}
      {showAnchors && listening && (
        <AnchorPorts el={el} onAnchorDragStart={onAnchorDragStart} />
      )}
    </Group>
  );
}

function AnchorPorts({
  el,
  onAnchorDragStart,
}: {
  el: SchemaElement;
  onAnchorDragStart?: (
    elId: string,
    anchorIndex: number,
    worldX: number,
    worldY: number,
  ) => void;
}) {
  const anchors = getAnchors(el);
  return (
    <>
      {anchors.map((p, i) => {
        const localX = p.x - el.x;
        const localY = p.y - el.y;
        return (
          <Circle
            key={i}
            x={localX}
            y={localY}
            radius={7}
            fill="#ffffff"
            stroke="#8b9dc3"
            strokeWidth={2}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              onAnchorDragStart?.(el.id, i, p.x, p.y);
            }}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              if (stage) stage.container().style.cursor = 'crosshair';
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage) stage.container().style.cursor = '';
            }}
          />
        );
      })}
    </>
  );
}
