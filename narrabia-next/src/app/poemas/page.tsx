// Carpeta "poemas/" + archivo page.tsx = ruta "/poemas".
// Solo le decimos a la vista compartida qué tipo de contenido traer.

import { PostsByTypeView } from '@/presentation/components/PostsByType/PostsByTypeView';

export default function PoemasPage() {
  return <PostsByTypeView type="poema" />;
}
