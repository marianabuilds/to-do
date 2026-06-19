import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, BOARD_WIDTH, BOARD_HEIGHT } from '../constants';
import type { Note, NewNoteInput } from '../types';

function generateId() {
  return crypto.randomUUID();
}

export function useBoardState() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.notes, []);
  const [trashedCount, setTrashedCount] = useLocalStorage<number>(
    STORAGE_KEYS.trashedCount,
    0,
  );
  const [boardSize, setBoardSize] = useLocalStorage<{ width: number; height: number }>(
    STORAGE_KEYS.board,
    { width: BOARD_WIDTH, height: BOARD_HEIGHT },
  );

  const addNote = useCallback(
    (input: NewNoteInput) => {
      const note: Note = { id: generateId(), ...input };
      setNotes((prev) => [...prev, note]);
      return note.id;
    },
    [setNotes],
  );

  const moveNote = useCallback(
    (noteId: string, position: { x: number; y: number }) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, ...position } : n)),
      );
    },
    [setNotes],
  );

  const updateNoteText = useCallback(
    (noteId: string, text: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, text } : n)),
      );
    },
    [setNotes],
  );

  const removeNote = useCallback(
    (noteId: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setTrashedCount((c) => c + 1);
    },
    [setNotes, setTrashedCount],
  );

  const resizeNote = useCallback(
    (noteId: string, width: number, height: number, x?: number, y?: number) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? {
                ...n,
                width,
                height,
                ...(x !== undefined ? { x } : {}),
                ...(y !== undefined ? { y } : {}),
              }
            : n,
        ),
      );
    },
    [setNotes],
  );

  const resizeBoard = useCallback(
    (width: number, height: number) => setBoardSize({ width, height }),
    [setBoardSize],
  );

  return {
    notes,
    trashedCount,
    boardSize,
    addNote,
    moveNote,
    updateNoteText,
    removeNote,
    resizeNote,
    resizeBoard,
  };
}
