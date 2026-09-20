// Igual que DeletePostButton: 'use client' solo para el confirm().
'use client';

import { deleteComment } from '@/app/admin/(protected)/comments/actions';
import styles from './DeletePostButton.module.css';

export const DeleteCommentButton = ({ id }: { id: number }) => (
  <form
    action={deleteComment}
    onSubmit={(event) => {
      if (!window.confirm('¿Eliminar este comentario? Esta acción no se puede deshacer.')) {
        event.preventDefault();
      }
    }}
  >
    <input type="hidden" name="id" value={id} />
    <button type="submit" className={styles.button}>
      Eliminar
    </button>
  </form>
);
