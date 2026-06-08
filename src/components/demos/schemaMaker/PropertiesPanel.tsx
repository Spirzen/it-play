import { PALETTE, STROKE_COLORS } from './types/schema';
import type { SchemaElement } from './types/schema';
import './PropertiesPanel.css';

interface Props {
  selected: SchemaElement | null;
  selectionCount: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  onStrokeColor: (c: string) => void;
  onFillColor: (c: string) => void;
  onStrokeWidth: (w: number) => void;
  onUpdateSelected: (patch: Partial<SchemaElement>) => void;
}

export function PropertiesPanel({
  selected,
  selectionCount,
  strokeColor,
  fillColor,
  strokeWidth,
  onStrokeColor,
  onFillColor,
  onStrokeWidth,
  onUpdateSelected,
}: Props) {
  const canFill =
    selected &&
    !['line', 'arrow', 'connector', 'pen'].includes(selected.type);

  return (
    <aside className="properties">
      <h3 className="properties-title">Свойства</h3>

      {selectionCount > 1 ? (
        <p className="properties-empty">
          Выбрано элементов: {selectionCount}. Редактирование по одному.
        </p>
      ) : selected ? (
        <div className="properties-section">
          <label className="properties-label">Тип</label>
          <span className="properties-type">{labelForType(selected.type)}</span>

          {(selected.type === 'text' ||
            selected.type === 'comment' ||
            selected.text !== undefined) && (
            <>
              <label className="properties-label" htmlFor="prop-text">
                Текст
              </label>
              <textarea
                id="prop-text"
                className="properties-textarea"
                value={selected.text ?? ''}
                onChange={(e) => onUpdateSelected({ text: e.target.value })}
                rows={3}
              />
              <label className="properties-label" htmlFor="font-size">
                Размер шрифта: {selected.fontSize ?? 14}px
              </label>
              <input
                id="font-size"
                type="range"
                min={8}
                max={72}
                value={selected.fontSize ?? 14}
                onChange={(e) =>
                  onUpdateSelected({ fontSize: Number(e.target.value) })
                }
                className="properties-range"
              />
            </>
          )}

          {selected.width !== undefined && (
            <>
              <label className="properties-label">Размер</label>
              <div className="properties-row">
                <input
                  type="number"
                  className="properties-input"
                  value={Math.round(selected.width)}
                  min={20}
                  onChange={(e) =>
                    onUpdateSelected({ width: Number(e.target.value) })
                  }
                />
                <span>×</span>
                <input
                  type="number"
                  className="properties-input"
                  value={Math.round(selected.height ?? 80)}
                  min={20}
                  onChange={(e) =>
                    onUpdateSelected({ height: Number(e.target.value) })
                  }
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="properties-empty">Выберите элемент на холсте</p>
      )}

      <div className="properties-section">
        <label className="properties-label">Обводка</label>
        <ColorSwatches
          colors={STROKE_COLORS}
          active={selected ? selected.stroke : strokeColor}
          onPick={(c) => {
            onStrokeColor(c);
            if (selected) onUpdateSelected({ stroke: c });
          }}
        />
        <label className="properties-label" htmlFor="stroke-width">
          Толщина границы: {selected?.strokeWidth ?? strokeWidth}px
          {selected?.type === 'text' && (selected.strokeWidth ?? 0) === 0 && (
            <span className="properties-note"> — без рамки</span>
          )}
        </label>
        <input
          id="stroke-width"
          type="range"
          min={selected?.type === 'text' ? 0 : 1}
          max={12}
          value={selected?.strokeWidth ?? strokeWidth}
          onChange={(e) => {
            const w = Number(e.target.value);
            onStrokeWidth(w);
            if (selected) onUpdateSelected({ strokeWidth: w });
          }}
          className="properties-range"
        />
      </div>

      {(canFill || !selected) && (
        <div className="properties-section">
          <label className="properties-label">Заливка</label>
          <ColorSwatches
            colors={PALETTE}
            active={selected ? selected.fill : fillColor}
            onPick={(c) => {
              onFillColor(c);
              if (selected) onUpdateSelected({ fill: c });
            }}
          />
        </div>
      )}

      {!selected && (
        <p className="properties-hint">
          Новые фигуры используют цвета ниже. После создания можно изменить выбранный
          элемент.
        </p>
      )}
    </aside>
  );
}

function ColorSwatches({
  colors,
  active,
  onPick,
}: {
  colors: readonly string[];
  active: string;
  onPick: (c: string) => void;
}) {
  return (
    <div className="color-swatches">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          className={`color-swatch ${active === c ? 'active' : ''}`}
          style={{ background: c }}
          title={c}
          onClick={() => onPick(c)}
        />
      ))}
    </div>
  );
}

function labelForType(type: SchemaElement['type']): string {
  const map: Record<SchemaElement['type'], string> = {
    rectangle: 'Прямоугольник',
    roundedRect: 'Скруглённый',
    circle: 'Круг',
    diamond: 'Ромб',
    triangle: 'Треугольник',
    line: 'Линия',
    arrow: 'Стрелка',
    connector: 'Связь',
    pen: 'Рисунок',
    text: 'Подпись',
    comment: 'Комментарий',
  };
  return map[type];
}
