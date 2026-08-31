// Layout RAIZ — obligatorio en Next, es el único que puede tener las
// etiquetas <html> y <body>. Se aplica a TODO: blog público Y admin.
// Por eso solo tiene lo que ambos necesitan de verdad: fuentes, tema
// claro/oscuro, y los estilos globales. El Header/Footer del blog viven
// en app/(site)/layout.tsx — así el admin no los hereda.

import type { Metadata } from 'next';
import { Fraunces, Literata } from 'next/font/google';
import { ThemeSync } from '@/presentation/components/ThemeSync/ThemeSync';
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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
