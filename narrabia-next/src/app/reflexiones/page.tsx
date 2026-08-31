// Carpeta "reflexiones/" + page.tsx = ruta "/reflexiones".
// Mismo patrón que /poemas, solo cambia el "type" que le pasamos.

import { PostsByTypeView } from '@/presentation/components/PostsByType/PostsByTypeView';

// Ver la explicación completa en app/page.tsx.
export const dynamic = 'force-dynamic';

export default function ReflexionesPage() {
  return <PostsByTypeView type="reflexion" />;
}
