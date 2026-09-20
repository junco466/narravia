'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/auth/dal';
import { deleteContactMessageRecord } from '@/lib/engagement';

export async function deleteMessage(formData: FormData) {
  await verifySession();

  const id = Number(formData.get('id'));
  if (Number.isInteger(id)) {
    await deleteContactMessageRecord(id);
  }

  revalidatePath('/admin/messages');
}
