import { getAllReservations } from '@/api/reservations/getAllReservations';
import { extractTime } from '@/helpers/extract-time';

export async function getReservations() {
  try {
    const reservationData = await getAllReservations();
    const reservations: object[] = reservationData.reservations.map(
      (item: any) => {
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
      },
    );

    return reservations;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
