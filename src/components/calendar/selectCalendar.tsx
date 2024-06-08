import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { reservation, reservationAtom } from '@/atoms/reservation';
import Button from '@/components/ui/button';
import { getJetskis } from '@/api/get-jetskis/useGetJetskis';
import { getToken } from '@/helpers/getToken';
import { getReservationsByDate } from '@/api/reservations/getReservationsByDate';
import {
  formatDateToISOWithoutTime,
  formatDateToISOWithoutTime as removeTime,
} from '@/helpers/formatDate';
import { useModal } from '../modals/context';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/api/order/createOrder';
import { orderAtom } from '@/atoms/order';

interface SelectedCell {
  jetskiId: number;
  timeSlot: string;
}

interface Jetski {
  id: number;
  name: string;
  status: 'available' | 'maintenance';
  reservations: any[];
}

const timeSlots = [
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
];

const fullDayTimeSlots = ['10:00 - 18:00'];

export default function SelectCalendar() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [reservation, setReservation] =
    useAtom<Partial<reservation>>(reservationAtom);
  const { openModal, closeModal } = useModal();
  const [date, setDate] = useState(new Date(reservation.startDate!));
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [order, setOrder] = useAtom(orderAtom);
  const [selectionOrder, setSelectionOrder] = useState<SelectedCell[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { jetskis } = await getJetskis();
        const reservationsData = await getReservationsByDate(removeTime(date));
        setReservations(reservationsData.reservations);
        setJetskis(jetskis);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [reservation, date]);

  const handleCellClick = (motorboat: Jetski, timeSlot: string) => {
    const maxSelections = reservation.selected?.adults || 1;
    const rentTime = reservation.selected?.rentTime;

    const slotsToSelect = rentTime === '4h' ? 2 : 1;
    const availableSlots =
      rentTime === 'fullDay' ? fullDayTimeSlots : timeSlots;

    const startIndex = availableSlots.indexOf(timeSlot);

    if (
      startIndex === -1 ||
      startIndex + slotsToSelect > availableSlots.length
    ) {
      return;
    }

    const newSelectedCells: SelectedCell[] = [];
    for (let i = 0; i < slotsToSelect; i++) {
      const slot = availableSlots[startIndex + i];
      newSelectedCells.push({ jetskiId: motorboat.id, timeSlot: slot });
    }

    const isAnyReserved = newSelectedCells.some((cell) =>
      isCellReserved(cell.jetskiId, cell.timeSlot),
    );

    if (isAnyReserved) {
      return;
    }

    const isAllSelected = newSelectedCells.every((cell) =>
      selectedCells.some(
        (selectedCell) =>
          selectedCell.jetskiId === cell.jetskiId &&
          selectedCell.timeSlot === cell.timeSlot,
      ),
    );

    let updatedSelectedCells = [...selectedCells];
    let updatedSelectionOrder = [...selectionOrder];

    if (isAllSelected) {
      updatedSelectedCells = updatedSelectedCells.filter(
        (cell) =>
          !newSelectedCells.some(
            (newCell) =>
              newCell.jetskiId === cell.jetskiId &&
              newCell.timeSlot === cell.timeSlot,
          ),
      );
      updatedSelectionOrder = updatedSelectionOrder.filter(
        (cell) =>
          !newSelectedCells.some(
            (newCell) =>
              newCell.jetskiId === cell.jetskiId &&
              newCell.timeSlot === cell.timeSlot,
          ),
      );
    } else {
      if (selectionOrder.length >= maxSelections * slotsToSelect) {
        const cellToRemove = updatedSelectionOrder.shift();
        if (cellToRemove) {
          updatedSelectedCells = updatedSelectedCells.filter(
            (cell) =>
              !(
                cell.jetskiId === cellToRemove.jetskiId &&
                cell.timeSlot === cellToRemove.timeSlot
              ),
          );
        }
      }
      updatedSelectedCells.push(...newSelectedCells);
      updatedSelectionOrder.push(...newSelectedCells);
    }

    if (updatedSelectionOrder.length > maxSelections * slotsToSelect) {
      return;
    }

    setSelectedCells(updatedSelectedCells);
    setSelectionOrder(updatedSelectionOrder);
  };

  const isCellSelected = (jetskiId: number, timeSlot: string) =>
    selectedCells.some(
      (cell) => cell.jetskiId === jetskiId && cell.timeSlot === timeSlot,
    );

  const isCellReserved = (jetskiId: number, timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split(' - ');

    return reservations.some((reservationItem) => {
      if (reservationItem.jetskiId !== jetskiId) return false;

      const reservationStart = new Date(reservationItem.startTime).getTime();
      const reservationEnd = new Date(reservationItem.endTime).getTime();

      const slotStart = new Date(
        `${formatDateToISOWithoutTime(date)}T${startTime}:00.000Z`,
      ).getTime();
      const slotEnd = new Date(
        `${formatDateToISOWithoutTime(date)}T${endTime}:00.000Z`,
      ).getTime();

      return (
        (slotStart >= reservationStart && slotStart < reservationEnd) ||
        (slotEnd > reservationStart && slotEnd <= reservationEnd) ||
        (slotStart <= reservationStart && slotEnd >= reservationEnd)
      );
    });
  };

  async function handleSubmit(e: any) {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true

    try {
      const token = getToken();

      if (!token) {
        closeModal();
        openModal('SIGN_IN');
        setLoading(false); // Reset loading state
        return;
      }

      const reservationsArray: any[] = [];

      selectedCells.forEach((item) => {
        var [startTime, endTime] = item.timeSlot.split(' - ');
        const dateData = formatDateToISOWithoutTime(date);

        startTime = new Date(`${dateData}T${startTime}:00.000Z`).toISOString();
        endTime = new Date(`${dateData}T${endTime}:00.000Z`).toISOString();

        reservationsArray.push({
          date: dateData,
          startTime,
          endTime,
          jetskiId: item.jetskiId,
        });
      });

      const orderData = {
        adults: reservationsArray.length,
        reservations: reservationsArray,
      };

      const { orderId } = await createOrder(token, orderData);

      if (!orderId) {
        throw new Error('Error creating reservation');
      }

      setOrder(orderId);
      router.push(`${Routes.public.payment}/${orderId}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  // const timeSlots = generateTimeSlots(reservation.selected?.rentTime);

  return (
    <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
        {jetskis.length === 0 || timeSlots.length === 0 ? (
          <div>LOADING...</div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="mb-3 text-3xl font-bold uppercase leading-[48px] text-primary text-center">
                DATE: {date.getDate()}/{date.getMonth() + 1}/
                {date.getFullYear()}
              </h2>
              <p className="text-base leading-5 text-gray"></p>
              <p className="text-base leading-5 text-gray">
                Adults: {reservation.selected?.adults}
              </p>
              <p className="text-base leading-5 text-gray">
                Type: {reservation.selected?.rentTime}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="extratable min-w-full border-collapse border border-gray-400">
                <thead className="thead">
                  <tr>
                    <th className="thh px-4 py-2">Times</th>
                    {jetskis.map((boat) => (
                      <th key={boat.id} className="thh px-4 py-2">
                        {boat.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(reservation.selected?.rentTime === 'fullDay'
                    ? fullDayTimeSlots
                    : timeSlots
                  ).map((slot, index) => (
                    <tr className="tr" key={index}>
                      <td className="td px-4 py-2">{slot}</td>
                      {jetskis.map((boat) => (
                        <td
                          key={boat.id}
                          className={`td px-4 py-2 ${
                            isCellSelected(boat.id, slot) && 'bg-green-500 '
                          } ${
                            isCellReserved(boat.id, slot)
                              ? ' bg-gray-lighter cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          onClick={() =>
                            !isCellReserved(boat.id, slot) &&
                            handleCellClick(boat, slot)
                          }
                        ></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <Button
                disabled={
                  selectedCells.length !==
                  reservation.selected!.adults *
                    (reservation.selected!.rentTime === '4h'
                      ? 2
                      : reservation.selected!.rentTime === 'fullDay'
                        ? 4
                        : 1)
                }
                size="xl"
                rounded="lg"
                type="submit"
                variant="solid"
                className="mt-4 w-full !py-[14px] text-base !font-bold uppercase tracking-widest"
                onClick={handleSubmit}
              >
                {loading ? 'Processing...' : 'Create Reservation'}
              </Button>
            </div>
          </>
        )}
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          Loading...
        </div>
      )}
    </div>
  );
}
