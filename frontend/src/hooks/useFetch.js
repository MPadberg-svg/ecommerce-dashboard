import { useCallback, useEffect, useState } from 'react';

export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load, setData };
}
