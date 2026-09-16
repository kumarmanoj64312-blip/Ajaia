import { useCallback, useEffect, useState } from 'react';
import * as documentsApi from '../api/documents.api';

export function useDocuments() {
  const [owned, setOwned] = useState([]);
  const [shared, setShared] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentsApi.listDocuments();
      setOwned(data.owned);
      setShared(data.shared);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { owned, shared, loading, error, refresh };
}
