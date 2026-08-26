import { Link } from "react-router-dom";
import { usePosts } from "@/presentation/hooks/usePosts";
import { LoadingState } from "@/presentation/components/LoadingState/LoadingState";
import { ErrorState } from "@/presentation/components/ErrorState/ErrorState";
import { ContentList } from "@/presentation/components/ContentList/ContentList";
import { PostCard } from "@/presentation/components/PostCard/PostCard";
import styles from "@/presentation/pages/Home/HomePage.module.css";

export const HomePage = () => {
  const { data: posts, loading, error, reload } = usePosts();

  if (loading) {
    return <LoadingState label="Preparando la biblioteca..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={reload} />;
  }

  const featured = posts?.slice(0, 3) ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Literatura contemporánea</p>
          <blockquote className={styles.fernando}>
            <h1 className={styles.title}>
              "El fin de la vida es adquirir capacidad para morir alegremente"
            </h1>
            <cite className={styles.author}>-Fernando Gonzales</cite>
          </blockquote>
        </div>
        <aside className={styles.quoteCard}>
          <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
          <p>
            La palabra es un instrumento magico: en ella el escritor ama y
            comprende; le brinda la posibilidad de resolverse y salvarse; de
            reconciliarse con su destino humano de recorrer sus entrañas para
            conocerse y reconocerse.
          </p>
        </aside>
      </section>

      <section className={styles.callToAction}>
        <div className={styles.callToActionText}>
          <p className={`${styles.description} ${styles.dropCap}`}>
            Cree este espacio para desahogarme, para poder gritar en silencio.
          </p>
          <p className={styles.description}>
            No tiene un propósito más profundo que el de encontrar un lugar para
            mis propias ideas y pensamientos; por consiguiente, es un espacio para
            compartir quién soy y en quién me voy convirtiendo.
          </p>

          <p className={styles.description}>
            Cuando la vida se volvió un ciclo constante, un bucle infinito y un
            peso insoportable, la pequeña parte de mí que aún logra volver a su
            origen —a ese primer brote de vida donde todo es fácil y divertido—
            busca desesperadamente liberarse de su encierro, de su yugo.
          </p>

          <p className={styles.enphasis}>Miedo, vergüenza, ansiedad, duda.</p>

          <p className={styles.description}>
            Qué difícil es exponerse en este mundo que siempre tiene una opinión,
            donde ya no se analiza, se critica. Qué difícil es compartir estas
            emociones en las cuatro cortas líneas en las que el mundo aún tiene
            capacidad de leer con atención. Un mundo donde leer ya es
            revolucionario y escribir, un milagro.
          </p>

          <p className={styles.description}>
            Busco aceptarme tal como soy, como sé que soy; ya que saber es fácil,
            pero aceptar es una cosa totalmente distinta.
          </p>

          <p className={styles.description}>
            Escribo para no permanecer muerto, para no ser un muerto en vida, para
            probarme a mí mismo que, al menos, vivo un poco.
          </p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to="/poemas">
            Explorar poemas <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link className={styles.secondaryAction} to="/novelas">
            Entrar a las novelas <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      <ContentList title="Lecturas recientes">
        {featured.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ContentList>
    </div>
  );
};
