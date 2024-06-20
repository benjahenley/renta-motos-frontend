'use client';

export interface Jetski {
  id: string;
  name: string;
  available: boolean;
  reservations: string[];
}

export const getJetskis = async (token: string): Promise<Jetski[]> => {
  const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/jetskis';
  console.log('getJEtskis', url);
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: Jetski[] = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
