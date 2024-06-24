import { getToken } from '@/helpers/getToken';
import { Reservation } from '@/interfaces/reservation';

export const getReservationById = async (
  token: string,
  reservationId: string,
) => {
  const url = '/api/reservation/' + reservationId;

  try {
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

    const signData: Reservation = await response.json();
    return signData;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
