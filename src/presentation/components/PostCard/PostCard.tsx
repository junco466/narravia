import { Link } from 'react-router-dom';
import type { Post } from '@/domain/models/post';
import { formatDate } from '@/presentation/utils/formatDate';
import { getReadingTime } from '@/presentation/utils/getReadingTime';
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
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span>{formatDate(post.createdAt)}</span>
        <span>{getReadingTime(post.content)} min de lectura</span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <Link className={styles.link} to={getHref(post)}>
        Leer
      </Link>
    </article>
  );
};
