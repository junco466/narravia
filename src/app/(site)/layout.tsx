// Layout del blog público (todo lo que NO es /admin). El grupo de rutas
// "(site)" — la carpeta con paréntesis — es invisible en la URL: esta
// página sigue viviendo en "/", no en "/site". Los paréntesis solo
// sirven para agrupar rutas que comparten un layout, sin afectar la URL.
//
// Header/Footer viven aquí y no en el layout raíz, para que /admin
// pueda tener su propio diseño sin heredarlos.

import { Header } from '@/presentation/components/Header/Header';
import { Footer } from '@/presentation/components/Footer/Footer';
import styles from '@/presentation/layouts/MainLayout/MainLayout.module.css';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
