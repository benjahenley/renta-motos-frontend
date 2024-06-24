import { getToken } from '@/helpers/getToken';

export const deleteReservation = async (id: string) => {
  const url = `/api/reservation?id=${id}`;
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

export const cancelReservation = async (id: string) => {
  const url = `/api/reservation/${id}`;
  try {
    const token = getToken();
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'cancelled' }),
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
