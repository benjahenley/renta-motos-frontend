'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { reservation, selectionAtom } from '@/atoms/reservation';
import Button from '@/components/ui/button';
import { Jetski, getJetskis } from '@/api/get-jetskis/useGetJetskis';
import { getReservationsByDate } from '@/api/reservations/getReservationsByDate';
import { useModal } from '../modals/context';
import { useRouter } from 'next/navigation';
import {
  findTimezoneIndexes,
  getAdultsPerTimeSlot,
  getCellsToSelect,
  getJetskisAndExcursionsTemplate,
  timeSlots,
} from '@/helpers/matrix-formation';
import { Reservation } from '@/interfaces/reservation';

export default function SelectCalendarExcursions() {
  const router = useRouter();
  const selection = useAtomValue<Partial<reservation>>(selectionAtom);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<[number[], string | undefined][]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [jetskisReserved, setJetskisReserved] = useState(
    getJetskisAndExcursionsTemplate(),
  );

  const rentTime = selection!.selected!.rentTime;

  // Load reservations and jetskis on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { jetskis } = await getJetskis();
        const { reservations } = await getReservationsByDate(
          selection.selected!.date!,
        );
        setReservations(reservations);
        setJetskis(jetskis);
        processReservations(reservations);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, [selection]);

  // Process existing reservations to update the state
  const processReservations = (reservations: Reservation[]) => {
    const updates: [number[], string | undefined][] = [];
    reservations.forEach((reservation) => {
      const { startTime, endTime, excursion, excursionName, adults } =
        reservation;
      const rows = findTimezoneIndexes(startTime, endTime);
      const adultsPerTimeSlot = getAdultsPerTimeSlot(rows, adults);
      updates.push([adultsPerTimeSlot, excursion ? excursionName : undefined]);
    });
    setHistory(updates);
  };

  // Handle cell click events
  const handleCellClick = (row: number) => {
    const cellsToSelect = getCellsToSelect(rentTime);
    const { excursion, excursionName, adults } = selection.selected!;
    const roof = row + cellsToSelect;

    if (roof > timeSlots.length) {
      console.log('Cannot select the timeSlot');
      return;
    }

    const rows: number[] = [];
    for (let i = row; i < roof; i++) {
      const jetskisTaken = jetskisReserved[i][0];
      const excursionsArray = jetskisReserved[i][1];

      if (jetskisTaken + adults > 4) {
        console.log('No jetskis available in some of the selected timeSlots');
        return;
      }

      if (excursion) {
        const excursionIndex = excursionsArray.findIndex(
          (exc) => exc === excursionName,
        );
        if (excursionIndex === -1 && excursionsArray.length >= 2) {
          console.log('Guides are full for some of the selected timeSlots');
          return;
        }
      }

      rows.push(i);
    }

    const newHistory = [...history];
    rows.forEach((r) => {
      newHistory[r] = [new Array(timeSlots.length).fill(0), excursionName];
      newHistory[r][0][r] = adults;
    });

    setHistory(newHistory);
    updateJetskisReserved(rows, adults, excursionName);
  };

  // Update the state to reflect the new selection
  const updateJetskisReserved = (
    rows: number[],
    adults: number,
    excursionName?: string,
  ) => {
    setJetskisReserved((prev) => {
      const newJetskisReserved = [...prev];
      rows.forEach((r) => {
        newJetskisReserved[r][0] += adults;
        if (excursionName) {
          newJetskisReserved[r][1].push(excursionName);
        }
      });
      return newJetskisReserved;
    });
  };

  const cellDisplay = (row: number) => {
    const remainingJetskis = 4 - jetskisReserved[row][0];
    const excursionsBooked = jetskisReserved[row][1];
    const { excursionName, excursion, adults } = selection.selected!;

    let classes = 'cursor-pointer';
    if (history[row]) {
      classes = 'bg-green-500 cursor-pointer';
    } else if (remainingJetskis - adults <= 0) {
      classes = 'bg-gray-300 cursor-not-allowed';
    } else if (excursion) {
      const isExcursionBooked = excursionsBooked.includes(excursionName!);
      if (
        (!isExcursionBooked && excursionsBooked.length >= 2) ||
        remainingJetskis - adults <= 0
      ) {
        classes = 'bg-gray-300 cursor-not-allowed';
      }
    }

    return classes;
  };

  async function handleSubmit(e: any) {
    // e.preventDefault();
    // setLoading(true);
    // try {
    //   const token = getToken();
    //   if (!token) {
    //     closeModal();
    //     openModal('SIGN_IN');
    //     setLoading(false);
    //     return;
    //   }
    //   const reservationsArray: any[] = [];
    //   history.forEach((matrix) => {
    //     let timeSlotIndexes: number[] = [];
    //     let jetskiIndex = 0;
    //     for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    //       for (let colIndex = 0; colIndex < jetskiIds?.length!; colIndex++) {
    //         if (matrix[rowIndex][colIndex] === 1) {
    //           timeSlotIndexes!.push(rowIndex);
    //           jetskiIndex = colIndex;
    //         }
    //       }
    //     }
    //     const date = formatDateToISOWithoutTime(selection.startDate!);
    //     let jetskiId = jetskiIds![jetskiIndex];
    //     let startTimeData = timeSlots[timeSlotIndexes[0]];
    //     let endTimeData =
    //       timeSlots[timeSlotIndexes[timeSlotIndexes.length - 1]];
    //     let endTimePlusHalfAnHour = addMinutesToTime(endTimeData, 30);
    //     let startTime = new Date(
    //       `${date}T${startTimeData}:00.000Z`,
    //     ).toISOString();
    //     let endTime = new Date(
    //       `${date}T${endTimePlusHalfAnHour}:00.000Z`,
    //     ).toISOString();
    //     reservationsArray.push({
    //       date,
    //       startTime,
    //       endTime,
    //       jetskiId,
    //       excursion: selection.selected!.excursion,
    //       excursionName: selection.selected!.excursionName,
    //     });
    //   });
    //   const orderData = {
    //     adults: reservationsArray.length,
    //     reservations: reservationsArray,
    //   };
    //   const { orderId } = await createOrder(token, orderData);
    //   if (!orderId) {
    //     throw new Error('Error creating reservation');
    //   }
    //   router.push(`${Routes.public.payment}/${orderId}`);
    // } catch (e: any) {
    //   console.log(e.message);
    //   alert(e.message);
    // } finally {
    //   setLoading(false); // Reset loading state
    // }
  }

  const date = new Date(selection.startDate!);

  return (
    <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
        {!jetskis || timeSlots.length === 0 ? (
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
                Adults: {selection.selected?.adults}
              </p>
              <p className="text-base leading-5 text-gray">
                Type: {selection.selected?.rentTime}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="extratable min-w-full border-collapse border border-gray-400">
                <thead className="thead">
                  <tr>
                    <th className="thh px-4 py-2">Times</th>
                    <th className="thh px-4 py-2">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, rowIndex) => (
                    <tr className="tr" key={rowIndex}>
                      <td className="td px-4 py-2">{slot}</td>
                      <td
                        className={`td px-4 py-2 ${cellDisplay(rowIndex)}`}
                        onClick={() => handleCellClick(rowIndex)}
                      ></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <Button
                disabled={
                  history.length === selection.selected?.adults! ? false : true
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
