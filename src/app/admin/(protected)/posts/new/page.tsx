import { PostForm } from '@/presentation/components/admin/PostForm';
import { createPost } from '@/app/admin/(protected)/posts/actions';
import { listNovelSeries } from '@/lib/admin/posts';

export default async function NewPostPage() {
  const existingSeries = await listNovelSeries();

  return (
    <div>
      <h1>Nuevo post</h1>
      <PostForm action={createPost} submitLabel="Crear post" existingSeries={existingSeries} />
    </div>
  );
}
