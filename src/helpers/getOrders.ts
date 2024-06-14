// helpers/getOrders.ts

import { getToken } from '@/helpers/getToken';

export async function getAllOrders() {
  const token = getToken();
  const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/orders'; // Endpoint para obtener todos los pedidos

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

    const ordersData = await response.json();
    return ordersData.orders;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}
