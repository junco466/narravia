// Tarjeta de resumen de un post (poema, novela o reflexión) para listados.
// Nota de aprendizaje: este componente NO tiene 'use client' arriba.
// No usa hooks ni estado, así que Next lo deja como Server Component:
// se renderiza en el servidor y se manda como HTML ya listo, sin JS extra
// para este componente en particular (más liviano para el navegador).

import Link from 'next/link'; // en Vite era { Link } from 'react-router-dom'
import type { CSSProperties } from 'react';
import type { Post } from '@/domain/models/post';
import { formatDate } from '@/presentation/utils/formatDate';
import { getReadingTime } from '@/presentation/utils/getReadingTime';
import { getPostTypeMeta } from '@/presentation/utils/postTypeMeta';
import styles from '@/presentation/components/PostCard/PostCard.module.css';

interface PostCardProps {
  post: Post;
}

// Decide a qué URL debe llevar la tarjeta según el tipo de contenido.
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
      // Variables CSS calculadas en JS (el color de acento depende del tipo de post)
      style={{ '--card-accent': `var(${typeMeta.accentVar})`, '--card-accent-soft': `var(${typeMeta.accentSoftVar})` } as CSSProperties}
    >
      <div className={styles.meta}>
        <span className={styles.typeTag}>{typeMeta.label}</span>
        <span>{formatDate(post.createdAt)}</span>
        <span>{getReadingTime(post.content)} min de lectura</span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      {/* next/link también usa "href" (no "to" como React Router) */}
      <Link className={styles.link} href={getHref(post)}>
        Leer <span className={styles.arrow} aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
};
