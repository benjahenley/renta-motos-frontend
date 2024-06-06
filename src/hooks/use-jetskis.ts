'use client';

import { useState, useEffect } from 'react';
import { Jetski, getJetskis, updateJetskiStatus } from '@/api/get-jetskis/useGetJetskis';

const useJetskis = () => {
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJetskis = async () => {
      try {
        const data = await getJetskis();
        console.log("Fetched jetskis:", data); // Verifica los datos obtenidos
        setJetskis(data.jetskis); // Accede al array de jetskis dentro del objeto
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchJetskis();
  }, []);

  const updateStatus = async (id: number, status: 'available' | 'maintenance') => {
    try {
      const updatedJetski = await updateJetskiStatus(id, status);
      setJetskis(jetskis.map(j => (j.id === id ? updatedJetski : j)));
    } catch (err) {
      setError(err as Error);
    }
  };

  return { jetskis, loading, error, updateStatus };
};

export default useJetskis;
