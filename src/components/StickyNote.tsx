import { useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Note } from '../types';
import {
  NOTE_WIDTH,
  NOTE_HEIGHT,
  NOTE_MIN_WIDTH,
  NOTE_MIN_HEIGHT,
} from '../constants';
import styles from './StickyNote.module.css';

function darkenHex(hex: string, factor = 0.18): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${Math.floor(r * (1 - factor))},${Math.floor(g * (1 - factor))},${Math.floor(b * (1 - factor))})`;
}

type Handle = 'se' | 'sw' | 'ne' | 'nw';

function startResize(
  e: React.PointerEvent,
  handle: Handle,
  note: Note,
  boardRef: React.RefObject<HTMLDivElement | null>,
  onResize: (w: number, h: number, x?: number, y?: number) => void,
) {
  e.stopPropagation();
  e.preventDefault();

  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture(e.pointerId);

  const boardRect = boardRef.current!.getBoundingClientRect();
  const startW = note.width ?? NOTE_WIDTH;
  const startH = note.height ?? NOTE_HEIGHT;
  const startXpx = (note.x / 100) * boardRect.width;
  const startYpx = (note.y / 100) * boardRect.height;
  const startClientX = e.clientX;
  const startClientY = e.clientY;

  function onMove(ev: PointerEvent) {
    const dx = ev.clientX - startClientX;
    const dy = ev.clientY - startClientY;
    const board = boardRef.current!.getBoundingClientRect();

    let newW = startW;
    let newH = startH;
    let newXpx = startXpx;
    let newYpx = startYpx;

    if (handle === 'se') { newW = startW + dx; newH = startH + dy; }
    if (handle === 'sw') { newW = startW - dx; newH = startH + dy; newXpx = startXpx + dx; }
    if (handle === 'ne') { newW = startW + dx; newH = startH - dy; newYpx = startYpx + dy; }
    if (handle === 'nw') { newW = startW - dx; newH = startH - dy; newXpx = startXpx + dx; newYpx = startYpx + dy; }

    newW = Math.max(NOTE_MIN_WIDTH, newW);
    newH = Math.max(NOTE_MIN_HEIGHT, newH);
    newXpx = Math.max(0, Math.min(newXpx, board.width - newW));
    newYpx = Math.max(0, Math.min(newYpx, board.height - newH));

    const newX = (newXpx / board.width) * 100;
    const newY = (newYpx / board.height) * 100;

    const posChanged = handle !== 'se';
    onResize(newW, newH, posChanged ? newX : undefined, posChanged ? newY : undefined);
  }

  function onUp() {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
  }

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
}

export function SupplyNotePreview({ color }: { color: string }) {
  const headerColor = darkenHex(color);
  return (
    <div
      className={`${styles.note} ${styles.supplyNote}`}
      style={{ backgroundColor: color }}
    >
      <div className={styles.header} style={{ backgroundColor: headerColor }} />
    </div>
  );
}

type StickyNoteProps =
  | { mode: 'supply'; color: string }
  | {
      mode: 'board';
      note: Note;
      autoFocus?: boolean;
      onTextChange: (text: string) => void;
      onFocused?: () => void;
      onResize: (width: number, height: number, x?: number, y?: number) => void;
      boardRef: React.RefObject<HTMLDivElement | null>;
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
      <div className={styles.header} style={{ backgroundColor: headerColor }} />
    </div>
  );
}

function BoardNote({
  note,
  autoFocus,
  onTextChange,
  onFocused,
  onResize,
  boardRef,
}: {
  note: Note;
  autoFocus?: boolean;
  onTextChange: (text: string) => void;
  onFocused?: () => void;
  onResize: (width: number, height: number, x?: number, y?: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
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
  const w = note.width ?? NOTE_WIDTH;
  const h = note.height ?? NOTE_HEIGHT;

  return (
    <div
      ref={setNodeRef}
      className={`${styles.note} ${styles.boardNote}`}
      style={{
        '--x': `${note.x}%`,
        '--y': `${note.y}%`,
        '--w': `${w}px`,
        '--h': `${h}px`,
        backgroundColor: note.color,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        zIndex: isDragging ? 100 : 1,
      } as React.CSSProperties}
      {...attributes}
    >
      <div
        className={styles.header}
        style={{ backgroundColor: headerColor }}
        {...listeners}
      />
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
      {(['se', 'sw', 'ne', 'nw'] as const).map((handle) => (
        <div
          key={handle}
          className={`${styles.resizeHandle} ${styles[`resize${handle.toUpperCase() as 'SE' | 'SW' | 'NE' | 'NW'}`]}`}
          onPointerDown={(e) => startResize(e, handle, note, boardRef, onResize)}
        />
      ))}
    </div>
  );
}
