import styles from '@/presentation/components/Footer/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>Informacion</p>
        <p>Redes Sociales....</p>
      </div>
    </footer>
  );
};
