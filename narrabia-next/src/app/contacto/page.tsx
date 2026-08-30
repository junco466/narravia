// Ruta "/contacto". Igual que "/sobre-mi": Server Component sin cambios,
// solo se le agregó metadata para SEO.

import type { Metadata } from 'next';
import styles from './page.module.css';

const CONTACT_EMAIL = 'jsbalbin466@gmail.com';

export const metadata: Metadata = {
  title: 'Contacto — Narravia',
  description: 'Un canal directo, mientras el resto toma forma.',
};

export default function ContactoPage() {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Contacto</p>
      <h1 className={styles.title}>Un canal directo, mientras el resto toma forma.</h1>
      <div className={styles.card}>
        <p>
          Por ahora, el correo es la única vía de contacto. Las redes sociales están en camino — cuando estén
          listas, aparecerán aquí también.
        </p>
        <ul className={styles.list}>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
        </ul>
      </div>
    </section>
  );
}
