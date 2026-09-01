// Listado de todos los posts (con y sin publicar) — la "home" del
// panel de Admin. Los filtros son un <form method="get"> normal, sin
// JavaScript: al elegir tipo/estado y darle a "Filtrar", el navegador
// navega a /admin?type=poema&status=draft, y esta misma página lee
// esos valores de "searchParams" para decidir qué mostrar.
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { listPostsForAdmin } from '@/lib/admin/posts';
import type { PostStatus, PostType } from '@/domain/models/post';
import { DeletePostButton } from '@/presentation/components/admin/DeletePostButton';
import { formatDate } from '@/presentation/utils/formatDate';
// El mismo mapeo tipo -> color que ya usan PostCard y MarkdownArticle
// en el sitio público — así el color de "Poema" es el mismo en todos
// lados, en vez de inventar una paleta nueva solo para el admin.
import { getPostTypeMeta } from '@/presentation/utils/postTypeMeta';
import styles from './page.module.css';

interface PageProps {
  searchParams: Promise<{ type?: string; status?: string }>;
}

const TYPE_LABELS: Record<PostType, string> = {
  poema: 'Poema',
  reflexion: 'Reflexión',
  novela: 'Novela',
};

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
};

export default async function AdminHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const typeFilter = params.type as PostType | undefined;
  const statusFilter = params.status as PostStatus | undefined;

  const posts = await listPostsForAdmin({
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Posts</h1>
        <Link href="/admin/posts/new" className={styles.newButton}>
          + Nuevo post
        </Link>
      </div>

      <form method="get" className={styles.filters}>
        <select name="type" defaultValue={typeFilter ?? ''} className={styles.select}>
          <option value="">Todos los tipos</option>
          <option value="poema">Poema</option>
          <option value="reflexion">Reflexión</option>
          <option value="novela">Novela</option>
        </select>
        <select name="status" defaultValue={statusFilter ?? ''} className={styles.select}>
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
        <button type="submit" className={styles.filterButton}>
          Filtrar
        </button>
      </form>

      {posts.length === 0 ? (
        <p className={styles.empty}>No hay posts que coincidan con este filtro.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <span
                    className={styles.typeBadge}
                    style={{ '--type-accent': `var(${getPostTypeMeta(post.type).accentVar})` } as CSSProperties}
                  >
                    {TYPE_LABELS[post.type]}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${post.status === 'published' ? styles.published : styles.draft}`}>
                    {STATUS_LABELS[post.status]}
                  </span>
                </td>
                <td>{formatDate(post.createdAt)}</td>
                <td className={styles.actions}>
                  <Link href={`/admin/posts/${post.id}/edit`} className={styles.editLink}>
                    Editar
                  </Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
