// helpers/getDashboardData.ts

import { getAllReservations } from '@/helpers/reservations/getAllReservations';

export async function getDashboardData() {
  const reservations = await getAllReservations();
  const totalOrders = reservations.length;
  const totalPrice = reservations.reduce(
    (acc: any, order: any) => acc + order.price * 0.3,
    0,
  );
  const avgOrderPrice = totalOrders > 0 ? totalPrice / totalOrders : 0;

  return {
    totalOrders,
    totalPrice,
    avgOrderPrice,
  };
}
