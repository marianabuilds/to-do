import { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DND_IDS } from '../constants';
import type { Note } from '../types';
import { StickyNote } from './StickyNote';
import styles from './CorkBoard.module.css';

type CorkBoardProps = {
  notes: Note[];
  focusNoteId: string | null;
  onTextChange: (noteId: string, text: string) => void;
  onNoteFocused: (noteId: string) => void;
  onResizeNote: (noteId: string, w: number, h: number, x?: number, y?: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
};

export const CorkBoard = forwardRef<HTMLDivElement, CorkBoardProps>(
  function CorkBoard(
    { notes, focusNoteId, onTextChange, onNoteFocused, onResizeNote, boardRef },
    ref,
  ) {
    const { setNodeRef, isOver } = useDroppable({ id: DND_IDS.corkBoard });

    const setRefs = (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div ref={setRefs} className={styles.board} data-over={isOver}>
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
      </div>
    );
  },
);
