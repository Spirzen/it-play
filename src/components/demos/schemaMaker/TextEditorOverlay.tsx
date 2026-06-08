import { useEffect, useRef } from 'react';
import type { SchemaElement, Viewport } from './types/schema';
import { getElementBounds } from './utils/bounds';
import './TextEditorOverlay.css';

interface Props {
  element: SchemaElement;
  viewport: Viewport;
  canvasRect: DOMRect;
  onSave: (text: string) => void;
  onClose: () => void;
}

export function TextEditorOverlay({
  element,
  viewport,
  canvasRect,
  onSave,
  onClose,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bounds = getElementBounds(element);
  const pad = element.type === 'text' ? 12 : 12;

  const left = canvasRect.left + bounds.x * viewport.scale + viewport.x + pad;
  const top = canvasRect.top + bounds.y * viewport.scale + viewport.y + pad;
  const width = Math.max(80, bounds.width * viewport.scale - pad * 2);
  const height = Math.max(32, bounds.height * viewport.scale - pad * 2);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.select();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <textarea
      ref={textareaRef}
      className="text-editor-overlay"
      style={{
        left,
        top,
        width,
        height,
        fontSize: (element.fontSize ?? 14) * viewport.scale,
        color: element.stroke,
      }}
      defaultValue={element.text ?? ''}
      onBlur={(e) => onSave(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onSave((e.target as HTMLTextAreaElement).value);
        }
      }}
    />
  );
}
