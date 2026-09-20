// Bloque de "me gusta" + comentarios que va debajo de cada post.
// Es Client Component porque reacciona a clics y envía formularios sin
// recargar la página. Recibe solo el id del post y pide sus datos al
// servidor al montarse (Server Actions en app/actions/engagement.ts).
// Al usarse con key={postId}, en las novelas React lo reinicia solo al
// cambiar de capítulo.
'use client';

import { useEffect, useState, useTransition } from 'react';
import type { EngagementState } from '@/lib/engagement';
import { loadEngagement, submitCommentAction, toggleLikeAction } from '@/app/actions/engagement';
import { EMAIL_PATTERN } from '@/lib/validation';
import { formatDate } from '@/presentation/utils/formatDate';
import styles from './PostEngagement.module.css';

interface PostEngagementProps {
  postId: string;
}

export const PostEngagement = ({ postId }: PostEngagementProps) => {
  const [state, setState] = useState<EngagementState | null>(null);
  const [error, setError] = useState<string | null>(null);
  // useTransition da un "pending" mientras corre una Server Action.
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    loadEngagement(postId).then((data) => {
      // "cancelled" evita pintar datos de un post anterior si el
      // visitante cambió de capítulo antes de que llegara la respuesta.
      if (!cancelled) setState(data);
    });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleLike = () => {
    if (!state) return;
    // Actualización optimista: cambiamos la UI YA y luego la
    // confirmamos con la respuesta real del servidor.
    setState({ ...state, liked: !state.liked, likeCount: state.likeCount + (state.liked ? -1 : 1) });
    startTransition(async () => {
      setState(await toggleLikeAction(postId));
    });
  };

  // onSubmit en vez de action={...}: así el formulario NO se vacía solo
  // cuando el servidor rechaza el comentario (React 19 lo haría).
  const handleComment = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    setError(null);
    startTransition(async () => {
      const result = await submitCommentAction(postId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.state) setState(result.state);
      // Vaciamos el formulario solo si el comentario se guardó.
      form.reset();
    });
  };

  return (
    <section className={styles.wrapper} aria-label="Me gusta y comentarios">
      <button
        type="button"
        className={`${styles.like} ${state?.liked ? styles.liked : ''}`.trim()}
        onClick={handleLike}
        disabled={!state}
        aria-pressed={state?.liked ?? false}
      >
        <span aria-hidden="true">{state?.liked ? '♥' : '♡'}</span>
        <span>{state?.liked ? 'Te gustó' : 'Me gusta'}</span>
        <span className={styles.count}>{state?.likeCount ?? 0}</span>
      </button>

      <h2 className={styles.heading}>Comentarios{state ? ` (${state.comments.length})` : ''}</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleComment(event.currentTarget);
        }}
        className={styles.form}
      >
        {/* Campo trampa anti-bots: oculto para personas (ver CSS). */}
        <div className={styles.trap} aria-hidden="true">
          <label>
            No llenar
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Nombre</span>
            <input name="authorName" type="text" required maxLength={60} />
          </label>
          <label className={styles.field}>
            <span>Correo (opcional, no se muestra)</span>
            <input
              name="authorEmail"
              type="email"
              pattern={EMAIL_PATTERN}
              title="Un correo válido, como nombre@dominio.com"
              maxLength={120}
            />
          </label>
        </div>
        <label className={styles.field}>
          <span>Tu comentario</span>
          <textarea name="body" rows={3} required maxLength={1000} />
        </label>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Enviando…' : 'Comentar'}
        </button>
      </form>

      {state && state.comments.length === 0 ? <p className={styles.empty}>Sé la primera persona en comentar.</p> : null}

      <ul className={styles.list}>
        {state?.comments.map((comment) => (
          <li key={comment.id} className={styles.comment}>
            <p className={styles.commentMeta}>
              <strong>{comment.authorName}</strong> · {formatDate(comment.createdAt)}
            </p>
            {/* React escapa el texto: un comentario con <script> se
                muestra como texto, nunca se ejecuta. */}
            <p className={styles.commentBody}>{comment.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
