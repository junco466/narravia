// Ruta "/novelas": lista de series (no de capítulos sueltos).

import { serviceLocator } from '@/lib/serviceLocator';
import { CategoryIntro } from '@/presentation/components/CategoryIntro/CategoryIntro';
import { NovelCard } from '@/presentation/components/NovelCard/NovelCard';
import styles from './page.module.css';

export default async function NovelasPage() {
  // getNovelSummaries() agrupa los capítulos por serie (seriesSlug),
  // esa lógica de agrupación vive en PostQueryService y no cambió nada.
  const novels = await serviceLocator.postQueryService.getNovelSummaries();

  return (
    <div className={styles.page}>
      <CategoryIntro
        eyebrow="Novelas"
        title="El alma del escritor vive en sus textos"
        description="Espero encuentres en estas paginas algo que para ti valga la pena leer, pues aqui encontraras un parte de mi que se esfuerza por ser escuchada."
      />

      <section className={styles.list}>
        {novels.map((novel) => (
          <NovelCard key={novel.seriesSlug} novel={novel} />
        ))}
      </section>
    </div>
  );
}
