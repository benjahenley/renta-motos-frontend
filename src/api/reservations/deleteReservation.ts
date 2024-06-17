import { getToken } from '@/helpers/getToken';

export const deleteReservation = async (reservationId: string) => {
  const url =
    process.env.NEXT_PUBLIC_URL_API_SERVER +
    '/reservations?id=' +
    reservationId;

  try {
    const token = getToken();
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
