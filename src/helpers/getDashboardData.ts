// helpers/getDashboardData.ts

import { getAllOrders } from '@/helpers/getOrders';

export async function getDashboardData() {
  const orders = await getAllOrders();
  const totalOrders = orders.length;
  const totalPrice = orders.reduce((acc: any, order: any) => acc + order.price * 0.3, 0);
  const avgOrderPrice = totalOrders > 0 ? totalPrice / totalOrders : 0;

  return {
    totalOrders,
    totalPrice,
    avgOrderPrice,
  };
}
