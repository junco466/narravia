'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/auth/dal';
import { deleteCommentRecord } from '@/lib/engagement';

export async function deleteComment(formData: FormData) {
  // Cada Server Action es un endpoint público: se verifica sesión SIEMPRE.
  await verifySession();

  const id = Number(formData.get('id'));
  if (Number.isInteger(id)) {
    await deleteCommentRecord(id);
  }

  // Vuelve a pintar la lista sin el comentario borrado.
  revalidatePath('/admin/comments');
}
