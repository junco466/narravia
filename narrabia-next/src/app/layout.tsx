import type { Metadata } from 'next';
import { Fraunces, Literata } from 'next/font/google';
import { Header } from '@/presentation/components/Header/Header';
import { Footer } from '@/presentation/components/Footer/Footer';
import { ThemeSync } from '@/presentation/components/ThemeSync/ThemeSync';
import styles from '@/presentation/layouts/MainLayout/MainLayout.module.css';
import '@/presentation/styles/global.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

const literata = Literata({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-literata',
});

export const metadata: Metadata = {
  title: 'Narravia',
  description: 'Plataforma literaria para publicar poemas, novelas, reflexiones y escritos personales.',
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('literary-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${literata.variable}`} suppressHydrationWarning>
      <body>
        {/*
          Etiqueta <script> cruda a propósito (no next/script): en esta
          versión de Next, next/script con beforeInteractive encola el
          código y lo corre después, cuando carga el JS del framework —
          eso causaba el parpadeo claro->oscuro. Un <script> crudo con
          dangerouslySetInnerHTML es HTML puro: el navegador lo ejecuta
          de inmediato, mientras aún está leyendo la página, antes de
          pintar nada.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeSync />
        <div className={styles.shell}>
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
