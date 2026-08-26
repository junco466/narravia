import { Link } from 'react-router-dom';
import styles from '@/presentation/pages/NotFound/NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Página no encontrada.</h1>
      <p className={styles.description}>La ruta solicitada no existe dentro de esta biblioteca.</p>
      <Link className={styles.link} to="/">
        Volver al inicio <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
};
