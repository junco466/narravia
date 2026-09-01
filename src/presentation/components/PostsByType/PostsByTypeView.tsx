// Vista compartida para /poemas y /reflexiones.
// La reutilizamos en dos rutas distintas de la misma forma que en Vite
// se reutilizaba <PostsByTypePage type="..." /> — la diferencia es que
// aquí, como es un Server Component, puede ser "async" y traer sus
// propios datos directamente (no recibe los posts por props).

import type { PostType } from '@/domain/models/post';
import { serviceLocator } from '@/lib/serviceLocator';
import { CategoryIntro } from '@/presentation/components/CategoryIntro/CategoryIntro';
import { ContentList } from '@/presentation/components/ContentList/ContentList';
import { PostCard } from '@/presentation/components/PostCard/PostCard';

interface PostsByTypeViewProps {
  type: PostType;
}

// Textos fijos de cada categoría (igual que en la versión Vite).
// "author" es opcional: solo la cita de poemas tiene una atribución.
const copyMap: Record<PostType, { eyebrow: string; title: string; author?: string; description: string }> = {
  poema: {
    eyebrow: 'Poemas',
    title: 'Hacer versos malos depara más felicidad que leer los versos más bellos.',
    author: 'Herman Hesse',
    description:
      'El ser humano encuentra sentido a la vida a través de los sentimientos y las emociones. El amor, el odio, la tristeza, la melancolía… emociones que dan sustancia a cada una de nuestras acciones. Y eso es la poesía: la expresión íntima y bella de todo cuanto se siente.',
  },
  reflexion: {
    eyebrow: 'Reflexiones',
    title: 'Reflexionar es no perder la capacidad de asombro',
    description:
      'Haz tuyo el conocimiento y el entendimiento. Solo cuando nos permitimos hacer una pausa en medio de este mundo ajetreado, logramos asimilar verdaderamente lo aprendido y desarrollar una postura crítica frente a lo vivido.',
  },
  novela: {
    eyebrow: 'Novelas',
    title: 'El alma del escritor vive en sus textos',
    description:
      'Espero encuentres en estas paginas algo que para ti valga la pena leer, pues aqui encontraras un parte de mi que se esfuerza por ser escuchada.',
  },
};

export const PostsByTypeView = async ({ type }: PostsByTypeViewProps) => {
  const posts = await serviceLocator.postQueryService.getByCategory(type);
  const copy = copyMap[type];

  return (
    <div>
      <CategoryIntro eyebrow={copy.eyebrow} title={copy.title} author={copy.author} description={copy.description} />
      <ContentList>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ContentList>
    </div>
  );
};
