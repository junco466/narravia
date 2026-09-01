// Carpeta "poemas/" + archivo page.tsx = ruta "/poemas".
// Solo le decimos a la vista compartida qué tipo de contenido traer.

import { PostsByTypeView } from '@/presentation/components/PostsByType/PostsByTypeView';

// Ver la explicación completa en app/page.tsx: sin esto, el build
// intenta leer la base de datos en build-time y falla.
export const dynamic = 'force-dynamic';

export default function PoemasPage() {
  return <PostsByTypeView type="poema" />;
}
