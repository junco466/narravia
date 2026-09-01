// Este SÍ es un Client Component real ('use client'): necesita useState
// para recordar qué capítulo está abierto y reaccionar a clics, sin
// recargar la página ni cambiar de URL. Recibe los datos ya cargados
// por el servidor como prop — no vuelve a pedirlos él mismo.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NovelSummary } from '@/domain/models/post';
import { MarkdownArticle } from '@/presentation/components/MarkdownArticle/MarkdownArticle';
import styles from '@/presentation/components/NovelReader/NovelReader.module.css';

interface NovelReaderProps {
  novel: NovelSummary;
}

export const NovelReader = ({ novel }: NovelReaderProps) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const activeChapter =
    novel.chapters.find((chapter) => chapter.id === selectedChapterId) ?? novel.chapters[0] ?? null;

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Link className={styles.back} href="/novelas">
          <span aria-hidden="true">&larr;</span> Volver a novelas
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
