import { getToken } from '@/helpers/getToken';

export const getAllReservations = async (): Promise<any[]> => {
  const url = '/api/reservations/all';
  try {
    const token = getToken();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const signData = await response.json();
    return signData;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
