import type { ReactNode } from 'react';
import styles from '@/presentation/components/ContentList/ContentList.module.css';

interface ContentListProps {
  title?: string;
  children: ReactNode;
}

export const ContentList = ({ title, children }: ContentListProps) => {
  return (
    <section className={styles.section}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <div className={styles.grid}>{children}</div>
    </section>
  );
};
