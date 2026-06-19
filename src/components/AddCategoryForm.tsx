import { useState, type FormEvent } from 'react';
import styles from './AddCategoryForm.module.css';

type AddCategoryFormProps = {
  onAdd: (name: string) => void;
};

export function AddCategoryForm({ onAdd }: AddCategoryFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New category..."
        maxLength={24}
      />
      <button className={styles.button} type="submit">
        Add
      </button>
    </form>
  );
}
