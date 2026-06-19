import { useDraggable } from '@dnd-kit/core';
import { STICKY_COLORS } from '../constants';
import styles from './Toolbox.module.css';

// Geometry
const RADIUS = 90;
const ITEM_SIZE = 44;
const TRIGGER_SIZE = 48;

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

interface ToolboxProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Toolbox({ isOpen, onToggle }: ToolboxProps) {
  return (
    <div className={styles.toolbox}>
      {isOpen &&
        STICKY_COLORS.map((color, i) => (
          <StickyItem
            key={color}
            color={color}
            pos={wheelPos(i, STICKY_COLORS.length)}
            delay={i * 20}
          />
        ))}

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
