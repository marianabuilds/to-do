import { useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Note } from '../types';
import styles from './StickyNote.module.css';

function darkenHex(hex: string, factor = 0.18): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${Math.floor(r * (1 - factor))},${Math.floor(g * (1 - factor))},${Math.floor(b * (1 - factor))})`;
}

type StickyNoteProps =
  | { mode: 'supply'; color: string }
  | {
      mode: 'board';
      note: Note;
      autoFocus?: boolean;
      onTextChange: (text: string) => void;
      onFocused?: () => void;
    };

export function StickyNote(props: StickyNoteProps) {
  if (props.mode === 'supply') {
    return <SupplyNote color={props.color} />;
  }
  return <BoardNote {...props} />;
}

export function SupplyNote({ color }: { color: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `template-${color}`,
      data: { type: 'template', color },
    });

  const headerColor = darkenHex(color);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.note} ${styles.supplyNote} ${isDragging ? styles.dragging : ''}`}
      style={{
        backgroundColor: color,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <div className={styles.header} style={{ backgroundColor: headerColor }}>
        <span className={styles.headerIcon}>▢</span>
        <span className={styles.headerIcon}>◢ ▢</span>
      </div>
    </div>
  );
}

function BoardNote({
  note,
  autoFocus,
  onTextChange,
  onFocused,
}: {
  note: Note;
  autoFocus?: boolean;
  onTextChange: (text: string) => void;
  onFocused?: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `note-${note.id}`,
      data: { type: 'board', noteId: note.id },
    });

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      onFocused?.();
    }
  }, [autoFocus, onFocused]);

  const headerColor = darkenHex(note.color);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.note} ${styles.boardNote}`}
      style={{
        '--x': `${note.x}%`,
        '--y': `${note.y}%`,
        backgroundColor: note.color,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.45 : 1,
      } as React.CSSProperties}
      {...attributes}
    >
      <div
        className={styles.header}
        style={{ backgroundColor: headerColor }}
        {...listeners}
      >
        <span className={styles.headerIcon}>▢</span>
        <span className={styles.headerIcon}>◢ ▢</span>
      </div>
      <div className={styles.body}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={note.text}
          onChange={(e) => onTextChange(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Write here…"
        />
      </div>
    </div>
  );
}
