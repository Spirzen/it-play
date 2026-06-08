import type { ToolMode } from './types/schema';
import { isShapeTool } from './utils/createElement';
import './ShapePalette.css';

interface ToolItem {
  id: ToolMode;
  label: string;
  icon: string;
  draggable?: boolean;
}

const TOOLS: { group: string; items: ToolItem[] }[] = [
  {
    group: 'Инструменты',
    items: [
      { id: 'select', label: 'Выбор', icon: '↖' },
      { id: 'pan', label: 'Панорама', icon: '✋' },
      { id: 'pen', label: 'Рисование', icon: '✎' },
      { id: 'eraser', label: 'Ластик', icon: '◖' },
      { id: 'connector', label: 'Связь', icon: '⟷' },
    ],
  },
  {
    group: 'Фигуры',
    items: [
      { id: 'rectangle', label: 'Прямоугольник', icon: '▭', draggable: true },
      { id: 'roundedRect', label: 'Скруглённый', icon: '▢', draggable: true },
      { id: 'circle', label: 'Круг', icon: '○', draggable: true },
      { id: 'diamond', label: 'Ромб', icon: '◇', draggable: true },
      { id: 'triangle', label: 'Треугольник', icon: '△', draggable: true },
    ],
  },
  {
    group: 'Линии',
    items: [
      { id: 'line', label: 'Линия', icon: '／', draggable: true },
      { id: 'arrow', label: 'Стрелка', icon: '→', draggable: true },
    ],
  },
  {
    group: 'Текст',
    items: [
      { id: 'text', label: 'Подпись', icon: 'T', draggable: true },
      { id: 'comment', label: 'Комментарий', icon: '💬', draggable: true },
    ],
  },
];

interface Props {
  activeTool: ToolMode;
  onToolChange: (tool: ToolMode) => void;
}

export function ShapePalette({ activeTool, onToolChange }: Props) {
  const handleDragStart = (e: React.DragEvent, tool: ToolMode) => {
    if (!isShapeTool(tool)) return;
    e.dataTransfer.setData('application/schema-maker-tool', tool);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="palette">
      <div className="palette-brand">
        <span className="palette-logo">◇</span>
        <div>
          <strong>Schema Maker</strong>
          <span className="palette-tagline">строитель схем</span>
        </div>
      </div>
      {TOOLS.map((section) => (
        <div key={section.group} className="palette-section">
          <span className="palette-section-title">{section.group}</span>
          <div className="palette-grid">
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`palette-btn ${activeTool === item.id ? 'active' : ''} ${item.draggable ? 'draggable' : ''}`}
                title={
                  item.draggable
                    ? `${item.label} — перетащите на холст`
                    : item.label
                }
                draggable={item.draggable ?? false}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={() => onToolChange(item.id)}
              >
                <span className="palette-icon">{item.icon}</span>
                <span className="palette-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="palette-hint">
        Перетащите фигуру на холст или нарисуйте кликом. Выделение — рамкой на
        холсте, Shift — добавить к выбору.
      </p>
    </aside>
  );
}
