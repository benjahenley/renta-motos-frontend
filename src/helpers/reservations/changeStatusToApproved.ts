import { getToken } from '@/helpers/getToken';

export async function changeReservationStatusToApproved(reservationId: string) {
  const url = '/api/reservation/' + reservationId;

  try {
    const token = getToken();
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'approved' }),
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
}
