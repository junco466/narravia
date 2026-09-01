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
// "import type" desaparece por completo al compilar — es solo para
// que TypeScript conozca la forma del dato, no arrastra el archivo
// real (que tiene 'server-only') al paquete que llega al navegador.
import type { NovelSeriesOption } from '@/lib/admin/posts';
import styles from './PostForm.module.css';

const NEW_SERIES_VALUE = '__new__';

interface PostFormProps {
  action: (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;
  initialPost?: Post;
  submitLabel: string;
  existingSeries: NovelSeriesOption[];
}

const initialState: PostFormState = {};

export const PostForm = ({ action, initialPost, submitLabel, existingSeries }: PostFormProps) => {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Estado "espejo" de los campos que afectan al preview. No hace
  // falta espejar TODOS los campos (por ejemplo seoDescription no se
  // ve en el preview) — solo los que MarkdownArticle realmente usa.
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [type, setType] = useState<PostType>(initialPost?.type ?? 'poema');
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [coverQuote, setCoverQuote] = useState(initialPost?.coverQuote ?? '');

  // Serie: ¿el post que estamos editando pertenece a una serie que
  // sigue existiendo en la lista? Si sí, arrancamos en modo "elegir
  // de la lista". Si no hay ninguna serie todavia, no tiene sentido
  // mostrar un selector vacio — arrancamos directo en "nueva serie".
  const initialSeriesIsKnown = existingSeries.some((s) => s.seriesSlug === initialPost?.seriesSlug);
  const [seriesMode, setSeriesMode] = useState<'existing' | 'new'>(() => {
    if (initialPost?.seriesSlug) return initialSeriesIsKnown ? 'existing' : 'new';
    return existingSeries.length > 0 ? 'existing' : 'new';
  });
  const [seriesSlug, setSeriesSlug] = useState(
    initialPost?.seriesSlug ?? existingSeries[0]?.seriesSlug ?? '',
  );
  const [seriesTitle, setSeriesTitle] = useState(
    initialPost?.seriesTitle ?? existingSeries[0]?.seriesTitle ?? '',
  );

  const previewPost: Post = {
    id: 'preview',
    title: title || 'Título del post',
    type,
    content: content || '_Escribe el contenido para verlo aquí..._',
    createdAt: initialPost?.createdAt ?? new Date().toISOString(),
    coverQuote: coverQuote || undefined,
    status: initialPost?.status ?? 'draft',
    tags: initialPost?.tags ?? [],
    seriesSlug: seriesSlug || undefined,
    seriesTitle: seriesTitle || undefined,
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
          <div className={styles.field}>
            <span>Serie</span>
            <select
              value={seriesMode === 'new' ? NEW_SERIES_VALUE : seriesSlug}
              onChange={(event) => {
                const value = event.target.value;
                if (value === NEW_SERIES_VALUE) {
                  setSeriesMode('new');
                  setSeriesSlug('');
                  setSeriesTitle('');
                  return;
                }
                setSeriesMode('existing');
                setSeriesSlug(value);
                setSeriesTitle(existingSeries.find((s) => s.seriesSlug === value)?.seriesTitle ?? '');
              }}
            >
              {existingSeries.map((series) => (
                <option key={series.seriesSlug} value={series.seriesSlug}>
                  {series.seriesTitle}
                </option>
              ))}
              <option value={NEW_SERIES_VALUE}>+ Nueva serie</option>
            </select>
          </div>
        ) : null}

        {type === 'novela' && seriesMode === 'new' ? (
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Slug de la serie nueva (ej. despertando)</span>
              <input
                name="seriesSlug"
                type="text"
                value={seriesSlug}
                onChange={(event) => setSeriesSlug(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Título de la serie nueva</span>
              <input
                name="seriesTitle"
                type="text"
                value={seriesTitle}
                onChange={(event) => setSeriesTitle(event.target.value)}
              />
            </label>
          </div>
        ) : null}

        {/* Cuando eliges una serie existente, el slug/título no se
            escriben a mano — van como campos ocultos, ya fijados por
            la selección de arriba. Así el nombre siempre coincide
            exactamente con los capítulos anteriores de esa serie. */}
        {type === 'novela' && seriesMode === 'existing' ? (
          <>
            <input type="hidden" name="seriesSlug" value={seriesSlug} />
            <input type="hidden" name="seriesTitle" value={seriesTitle} />
          </>
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
