// Bandeja de mensajes del formulario de /contacto (más nuevos primero).
// El correo es un enlace mailto: para responder con un clic.
import { listContactMessages } from '@/lib/engagement';
import { DeleteMessageButton } from '@/presentation/components/admin/DeleteMessageButton';
import { formatDate } from '@/presentation/utils/formatDate';
// Mismo aspecto que la lista de comentarios: reutilizamos su CSS.
import styles from '../comments/page.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return (
    <div>
      <h1 className={styles.title}>Mensajes</h1>
      {messages.length === 0 ? (
        <p className={styles.empty}>Aún no hay mensajes.</p>
      ) : (
        <ul className={styles.list}>
          {messages.map((message) => (
            <li key={message.id} className={styles.item}>
              <div className={styles.head}>
                <span>
                  <strong>{message.name}</strong>
                  <span className={styles.muted}>
                    {' · '}
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                    {' · '}
                    {formatDate(message.createdAt.toISOString())}
                  </span>
                </span>
                <DeleteMessageButton id={message.id} />
              </div>
              <p className={styles.body}>{message.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
