import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { Post } from '@/domain/models/post';
import { formatDate } from '@/presentation/utils/formatDate';
import { getReadingTime } from '@/presentation/utils/getReadingTime';
import { getPostTypeMeta } from '@/presentation/utils/postTypeMeta';
import styles from '@/presentation/components/PostCard/PostCard.module.css';

interface PostCardProps {
  post: Post;
}

const getHref = (post: Post) => {
  if (post.type === 'poema') {
    return `/poemas/${post.id}`;
  }

  if (post.type === 'reflexion') {
    return `/reflexiones/${post.id}`;
  }

  if (post.type === 'novela') {
    return `/novelas/${post.seriesSlug}`;
  }

  return '/';
};

export const PostCard = ({ post }: PostCardProps) => {
  const typeMeta = getPostTypeMeta(post.type);

  return (
    <article
      className={styles.card}
      style={{ '--card-accent': `var(${typeMeta.accentVar})`, '--card-accent-soft': `var(${typeMeta.accentSoftVar})` } as CSSProperties}
    >
      <div className={styles.meta}>
        <span className={styles.typeTag}>{typeMeta.label}</span>
        <span>{formatDate(post.createdAt)}</span>
        <span>{getReadingTime(post.content)} min de lectura</span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <Link className={styles.link} to={getHref(post)}>
        Leer <span className={styles.arrow} aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
};
