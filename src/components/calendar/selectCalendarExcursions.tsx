'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Selection, selectionAtom } from '@/atoms/reservation';
import Button from '@/components/ui/button';
import { useModal } from '../modals/context';
import { useRouter } from 'next/navigation';
import {
  getAdultsPerTimeSlot,
  getCellsToSelect,
  getJetskisAndExcursionsTemplate,
  timeSlots,
  findTimezoneIndexes,
} from '@/helpers/matrix-formation';
import { Reservation } from '@/interfaces/reservation';
import { formatDateToISOWithoutTime } from '@/helpers/formatDate';
import { getToken } from '@/helpers/getToken';
import { addMinutesToTime } from '@/helpers/extract-time';
import { createReservation } from '@/helpers/reservations/createReservation';
import { fetchReservationsByDate } from '@/helpers/reservations/fetchReservationsByDate';
import { fetchAvailableJetskis } from '@/helpers/jetskis/fetchAvailableJetskis';
import LoadingScreen from '../loading-screen';

export default function SelectCalendarExcursions() {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const selection = useAtomValue<Partial<Selection>>(selectionAtom);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [history, setHistory] = useState<[number[], string | undefined][]>([]);
  const [jetskisAvailable, setJetskisAvailable] = useState<string[]>([]);
  const [jetskisReserved, setJetskisReserved] = useState(
    getJetskisAndExcursionsTemplate(),
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { reservations } = await fetchReservationsByDate(
          formatDateToISOWithoutTime(selection!.date!),
        );

        const jetskis = await fetchAvailableJetskis();
        console.log(jetskis);

        setReservations(reservations);
        setJetskisAvailable(jetskis);
        processReservations(reservations);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [selection]);

  const processReservations = (reservations: Reservation[]) => {
    const newJetskisReserved = getJetskisAndExcursionsTemplate();

    reservations.forEach(
      ({ startTime, endTime, excursionName, adults, status }) => {
        if (status !== 'cancelled') {
          const rows = findTimezoneIndexes(startTime, endTime);
          const adultsPerTimeSlot = getAdultsPerTimeSlot(rows, adults);

          adultsPerTimeSlot.forEach((adults, i) => {
            newJetskisReserved[i][0] += adults;
            if (excursionName !== 'listing-1' && adults > 0) {
              newJetskisReserved[i][1].push(excursionName);
            }
          });
        }
      },
    );

    console.log(newJetskisReserved);
    setJetskisReserved(newJetskisReserved);
  };

  const handleCellClick = (row: number) => {
    const cellsToSelect = getCellsToSelect(selection!.rentTime!);
    const { excursion, excursionName, adults } = selection!;
    const roof = row + cellsToSelect;

    if (history.length === 1) {
      // deleteHistoryAndUpdateJetskisReserved();
      setHistory([]);
    }

    if (roof > timeSlots.length) {
      console.log('Cannot select the timeSlot');
      return;
    }

    const rows: number[] = [];

    for (let i = row; i < roof; i++) {
      const jetskisTaken = jetskisReserved[i][0];
      const excursionsArray = jetskisReserved[i][1];

      if (jetskisTaken + adults! > 4) {
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

    if (history.length === 1) {
      setHistory([]);
      // deleteHistoryAndUpdateJetskisReserved();
    } else {
      const newHistory: [number[], string | undefined][] = [];
      const adultsPerTimeSlot = new Array(timeSlots.length).fill(0);

      rows.forEach((r) => {
        adultsPerTimeSlot[r] = adults!;
      });
      newHistory.push([adultsPerTimeSlot, excursionName]);
      // updateJetskisReserved(newHistory);
      setHistory(newHistory);
    }
  };

  const cellDisplay = (row: number) => {
    const reservedJetskis = jetskisReserved[row][0];
    const excursionsBooked = jetskisReserved[row][1];
    const { excursion, adults } = selection!;

    let classes = 'cursor-pointer';

    if (history[0] && history[0][0][row] > 0) {
      classes = 'bg-green-500 cursor-pointer';
    } else if (reservedJetskis + adults! > jetskisAvailable.length) {
      classes = 'bg-gray-300 cursor-not-allowed';
    } else if (excursion && excursionsBooked.length >= 2) {
      classes = 'bg-gray-300 cursor-not-allowed';
    }

    return classes;
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        openModal('SIGN_IN');
      }

      let selectedTimeSlots: string[] = [];

      history[0][0].forEach((value, index) => {
        if (value > 0) {
          selectedTimeSlots.push(timeSlots[index]);
        }
      });

      const startTime = selectedTimeSlots[0];
      const endTimeRaw = selectedTimeSlots[selectedTimeSlots.length - 1];
      const endTime = addMinutesToTime(endTimeRaw, 30);
      const { adults, excursion, excursionName, date } = selection;
      const formatDate = formatDateToISOWithoutTime(date!);

      const data = {
        date: formatDate,
        adults,
        excursion,
        excursionName,
        startTime,
        endTime,
      };

      const { reservationId } = await createReservation(token, data);
      console.log(reservationId);
      // Routes.public.payment(reservationId))
      router.push(`/payment/${reservationId}`);
    } catch (e: any) {
      console.log(e.message);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  const date = new Date(selection?.date!);

  return (
    <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
        {!reservations || timeSlots.length === 0 ? (
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
                Adults: {selection?.adults}
              </p>
              <p className="text-base leading-5 text-gray">
                Type: {selection?.rentTime}
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
                disabled={history.length === 1 ? false : true}
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
        <LoadingScreen/>
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        //   Loading...
        // </div>
      )}
    </div>
  );
}
