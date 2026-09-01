// Formulario compartido para crear Y editar posts. 'use client' porque
// necesita useState (para armar el preview en vivo mientras escribes)
// y useActionState (para mostrar errores de validación del servidor).
//
// La idea del preview: NO estamos re-implementando cómo se ve un post
// — construimos un objeto Post "de mentira" con lo que hay en el
// formulario ahora mismo, y se lo pasamos al MISMO componente
// (MarkdownArticle) que usa el blog público. Si el diseño del blog
// cambia algún día, el preview del admin cambia solo, gratis.
'use client';

import { useActionState, useState } from 'react';
import type { Post, PostStatus, PostType } from '@/domain/models/post';
import { MarkdownArticle } from '@/presentation/components/MarkdownArticle/MarkdownArticle';
import type { PostFormState } from '@/app/admin/(protected)/posts/actions';
import styles from './PostForm.module.css';

interface PostFormProps {
  action: (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;
  initialPost?: Post;
  submitLabel: string;
}

const initialState: PostFormState = {};

export const PostForm = ({ action, initialPost, submitLabel }: PostFormProps) => {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Estado "espejo" de los campos que afectan al preview. No hace
  // falta espejar TODOS los campos (por ejemplo seoDescription no se
  // ve en el preview) — solo los que MarkdownArticle realmente usa.
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [type, setType] = useState<PostType>(initialPost?.type ?? 'poema');
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [coverQuote, setCoverQuote] = useState(initialPost?.coverQuote ?? '');

  const previewPost: Post = {
    id: 'preview',
    title: title || 'Título del post',
    type,
    content: content || '_Escribe el contenido para verlo aquí..._',
    createdAt: initialPost?.createdAt ?? new Date().toISOString(),
    coverQuote: coverQuote || undefined,
    status: initialPost?.status ?? 'draft',
    tags: initialPost?.tags ?? [],
    seriesSlug: initialPost?.seriesSlug,
    seriesTitle: initialPost?.seriesTitle,
    chapterNumber: initialPost?.chapterNumber,
    chapterTitle: initialPost?.chapterTitle,
  };

  return (
    <div className={styles.layout}>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          <span>Título</span>
          <input
            name="title"
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Tipo</span>
            <select name="type" value={type} onChange={(event) => setType(event.target.value as PostType)}>
              <option value="poema">Poema</option>
              <option value="reflexion">Reflexión</option>
              <option value="novela">Novela</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Estado</span>
            <select name="status" defaultValue={initialPost?.status ?? 'draft'}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </label>
        </div>

        {type === 'novela' ? (
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Slug de la serie (ej. despertando)</span>
              <input name="seriesSlug" type="text" defaultValue={initialPost?.seriesSlug ?? ''} />
            </label>
            <label className={styles.field}>
              <span>Título de la serie</span>
              <input name="seriesTitle" type="text" defaultValue={initialPost?.seriesTitle ?? ''} />
            </label>
          </div>
        ) : null}

        {type === 'novela' ? (
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Número de capítulo</span>
              <input name="chapterNumber" type="number" defaultValue={initialPost?.chapterNumber ?? ''} />
            </label>
            <label className={styles.field}>
              <span>Título del capítulo</span>
              <input name="chapterTitle" type="text" defaultValue={initialPost?.chapterTitle ?? ''} />
            </label>
          </div>
        ) : null}

        <label className={styles.field}>
          <span>Tags (separados por coma)</span>
          <input name="tags" type="text" defaultValue={initialPost?.tags.join(', ') ?? ''} />
        </label>

        <label className={styles.field}>
          <span>Cita destacada (opcional)</span>
          <input
            name="coverQuote"
            type="text"
            value={coverQuote}
            onChange={(event) => setCoverQuote(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Extracto (opcional — si lo dejas vacío, se genera solo)</span>
          <textarea name="excerpt" rows={2} defaultValue={initialPost?.excerpt ?? ''} />
        </label>

        <label className={styles.field}>
          <span>Descripción SEO (opcional)</span>
          <textarea name="seoDescription" rows={2} defaultValue={initialPost?.seoDescription ?? ''} />
        </label>

        <label className={styles.field}>
          <span>Contenido (Markdown)</span>
          <textarea
            name="content"
            rows={16}
            required
            className={styles.contentArea}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>

        {state.error ? (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        ) : null}

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Guardando…' : submitLabel}
        </button>
      </form>

      <div className={styles.preview}>
        <p className={styles.previewLabel}>Vista previa</p>
        <div className={styles.previewFrame}>
          <MarkdownArticle post={previewPost} />
        </div>
      </div>
    </div>
  );
};
