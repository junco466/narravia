import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const useAsyncResource = <T>(factory: () => Promise<T>, dependencies: unknown[]): AsyncState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await factory();
      setData(result);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Ocurrió un error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    void execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    reload: execute,
  };
};
