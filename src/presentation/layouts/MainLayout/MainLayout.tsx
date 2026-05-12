import { Outlet } from 'react-router-dom';
import { Header } from '@/presentation/components/Header/Header';
import { Footer } from '@/presentation/components/Footer/Footer';
import styles from '@/presentation/layouts/MainLayout/MainLayout.module.css';

export const MainLayout = () => {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
