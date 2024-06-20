export const getReservationsByDate = async (date: string) => {
  const url =
    process.env.NEXT_PUBLIC_URL_API_SERVER + '/reservations?date=' + date;
  try {
    const response = await fetch(url, {
      method: 'GET',
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
