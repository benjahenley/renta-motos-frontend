import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { reservation, reservationAtom } from '@/atoms/reservation';
import Button from '@/components/ui/button';
import { getJetskis } from '@/api/get-jetskis/useGetJetskis';
import { getToken } from '@/helpers/getToken';
import { getReservationsByDate } from '@/api/reservations/getReservationsByDate';
import { formatDateToISOWithoutTime as removeTime } from '@/helpers/formatDate';
import { useModal } from '../modals/context';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';



interface SelectedCell {
  motorboatId: string;
  timeSlot: string;
}

interface Jetski {
  id: string;
  name: string;
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

  const handleCellClick = async (motorboat: Jetski, timeSlot: string) => {
    const isSelected = selectedCells.some(
      (cell) => cell.motorboatId === motorboat.id && cell.timeSlot === timeSlot,
    );

    if (isSelected) {
      setSelectedCells((prevSelectedCells) =>
        prevSelectedCells.filter(
          (cell) =>
            cell.motorboatId !== motorboat.id || cell.timeSlot !== timeSlot,
        ),
      );
    } else {
      if (selectedCells.length < reservation.selected!.adults) {
        setSelectedCells((prevSelectedCells) => [
          ...prevSelectedCells,
          { motorboatId: motorboat.id, timeSlot },
        ]);
      } else {
        setSelectedCells((prevSelectedCells) => [
          { motorboatId: motorboat.id, timeSlot },
          ...prevSelectedCells.slice(1),
        ]);
      }
    }
  };

  const isCellSelected = (motorboatId: string, timeSlot: string) =>
    selectedCells.some(
      (cell) => cell.motorboatId === motorboatId && cell.timeSlot === timeSlot,
    );

  const isCellReserved = (motorboatId: string, timeSlot: string) => {
    return reservations.some(
      (reservationItem) =>
        reservationItem.jetskiId === motorboatId &&
        reservationItem.timeSlot === timeSlot,
    );
  };

  const generateTimeSlots = () => {
    const timeSlots = [];
    let slotDuration;

    switch (reservation.selected!.rentTime!) {
      case '2hs':
        slotDuration = 2;
        break;
      case '4hs':
        slotDuration = 4;
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
  console.log(timeSlots);

  function handleSubmit() {
    try {
      const token = getToken();
      router.push(Routes.public.payment)
    } catch (e) {
      closeModal();
      openModal('SIGN_IN');
    }
  }

  return (
    <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-bold uppercase leading-[48px] text-primary text-center">
            DATE: {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
          </h2>
          <p className="text-base leading-5 text-gray"></p>
          <p className="text-base leading-5 text-gray">
            Adults: {reservation.selected?.adults}
          </p>
          <p className="text-base leading-5 text-gray">
            Type: {reservation.selected?.rentTime}
          </p>
        </div>
        <div>Select for{reservation.selected?.adults} adult </div>
        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Times</th>
                {jetskis.map((boat) => (
                  <th
                    key={boat.id}
                    className="border border-gray-400 px-4 py-2"
                  >
                    {boat.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">{slot}</td>
                  {jetskis.map((boat) => {
                    return (
                      <td
                        key={boat.id}
                        className={`border border-gray-400 px-4 py-2 cursor-pointer ${
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
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <Button
            disabled={selectedCells.length !== reservation.selected?.adults}
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
      </div>
    </div>
  );
}
