import './Toolbar.css';

interface Props {
  docName: string;
  selectionCount: number;
  onDocNameChange: (name: string) => void;
  onExportPng: () => void;
  onExportJpg: () => void;
  onExportPdf: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  zoom: number;
}

export function Toolbar({
  docName,
  selectionCount,
  onDocNameChange,
  onExportPng,
  onExportJpg,
  onExportPdf,
  onExportJson,
  onImportJson,
  onDelete,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  zoom,
}: Props) {
  return (
    <header className="toolbar">
      <input
        className="toolbar-title"
        value={docName}
        onChange={(e) => onDocNameChange(e.target.value)}
        spellCheck={false}
      />
      <div className="toolbar-group">
        <span className="toolbar-label">Масштаб</span>
        <button type="button" className="toolbar-btn" onClick={onZoomOut} title="Уменьшить">
          −
        </button>
        <button type="button" className="toolbar-btn zoom-value" onClick={onZoomReset} title="Сброс">
          {Math.round(zoom * 100)}%
        </button>
        <button type="button" className="toolbar-btn" onClick={onZoomIn} title="Увеличить">
          +
        </button>
      </div>
      <div className="toolbar-spacer" />
      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn danger"
          onClick={onDelete}
          disabled={selectionCount === 0}
          title="Удалить выбранное (Del)"
        >
          Удалить{selectionCount > 0 ? ` (${selectionCount})` : ''}
        </button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <span className="toolbar-label">Файл</span>
        <button type="button" className="toolbar-btn" onClick={onImportJson}>
          Импорт JSON
        </button>
        <button type="button" className="toolbar-btn" onClick={onExportJson}>
          Экспорт JSON
        </button>
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-group">
        <span className="toolbar-label">Экспорт</span>
        <button type="button" className="toolbar-btn primary" onClick={onExportPng}>
          PNG
        </button>
        <button type="button" className="toolbar-btn" onClick={onExportJpg}>
          JPG
        </button>
        <button type="button" className="toolbar-btn" onClick={onExportPdf}>
          PDF
        </button>
      </div>
    </header>
  );
}
