'use client';

import { useState, useEffect } from 'react';
import {
  Jetski,
  getJetskis,
  updateJetskiStatus,
} from '@/api/get-jetskis/useGetJetskis';

const useJetskis = () => {
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJetskis = async () => {
    try {
      const data = await getJetskis();
      console.log('Fetched jetskis:', data);
      setJetskis(data);
      return;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJetskis();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      updateJetskiStatus(id).then(() => {
        fetchJetskis();
      });

      return;
    } catch (err) {
      setError(err as Error);
    }
  };

  return { jetskis, loading, error, toggleStatus };
};

export default useJetskis;
