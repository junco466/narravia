'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/presentation/components/ThemeToggle/ThemeToggle';
import styles from '@/presentation/components/Header/Header.module.css';
import logo_dark from '@/assets/logo_dark.svg';
import logo_light from '@/assets/logo_light.svg';
import logo_nombre_dark from '@/assets/logo_nombre_dark.svg';
import logo_nombre_light from '@/assets/logo_nombre_light.svg';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img
            src={theme === 'light' ? logo_nombre_light.src : logo_nombre_dark.src}
            alt="Narravia"
            className={`${styles.logo} ${styles.logoDesktop}`}
          />
          <img
            src={theme === 'light' ? logo_light.src : logo_dark.src}
            alt="Narravia"
            className={`${styles.logo} ${styles.logoMobile}`}
          />
        </Link>

        <nav
          id="primary-navigation"
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`.trim()}
          aria-label="Navegación principal"
        >
          {navigation.map((item) => {
            const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                href={item.to}
                className={`${styles.link} ${isActive ? styles.active : ''}`.trim()}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.controls}>
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={`${styles.menuIcon} ${isMenuOpen ? styles.menuIconOpen : ''}`.trim()} />
          </button>
        </div>
      </div>
    </header>
  );
};
