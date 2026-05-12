import styles from '@/presentation/components/CategoryIntro/CategoryIntro.module.css';

interface CategoryIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export const CategoryIntro = ({ eyebrow, title, description }: CategoryIntroProps) => {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </section>
  );
};
