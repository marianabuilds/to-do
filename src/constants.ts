export const BOARD_WIDTH = 846;
export const BOARD_HEIGHT = 600;
export const BOARD_MIN_WIDTH = 400;
export const BOARD_MIN_HEIGHT = 300;
export const NOTE_WIDTH = 150;
export const NOTE_HEIGHT = 200;
export const NOTE_MIN_WIDTH = 80;
export const NOTE_MIN_HEIGHT = 80;

export const DND_IDS = {
  corkBoard: 'cork-board',
  trash: 'trash-can',
} as const;

export const STORAGE_KEYS = {
  notes: 'cork-board-notes',
  trashedCount: 'cork-board-trashed-count',
  board: 'cork-board-dimensions',
} as const;

export const STICKY_COLORS = [
  '#fff59d',
  '#f8bbd0',
  '#b2dfdb',
  '#d1c4e9',
  '#ffcc80',
];
