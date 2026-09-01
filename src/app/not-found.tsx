// Archivo especial: not-found.tsx en la raíz de app/ es la página que
// Next muestra automáticamente cuando algo llama notFound(), o cuando
// alguien visita una URL que no coincide con ninguna ruta.

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Página no encontrada.</h1>
      <p className={styles.description}>La ruta solicitada no existe dentro de esta biblioteca.</p>
      <Link className={styles.link} href="/">
        Volver al inicio <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
}
