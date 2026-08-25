import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@/presentation/components/ThemeToggle/ThemeToggle';
import styles from '@/presentation/components/Header/Header.module.css';
import logo_dark from '@/assets/logo_dark.svg';
import logo_light from '@/assets/logo_light.svg';
import { useThemeStore } from '@/presentation/hooks/useThemeStore';


const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Poemas', to: '/poemas' },
  { label: 'Novelas', to: '/novelas' },
  { label: 'Reflexiones', to: '/reflexiones' },
  { label: 'Sobre mí', to: '/sobre-mi' },
  { label: 'Contacto', to: '/contacto' },
];

export const Header = () => {
  const theme = useThemeStore((state) => state.theme);
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          {/* <span className={styles.brandOverline}>Cuaderno de</span>
          <span className={styles.brandTitle}>Medianoche</span> */}
          {theme === 'light' ? <img src={logo_light} alt="Logo" className={styles.logo}/> : <img src={logo_dark} alt="Logo" className={styles.logo}/> }
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
