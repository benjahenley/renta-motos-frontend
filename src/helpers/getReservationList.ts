
import { getToken } from '@/helpers/getToken';
import { extractTime } from '@/helpers/extract-time';
import { getAllReservations } from '@/api/reservations/getAllReservations';

export async function getReservations() {
  try {
    const token = getToken();
    const reservationData = await getAllReservations(token);

    const reservations: object[] = reservationData.reservations.map((item: any) => {
      const endTime = extractTime(item.endTime);
      const startTime = extractTime(item.startTime);

      return {
        id: item.id,
        date: item.date,
        name: item.userFullName,
        status: item.status,
        endTime,
        startTime,
        jetskiId: item.jetskiId,
      };
    });

    return reservations;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
