import type { PostType } from '@/domain/models/post';
import { CategoryIntro } from '@/presentation/components/CategoryIntro/CategoryIntro';
import { ContentList } from '@/presentation/components/ContentList/ContentList';
import { ErrorState } from '@/presentation/components/ErrorState/ErrorState';
import { LoadingState } from '@/presentation/components/LoadingState/LoadingState';
import { PostCard } from '@/presentation/components/PostCard/PostCard';
import { usePosts } from '@/presentation/hooks/usePosts';

interface PostsByTypePageProps {
  type: PostType;
}

const copyMap: Record<PostType, { eyebrow: string; title: string; description: string }> = {
  poema: {
    eyebrow: 'Poemas',
    title: 'Textos breves con emociones fuertes',
    description: 'Una colección de piezas para parar la vida por un minuto',
  },
  reflexion: {
    eyebrow: 'Reflexiones',
    title: 'Ensayos íntimos y pensamientos abiertos.',
    description: 'Textos donde la observación personal y la memoria dialogan con el presente.',
  },
  novela: {
    eyebrow: 'Novelas',
    title: 'Historias extensas, construidas capítulo a capítulo.',
    description: 'Narrativas serializadas con estructura preparada para crecer sin alterar la UI.',
  },
};

export const PostsByTypePage = ({ type }: PostsByTypePageProps) => {
  const { data: posts, loading, error, reload } = usePosts(type);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={reload} />;
  }

  const copy = copyMap[type];

  return (
    <div>
      <CategoryIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <ContentList>
        {(posts ?? []).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ContentList>
    </div>
  );
};
