import { Jetski } from '@/interfaces/jetski';

export const getJetskis = async (token: string): Promise<Jetski[]> => {
  const url = '/api/jetskis';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: Jetski[] = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
