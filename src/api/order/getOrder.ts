type Props = {
  adults: number;
  price: number;
  expirationDate: string;
  status: string;
  userId: string;
  reservations: any;
};

export const getOrder = async (token: string, orderId: string) => {
  const url =
    process.env.NEXT_PUBLIC_URL_API_SERVER + '/order?orderId=' + orderId;

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

    const orderStatus = await response.json();
    const order: Props = orderStatus.order;

    return order;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
