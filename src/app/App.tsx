import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRouter } from '@/presentation/router/AppRouter';
import { useThemeStore } from '@/presentation/hooks/useThemeStore';

const App = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
