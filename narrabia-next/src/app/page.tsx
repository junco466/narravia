// Página de inicio ("/"). En Next, un archivo page.tsx dentro de app/
// ES la ruta — no hay un router central como en Vite.
//
// Es un Server Component (no tiene 'use client', y además es "async"):
// se ejecuta en el servidor, espera los datos con await, y solo entonces
// manda el HTML ya armado al navegador. Por eso NO hay estado de
// "loading" ni "error" como en el usePosts() de la versión Vite: aquí
// no hace falta, porque el usuario nunca ve la página a medio cargar.

import Link from 'next/link';
import { serviceLocator } from '@/lib/serviceLocator';
import { ContentList } from '@/presentation/components/ContentList/ContentList';
import { PostCard } from '@/presentation/components/PostCard/PostCard';
import styles from './page.module.css';

export default async function HomePage() {
  // await directo: el servidor espera este dato antes de seguir.
  const posts = await serviceLocator.postQueryService.getAll();
  // Mismo recorte que en la versión Vite: solo los 3 más recientes.
  const featured = posts.slice(0, 3);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Literatura contemporánea</p>
          <blockquote className={styles.fernando}>
            <h1 className={styles.title}>
              &quot;El fin de la vida es adquirir capacidad para morir alegremente&quot;
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
          {/* next/link usa "href", no "to" como React Router */}
          <Link className={styles.primaryAction} href="/poemas">
            Explorar poemas <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link className={styles.secondaryAction} href="/novelas">
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
}
