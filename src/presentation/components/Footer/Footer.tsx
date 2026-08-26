import styles from '@/presentation/components/Footer/Footer.module.css';

const CONTACT_EMAIL = 'jsbalbin466@gmail.com';

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M3.5 3h4.2l4 5.6L16.2 3h3.3l-6.1 7.7L20 21h-4.2l-4.4-6.1L6.1 21H2.8l6.5-8.2L3.5 3z" />
      </svg>
    ),
  },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <svg className={styles.inkStroke} viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 12 C 150 2, 300 22, 450 12 S 750 2, 900 12 S 1100 22, 1200 12" />
      </svg>

      <div className={styles.inner}>
        <div className={styles.about}>
          <p className={styles.wordmark}>Narravia</p>
          <p className={styles.tagline}>
            Un cuaderno de medianoche para poemas, novelas y reflexiones.
          </p>
        </div>

        <div className={styles.contact}>
          <a className={styles.emailLink} href={`mailto:${CONTACT_EMAIL}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            {CONTACT_EMAIL}
          </a>

          <div className={styles.social}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={styles.socialLink}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.copyright}>&copy; {year} Narravia. Todos los derechos reservados.</p>
    </footer>
  );
};
