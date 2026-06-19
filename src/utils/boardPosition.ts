import type { Active } from '@dnd-kit/core';
import { NOTE_WIDTH, NOTE_HEIGHT } from '../constants';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Top-left of the dragged note at drop time, relative to the board container. */
export function getBoardPosition(
  active: Active,
  boardEl: HTMLElement,
): { x: number; y: number } | null {
  const translated = active.rect.current.translated;
  if (!translated) return null;

  const boardRect = boardEl.getBoundingClientRect();

  // Top-left corner in board-local pixels — exactly where the user placed it
  const relativeX = translated.left - boardRect.left;
  const relativeY = translated.top - boardRect.top;

  // Clamp so the full note stays inside the board
  const clampedX = clamp(relativeX, 0, boardRect.width - NOTE_WIDTH);
  const clampedY = clamp(relativeY, 0, boardRect.height - NOTE_HEIGHT);

  return {
    x: (clampedX / boardRect.width) * 100,
    y: (clampedY / boardRect.height) * 100,
  };
}
