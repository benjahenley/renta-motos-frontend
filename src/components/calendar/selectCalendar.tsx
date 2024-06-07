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

export default function SelectCalendar() {
  const router = useRouter();

  const [reservation, setReservation] =
    useAtom<Partial<reservation>>(reservationAtom);

  const { openModal, closeModal } = useModal();
  const [date, setDate] = useState(new Date(reservation.startDate!));
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [order, setOrder] = useAtom(orderAtom);
  const [times, setTimes] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { jetskis } = await getJetskis();
        const reservationsData = await getReservationsByDate(removeTime(date));
        setReservations(reservationsData.reservations);
        setJetskis(jetskis);
      } catch (error) {
        console.error('Error fetching items:', error);
        closeModal();
      }
    };

    fetchItems();
  }, [reservation]);

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
  }, [reservation]);

  const handleCellClick = (motorboat: Jetski, timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split(' - ');
    const slotStart = new Date(
      `${formatDateToISOWithoutTime(date)}T${startTime}:00.000Z`,
    ).getTime();

    let slotsToSelect = 1;
    switch (reservation.selected!.rentTime) {
      case '2hs':
        slotsToSelect = 1;
      case '4hs':
        slotsToSelect = 2;
        break;
      case 'fullDay':
        slotsToSelect = 4;
        break;
      default:
        slotsToSelect = 1;
    }

    const newSelectedCells: SelectedCell[] = [];
    for (let i = 0; i < slotsToSelect; i++) {
      const slot = `${new Date(slotStart + i * 2 * 60 * 60 * 1000).toISOString().slice(11, 16)} - ${new Date(slotStart + (i + 1) * 2 * 60 * 60 * 1000).toISOString().slice(11, 16)}`;
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

    if (isAllSelected) {
      setSelectedCells((prevSelectedCells) =>
        prevSelectedCells.filter(
          (cell) =>
            !newSelectedCells.some(
              (newCell) =>
                newCell.jetskiId === cell.jetskiId &&
                newCell.timeSlot === cell.timeSlot,
            ),
        ),
      );
    } else {
      setSelectedCells(newSelectedCells);
    }
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

  const generateTimeSlots = () => {
    const timeSlots = [];
    let slotDuration = 2;

    switch (reservation.selected!.rentTime!) {
      case '4hs':
        slotDuration = 2;
        break;
      case 'fullDay':
        slotDuration = 8;
        break;
      default:
        slotDuration = 2;
    }

    for (let hour = 10; hour + slotDuration <= 18; hour += slotDuration) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + slotDuration).toString().padStart(2, '0')}:00`;
      timeSlots.push(`${startTime} - ${endTime}`);
    }

    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  async function handleSubmit(e: any) {
    try {
      const token = getToken();

      if (!token) {
        closeModal();
        openModal('SIGN_IN');
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
      closeModal();
      alert(e.message);
    }
  }

  return (
    <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
        {jetskis.length === 0 ? (
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
            <div>Select for {reservation.selected?.adults} adult </div>
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
                  {timeSlots.map((slot, index) => (
                    <tr className="tr" key={index}>
                      <td className="td px-4 py-2">{slot}</td>
                      {jetskis.map((boat) => (
                        <td
                          key={boat.id}
                          className={`td px-4 py-2 cursor-pointer ${
                            isCellSelected(boat.id, slot) ? 'bg-green-500' : ''
                          } ${
                            isCellReserved(boat.id, slot)
                              ? 'bg-red-500 cursor-not-allowed'
                              : ''
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
                    (reservation.selected!.rentTime === '4hs'
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
                Create Reservation
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
