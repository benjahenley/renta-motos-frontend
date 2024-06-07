// helpers/getReservationList.ts
export const getReservationsByUserID = async (userId: string): Promise<any[]> => {
    const url = `${process.env.NEXT_PUBLIC_URL_API_SERVER}/reservations?userId=${userId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred');
      }
  
      const signData = await response.json();
      return signData.reservations;
    } catch (error: any) {
      throw new Error(error.message || 'An unknown error occurred');
    }
  };
  