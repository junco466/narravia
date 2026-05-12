import styles from '@/presentation/components/LoadingState/LoadingState.module.css';

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = 'Cargando contenido...' }: LoadingStateProps) => {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p>{label}</p>
    </div>
  );
};
