import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '@/presentation/components/ErrorState/ErrorState';
import { LoadingState } from '@/presentation/components/LoadingState/LoadingState';
import { MarkdownArticle } from '@/presentation/components/MarkdownArticle/MarkdownArticle';
import { useNovel } from '@/presentation/hooks/useNovel';
import styles from '@/presentation/pages/NovelDetail/NovelDetailPage.module.css';

export const NovelDetailPage = () => {
  const { seriesSlug = '' } = useParams();
  const { data: novel, loading, error, reload } = useNovel(seriesSlug);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  if (loading) {
    return <LoadingState label="Abriendo la novela..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={reload} />;
  }

  if (!novel) {
    return <ErrorState title="Novela no encontrada" />;
  }

  const activeChapter =
    novel.chapters.find((chapter) => chapter.id === selectedChapterId) ?? novel.chapters[0] ?? null;

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Link className={styles.back} to="/novelas">
          ← Volver a novelas
        </Link>
        <p className={styles.eyebrow}>Novela</p>
        <h1 className={styles.title}>{novel.seriesTitle}</h1>
        <p className={styles.description}>{novel.description}</p>

        <ol className={styles.chapters}>
          {novel.chapters.map((chapter) => {
            const isActive = chapter.id === activeChapter?.id;

            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  className={`${styles.chapterButton} ${isActive ? styles.active : ''}`.trim()}
                  onClick={() => setSelectedChapterId(chapter.id)}
                >
                  <span>Capítulo {chapter.chapterNumber ?? chapter.order}</span>
                  <strong>{chapter.chapterTitle ?? chapter.title}</strong>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className={styles.reader}>{activeChapter ? <MarkdownArticle post={activeChapter} /> : null}</section>
    </div>
  );
};
