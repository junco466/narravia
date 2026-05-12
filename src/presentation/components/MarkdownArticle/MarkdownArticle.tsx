import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Post } from '@/domain/models/post';
import { formatDate } from '@/presentation/utils/formatDate';
import { getReadingTime } from '@/presentation/utils/getReadingTime';
import styles from '@/presentation/components/MarkdownArticle/MarkdownArticle.module.css';

interface MarkdownArticleProps {
  post: Post;
}

export const MarkdownArticle = ({ post }: MarkdownArticleProps) => {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span>{formatDate(post.createdAt)}</span>
          <span>{getReadingTime(post.content)} min de lectura</span>
          <span>{post.type}</span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        {post.coverQuote ? <blockquote className={styles.quote}>{post.coverQuote}</blockquote> : null}
      </header>

      <div className={styles.body}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
};
