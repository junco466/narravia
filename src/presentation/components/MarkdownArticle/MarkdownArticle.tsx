import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMemo, type CSSProperties } from 'react';
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
  const poemColumns = useMemo(() => (isPoem ? splitPoemColumns(post.content) : null), [isPoem, post.content]);

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
