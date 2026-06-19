import { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DND_IDS, BOARD_MIN_WIDTH, BOARD_MIN_HEIGHT } from '../constants';
import type { Note } from '../types';
import { StickyNote } from './StickyNote';
import styles from './CorkBoard.module.css';

type BoardSize = { width: number; height: number };

type CorkBoardProps = {
  notes: Note[];
  focusNoteId: string | null;
  onTextChange: (noteId: string, text: string) => void;
  onNoteFocused: (noteId: string) => void;
  onResizeNote: (noteId: string, w: number, h: number, x?: number, y?: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
  boardSize: BoardSize;
  onResizeBoard: (width: number, height: number) => void;
};

function startBoardResize(
  e: React.PointerEvent,
  boardSize: BoardSize,
  onResizeBoard: (w: number, h: number) => void,
) {
  e.stopPropagation();
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture(e.pointerId);

  const startW = boardSize.width;
  const startH = boardSize.height;
  const startX = e.clientX;
  const startY = e.clientY;

  function onMove(ev: PointerEvent) {
    const w = Math.max(BOARD_MIN_WIDTH, startW + (ev.clientX - startX));
    const h = Math.max(BOARD_MIN_HEIGHT, startH + (ev.clientY - startY));
    onResizeBoard(w, h);
  }

  function onUp() {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
  }

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
}

export const CorkBoard = forwardRef<HTMLDivElement, CorkBoardProps>(
  function CorkBoard(
    {
      notes,
      focusNoteId,
      onTextChange,
      onNoteFocused,
      onResizeNote,
      boardRef,
      boardSize,
      onResizeBoard,
    },
    ref,
  ) {
    const { setNodeRef, isOver } = useDroppable({ id: DND_IDS.corkBoard });

    const setRefs = (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div
        ref={setRefs}
        className={styles.board}
        data-over={isOver}
        style={{
          '--bw': `${boardSize.width}px`,
          '--bh': `${boardSize.height}px`,
        } as React.CSSProperties}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            mode="board"
            note={note}
            autoFocus={note.id === focusNoteId}
            onTextChange={(text) => onTextChange(note.id, text)}
            onFocused={() => onNoteFocused(note.id)}
            onResize={(w, h, x, y) => onResizeNote(note.id, w, h, x, y)}
            boardRef={boardRef}
          />
        ))}
        <div
          className={styles.resizeHandle}
          onPointerDown={(e) => startBoardResize(e, boardSize, onResizeBoard)}
        />
      </div>
    );
  },
);
