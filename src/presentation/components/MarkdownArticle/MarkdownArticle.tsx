// Muestra un post completo: encabezado + cuerpo en Markdown.
// Server Component (sin 'use client'): no tiene estado ni eventos,
// solo transforma props en HTML — no necesita nada del navegador.

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { CSSProperties } from 'react';
import type { Post } from '@/domain/models/post';
import { formatDate } from '@/presentation/utils/formatDate';
import { getReadingTime } from '@/presentation/utils/getReadingTime';
import { getPostTypeMeta } from '@/presentation/utils/postTypeMeta';
import { splitPoemColumns } from '@/presentation/utils/splitPoemColumns';
import styles from '@/presentation/components/MarkdownArticle/MarkdownArticle.module.css';

interface MarkdownArticleProps {
  post: Post;
}

export const MarkdownArticle = ({ post }: MarkdownArticleProps) => {
  const typeMeta = getPostTypeMeta(post.type);
  const isPoem = post.type === 'poema';
  // Sin useMemo: en un Server Component esto se calcula una sola vez
  // de todos modos (no hay re-renders que memoizar).
  const poemColumns = isPoem ? splitPoemColumns(post.content) : null;

  return (
    <article
      className={`${styles.article} ${isPoem ? styles.articlePoem : ''}`.trim()}
      style={{ '--article-accent': `var(${typeMeta.accentVar})` } as CSSProperties}
    >
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.typeTag}>{typeMeta.label}</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>{getReadingTime(post.content)} min de lectura</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        {post.coverQuote ? (
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            {post.coverQuote}
          </blockquote>
        ) : null}
      </header>

      {isPoem ? (
        <div className={styles.poemPage}>
          {poemColumns ? (
            <div className={styles.poemGrid}>
              <div className={`${styles.body} ${styles.poemBody} ${styles.poemColumn}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{poemColumns[0]}</ReactMarkdown>
              </div>
              <div className={`${styles.body} ${styles.poemBody} ${styles.poemColumn}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{poemColumns[1]}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className={`${styles.body} ${styles.poemBody} ${styles.poemColumn}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.body}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      )}
    </article>
  );
};
