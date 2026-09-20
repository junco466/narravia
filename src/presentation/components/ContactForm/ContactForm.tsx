// Formulario de mensaje de la página /contacto. Client Component porque
// muestra "enviando…" / "enviado" sin recargar la página.
// Reutiliza los estilos del bloque de comentarios (mismos campos y
// botón) para que ambos formularios se vean idénticos.
'use client';

import { useState, useTransition } from 'react';
import { submitContactAction } from '@/app/actions/contact';
import { EMAIL_PATTERN } from '@/lib/validation';
import styles from '@/presentation/components/PostEngagement/PostEngagement.module.css';

export const ContactForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  // Usamos onSubmit (y no action={...}): React 19 vacía TODOS los
  // campos al terminar una "action" aunque el servidor la rechace, y
  // el visitante perdería lo que escribió. Con onSubmit el formulario
  // solo se vacía cuando el mensaje SÍ se guardó (ver reset() abajo).
  const handleSubmit = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    setError(null);
    setSent(false);
    startTransition(async () => {
      const result = await submitContactAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
      form.reset();
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(event.currentTarget);
      }}
      className={styles.form}
    >
      <div className={styles.trap} aria-hidden="true">
        <label>
          No llenar
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Nombre</span>
          <input name="name" type="text" required maxLength={60} />
        </label>
        <label className={styles.field}>
          <span>Correo (para responderte)</span>
          <input
            name="email"
            type="email"
            required
            pattern={EMAIL_PATTERN}
            title="Un correo válido, como nombre@dominio.com"
            maxLength={120}
          />
        </label>
      </div>
      <label className={styles.field}>
        <span>Tu mensaje</span>
        <textarea name="body" rows={5} required maxLength={2000} />
      </label>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {sent ? <p role="status">¡Gracias! Tu mensaje llegó y te responderé pronto.</p> : null}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  );
};
