import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@/presentation/components/ThemeToggle/ThemeToggle';
import styles from '@/presentation/components/Header/Header.module.css';

const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Poemas', to: '/poemas' },
  { label: 'Novelas', to: '/novelas' },
  { label: 'Reflexiones', to: '/reflexiones' },
  { label: 'Sobre mí', to: '/sobre-mi' },
  { label: 'Contacto', to: '/contacto' },
];

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.brandOverline}>Cuaderno de</span>
          <span className={styles.brandTitle}>Medianoche</span>
        </NavLink>

        <nav className={styles.nav} aria-label="Navegación principal">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`.trim()}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
};
