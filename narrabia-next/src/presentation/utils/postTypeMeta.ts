import type { PostType } from '@/domain/models/post';

interface PostTypeMeta {
  label: string;
  accentVar: string;
  accentSoftVar: string;
}

const POST_TYPE_META: Record<PostType, PostTypeMeta> = {
  poema: { label: 'Poema', accentVar: '--accent', accentSoftVar: '--accent-soft' },
  reflexion: { label: 'Reflexión', accentVar: '--accent-3', accentSoftVar: '--accent-3-soft' },
  novela: { label: 'Novela', accentVar: '--accent-2', accentSoftVar: '--accent-2-soft' },
};

export const getPostTypeMeta = (type: PostType): PostTypeMeta => POST_TYPE_META[type];
