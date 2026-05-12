import styles from '@/presentation/components/ErrorState/ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'No fue posible cargar el contenido',
  description = 'Intenta nuevamente o revisa la fuente de datos configurada.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <section className={styles.card}>
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry ? (
        <button type="button" className={styles.button} onClick={() => void onRetry()}>
          Reintentar
        </button>
      ) : null}
    </section>
  );
};
