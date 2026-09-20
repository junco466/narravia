// Moderación posterior: los comentarios ya están publicados; aquí los
// revisas (más nuevos primero) y borras los que no quieras. Es
// force-dynamic para ver siempre los comentarios recién llegados.
import Link from 'next/link';
import { listCommentsForAdmin } from '@/lib/engagement';
import { DeleteCommentButton } from '@/presentation/components/admin/DeleteCommentButton';
import { formatDate } from '@/presentation/utils/formatDate';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

// Novelas se leen en /novelas/<serie>; poemas y reflexiones en su ruta.
const postHref = (post: { id: string; type: string; seriesSlug: string | null }): string => {
  if (post.type === 'novela') return `/novelas/${post.seriesSlug ?? ''}`;
  return `/${post.type === 'poema' ? 'poemas' : 'reflexiones'}/${post.id}`;
};

export default async function AdminCommentsPage() {
  const comments = await listCommentsForAdmin();

  return (
    <div>
      <h1 className={styles.title}>Comentarios</h1>
      {comments.length === 0 ? (
        <p className={styles.empty}>Aún no hay comentarios.</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.item}>
              <div className={styles.head}>
                <span>
                  <strong>{comment.authorName}</strong>
                  {comment.authorEmail ? <span className={styles.muted}> · {comment.authorEmail}</span> : null}
                  <span className={styles.muted}> · {formatDate(comment.createdAt.toISOString())}</span>
                </span>
                <DeleteCommentButton id={comment.id} />
              </div>
              <p className={styles.body}>{comment.body}</p>
              <Link href={postHref(comment.post)} className={styles.postLink}>
                en «{comment.post.title}»
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
