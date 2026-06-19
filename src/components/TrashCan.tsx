import { useDroppable } from '@dnd-kit/core';
import { DND_IDS } from '../constants';
import styles from './TrashCan.module.css';

type TrashCanProps = {
  trashedCount: number;
};

export function TrashCan({ trashedCount }: TrashCanProps) {
  const { setNodeRef, isOver } = useDroppable({ id: DND_IDS.trash });

  const src = trashedCount > 0 ? '/trash-full.svg' : '/trash-empty.svg';

  return (
    <div
      ref={setNodeRef}
      className={`${styles.trash} ${isOver ? styles.over : ''}`}
      aria-label="Trash — drop completed notes here"
    >
      <img src={src} alt={trashedCount > 0 ? 'Trash (full)' : 'Trash (empty)'} className={styles.image} draggable={false} />
      <div className={styles.label}>Done</div>
    </div>
  );
}
