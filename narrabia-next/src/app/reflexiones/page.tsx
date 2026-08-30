// Carpeta "reflexiones/" + page.tsx = ruta "/reflexiones".
// Mismo patrón que /poemas, solo cambia el "type" que le pasamos.

import { PostsByTypeView } from '@/presentation/components/PostsByType/PostsByTypeView';

export default function ReflexionesPage() {
  return <PostsByTypeView type="reflexion" />;
}
