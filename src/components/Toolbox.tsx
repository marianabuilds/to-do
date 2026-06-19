import { useDraggable, useDroppable } from '@dnd-kit/core';
import { STICKY_COLORS, DND_IDS } from '../constants';
import styles from './Toolbox.module.css';

// Geometry
const RADIUS = 90;       // px, from trigger center to item center
const ITEM_SIZE = 44;    // px
const TRIGGER_SIZE = 48; // px

function wheelPos(index: number, total: number) {
  // Fan from 90° (straight up, index 0) → 0° (straight right, last index)
  const angleDeg = 90 - (90 / (total - 1)) * index;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: TRIGGER_SIZE / 2 + Math.cos(rad) * RADIUS - ITEM_SIZE / 2,
    bottom: TRIGGER_SIZE / 2 + Math.sin(rad) * RADIUS - ITEM_SIZE / 2,
  };
}

function StickyItem({
  color,
  pos,
  delay,
}: {
  color: string;
  pos: { left: number; bottom: number };
  delay: number;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${color}`,
    data: { type: 'template', color },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={styles.item}
      style={{
        left: pos.left,
        bottom: pos.bottom,
        backgroundColor: color,
        opacity: isDragging ? 0.35 : 1,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function TrashItem({
  pos,
  trashedCount,
  delay,
}: {
  pos: { left: number; bottom: number };
  trashedCount: number;
  delay: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: DND_IDS.trash });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.item} ${styles.trashItem} ${isOver ? styles.over : ''}`}
      style={{ left: pos.left, bottom: pos.bottom, animationDelay: `${delay}ms` }}
    >
      <img
        src={trashedCount > 0 ? '/trash-full.png' : '/trash-empty.svg'}
        alt="Trash"
        className={styles.trashImg}
      />
    </div>
  );
}

interface ToolboxProps {
  trashedCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function Toolbox({ trashedCount, isOpen, onToggle }: ToolboxProps) {
  type Entry = { kind: 'sticky'; color: string } | { kind: 'trash' };

  const entries: Entry[] = [
    ...STICKY_COLORS.map((color) => ({ kind: 'sticky' as const, color })),
    { kind: 'trash' },
  ];

  return (
    <div className={styles.toolbox}>
      {isOpen &&
        entries.map((entry, i) => {
          const pos = wheelPos(i, entries.length);
          const delay = i * 18;
          if (entry.kind === 'trash') {
            return (
              <TrashItem key="trash" pos={pos} trashedCount={trashedCount} delay={delay} />
            );
          }
          return (
            <StickyItem key={entry.color} color={entry.color} pos={pos} delay={delay} />
          );
        })}

      <button
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close toolbox' : 'Open toolbox'}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9z" />
            <polyline points="15 3 15 9 21 9" />
          </svg>
        )}
      </button>
    </div>
  );
}
