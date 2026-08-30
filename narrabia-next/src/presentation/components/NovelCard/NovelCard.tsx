// Tarjeta de una novela (agrupa todos sus capítulos en una sola serie).
// Igual que PostCard: sin hooks, así que sigue siendo Server Component.

import Link from 'next/link';
import type { NovelSummary } from '@/domain/models/post';
import { formatDate } from '@/presentation/utils/formatDate';
import styles from '@/presentation/components/NovelCard/NovelCard.module.css';

interface NovelCardProps {
  novel: NovelSummary;
}

export const NovelCard = ({ novel }: NovelCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.typeTag}>Novela</span>
        <span>{novel.chapters.length} capítulos</span>
        <span>Actualizada el {formatDate(novel.updatedAt)}</span>
      </div>
      <h2 className={styles.title}>{novel.seriesTitle}</h2>
      <p className={styles.description}>{novel.description}</p>
      <Link className={styles.link} href={`/novelas/${novel.seriesSlug}`}>
        Abrir novela <span className={styles.arrow} aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
};
