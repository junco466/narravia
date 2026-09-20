// Igual que DeleteCommentButton: 'use client' solo para el confirm().
'use client';

import { deleteMessage } from '@/app/admin/(protected)/messages/actions';
import styles from './DeletePostButton.module.css';

export const DeleteMessageButton = ({ id }: { id: number }) => (
  <form
    action={deleteMessage}
    onSubmit={(event) => {
      if (!window.confirm('¿Eliminar este mensaje? Esta acción no se puede deshacer.')) {
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
