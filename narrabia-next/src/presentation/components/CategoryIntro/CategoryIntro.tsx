import styles from '@/presentation/components/CategoryIntro/CategoryIntro.module.css';

interface CategoryIntroProps {
  eyebrow: string;
  title: string;
  // Autor de la cita (opcional). Si viene, se muestra en su propia línea,
  // con el mismo estilo que "-Fernando Gonzales" en el Home — antes iba
  // pegado al final del "title" como texto plano, por eso se veía junto
  // al resto de la frase en vez de aparte.
  author?: string;
  description: string;
}

export const CategoryIntro = ({ eyebrow, title, author, description }: CategoryIntroProps) => {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      {author ? <cite className={styles.author}>-{author}</cite> : null}
      <p className={styles.description}>{description}</p>
    </section>
  );
};
