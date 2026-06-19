export type Note = {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
};

export type DragData =
  | { type: 'template'; color: string }
  | { type: 'board'; noteId: string };

export type NewNoteInput = {
  color: string;
  x: number;
  y: number;
  text: string;
};
