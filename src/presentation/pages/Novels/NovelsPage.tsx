import { CategoryIntro } from '@/presentation/components/CategoryIntro/CategoryIntro';
import { ErrorState } from '@/presentation/components/ErrorState/ErrorState';
import { LoadingState } from '@/presentation/components/LoadingState/LoadingState';
import { NovelCard } from '@/presentation/components/NovelCard/NovelCard';
import { useNovelSummaries } from '@/presentation/hooks/useNovelSummaries';
import styles from '@/presentation/pages/Novels/NovelsPage.module.css';

export const NovelsPage = () => {
  const { data: novels, loading, error, reload } = useNovelSummaries();

  if (loading) {
    return <LoadingState label="Organizando las novelas..." />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={reload} />;
  }

  return (
    <div className={styles.page}>
      <CategoryIntro
        eyebrow="Novelas"
        title="Narrativas serializadas con estructura estable."
        description="La vista agrupa capítulos a partir de metadata, no por acoplamiento con la UI. El backend podrá entregar la misma forma sin alterar las páginas."
      />

      <section className={styles.list}>
        {(novels ?? []).map((novel) => (
          <NovelCard key={novel.seriesSlug} novel={novel} />
        ))}
      </section>
    </div>
  );
};
