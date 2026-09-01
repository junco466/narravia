// Server Component: trae el post real de la base de datos y se lo
// pasa ya listo al formulario (Client Component). updatePost.bind(null, id)
// "pre-llena" el primer argumento de la Server Action con el id de
// este post — así PostForm no necesita saber el id para nada, solo
// llama a la función que le dieron con (prevState, formData), como
// cualquier otra Server Action.
import { notFound } from 'next/navigation';
import { getPostForAdmin, listNovelSeries } from '@/lib/admin/posts';
import { updatePost } from '@/app/admin/(protected)/posts/actions';
import { PostForm } from '@/presentation/components/admin/PostForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, existingSeries] = await Promise.all([getPostForAdmin(id), listNovelSeries()]);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1>Editar post</h1>
      <PostForm
        action={updatePost.bind(null, id)}
        initialPost={post}
        submitLabel="Guardar cambios"
        existingSeries={existingSeries}
      />
    </div>
  );
}
