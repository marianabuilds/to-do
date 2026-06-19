import { useRef, useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { DND_IDS } from './constants';
import { getBoardPosition } from './utils/boardPosition';
import { useBoardState } from './hooks/useBoardState';
import type { DragData } from './types';
import { CorkBoard } from './components/CorkBoard';
import { Toolbox } from './components/Toolbox';
import { SupplyNote } from './components/StickyNote';
import styles from './App.module.css';

export default function App() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [focusNoteId, setFocusNoteId] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [toolboxOpen, setToolboxOpen] = useState(false);

  const { notes, trashedCount, addNote, moveNote, updateNoteText, removeNote, resizeNote } =
    useBoardState();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data?.type === 'template') {
      setActiveColor(data.color);
    }
    // Close wheel so the board is fully visible during drag
    setToolboxOpen(false);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const data = active.data.current as DragData | undefined;
      const boardEl = boardRef.current;

      setActiveColor(null);

      if (!data || !boardEl) return;

      if (over?.id === DND_IDS.trash) {
        if (data.type === 'board') removeNote(data.noteId);
        return;
      }

      if (over?.id !== DND_IDS.corkBoard) return;

      const position = getBoardPosition(active, boardEl);
      if (!position) return;

      if (data.type === 'template') {
        const noteId = addNote({
          color: data.color,
          x: position.x,
          y: position.y,
          text: '',
        });
        setFocusNoteId(noteId);
        return;
      }

      if (data.type === 'board') {
        moveNote(data.noteId, position);
      }
    },
    [addNote, moveNote, removeNote],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.app}>
        <div className={styles.workspace}>
          <CorkBoard
            ref={boardRef}
            boardRef={boardRef}
            notes={notes}
            focusNoteId={focusNoteId}
            onTextChange={updateNoteText}
            onNoteFocused={(id) => {
              if (focusNoteId === id) setFocusNoteId(null);
            }}
            onResizeNote={(id, w, h, x, y) => resizeNote(id, w, h, x, y)}
          />
        </div>

        <Toolbox
          trashedCount={trashedCount}
          isOpen={toolboxOpen}
          onToggle={() => setToolboxOpen((o) => !o)}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeColor ? <SupplyNote color={activeColor} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
