import { useThemeStore } from '@/presentation/hooks/useThemeStore';
import styles from '@/presentation/components/ThemeToggle/ThemeToggle.module.css';

export const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button type="button" onClick={toggleTheme} className={styles.toggle}>
      <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
    </button>
  );
};
