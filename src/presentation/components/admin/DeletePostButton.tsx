// 'use client' porque window.confirm() solo existe en el navegador.
// El envío en sí (el form) sigue yendo a una Server Action normal —
// lo único que corre en el cliente es la pregunta de confirmación.
'use client';

import { deletePost } from '@/app/admin/(protected)/posts/actions';
import styles from './DeletePostButton.module.css';

export const DeletePostButton = ({ id, title }: { id: string; title: string }) => {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) {
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
};
