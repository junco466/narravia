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
    title: 'Hacer versos malos depara más felicidad que leer los versos más bellos.  - Herman Hesse',
    description: 'El ser humano encuentra sentido a la vida a través de los sentimientos y las emociones. El amor, el odio, la tristeza, la melancolía… emociones que dan sustancia a cada una de nuestras acciones. Y eso es la poesía: la expresión íntima y bella de todo cuanto se siente.',
  },
  reflexion: {
    eyebrow: 'Reflexiones',
    title: 'Ensayos y pensamientos abiertos.',
    description: 'Textos donde la observación personal y la memoria dialogan con el presente.',
  },
  novela: {
    eyebrow: 'Novelas',
    title: 'El alma del escritor vive en sus textos',
    description: 'Espero encuentres en estas paginas algo que para ti valga la pena leer, pues aqui encontraras un parte de mi que se esfuerza por ser escuchada.',
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
