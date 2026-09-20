// Este layout envuelve TODAS las páginas protegidas del admin (por
// ahora solo la de bienvenida; después irán aquí crear/editar/listar
// posts). No envuelve /admin/login — por eso login vive fuera de esta
// carpeta "(protected)".
//
// verifySession() aquí es la segunda revisión (defensa en profundidad):
// el proxy.ts ya redirige antes de llegar hasta acá, pero si alguien
// encontrara la forma de saltarse el proxy, esta línea igual lo frena.
import Link from 'next/link';
import { verifySession } from '@/lib/auth/dal';
import { logout } from './actions';
import styles from './layout.module.css';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <nav className={styles.nav}>
          <span className={styles.label}>Panel de administración</span>
          <Link href="/admin" className={styles.navLink}>Posts</Link>
          <Link href="/admin/comments" className={styles.navLink}>Comentarios</Link>
          <Link href="/admin/messages" className={styles.navLink}>Mensajes</Link>
        </nav>
        <form action={logout}>
          <button type="submit" className={styles.logout}>
            Cerrar sesión
          </button>
        </form>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
