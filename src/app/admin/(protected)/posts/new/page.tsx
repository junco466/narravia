import { PostForm } from '@/presentation/components/admin/PostForm';
import { createPost } from '@/app/admin/(protected)/posts/actions';

export default function NewPostPage() {
  return (
    <div>
      <h1>Nuevo post</h1>
      <PostForm action={createPost} submitLabel="Crear post" />
    </div>
  );
}
