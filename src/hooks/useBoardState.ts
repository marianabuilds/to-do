import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
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

  return { notes, trashedCount, addNote, moveNote, updateNoteText, removeNote };
}
