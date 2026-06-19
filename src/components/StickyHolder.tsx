import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { STICKY_COLORS } from '../constants';
import styles from './StickyHolder.module.css';

function darkenHex(hex: string, factor = 0.18): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${Math.floor(r * (1 - factor))},${Math.floor(g * (1 - factor))},${Math.floor(b * (1 - factor))})`;
}

function ColorSwatch({ color }: { color: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `template-${color}`,
      data: { type: 'template', color },
    });

  const headerColor = darkenHex(color);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.swatch} ${isDragging ? styles.dragging : ''}`}
      style={{
        backgroundColor: color,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <div className={styles.swatchHeader} style={{ backgroundColor: headerColor }}>
        <span>▢</span>
        <span>◢ ▢</span>
      </div>
      <div className={styles.swatchBody} />
    </div>
  );
}

export function StickyHolder() {
  return (
    <div className={styles.holder} aria-label="Sticky note supply">
      <div className={styles.title}>Stickies</div>
      {STICKY_COLORS.map((color) => (
        <ColorSwatch key={color} color={color} />
      ))}
    </div>
  );
}
