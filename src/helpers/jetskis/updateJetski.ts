import { getToken } from '@/helpers/getToken';
import { Jetski } from '@/interfaces/jetski';

export const updateJetskiStatus = async (
  jetskiId: string,
  token: string,
): Promise<Jetski> => {
  const url = '/api/jetski';

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jetskiId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: Jetski = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
