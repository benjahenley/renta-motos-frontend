'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Selection, selectionAtom } from '@/atoms/reservation';
import Button from '@/components/ui/button';
import { getReservationsByDate } from '@/api/reservations/getReservationsByDate';
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

export default function SelectCalendarExcursions() {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const selection = useAtomValue<Partial<Selection>>(selectionAtom);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [history, setHistory] = useState<[number[], string | undefined][]>([]);
  const [jetskisReserved, setJetskisReserved] = useState(
    getJetskisAndExcursionsTemplate(),
  );

  if (!selection) {
    return <div>loading...</div>;
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log(selection!.date!);
        const { reservations } = await getReservationsByDate(
          formatDateToISOWithoutTime(selection!.date!),
        );

        setReservations(reservations);
        processReservations(reservations);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [selection]);

  const processReservations = (reservations: Reservation[]) => {
    const updates: [number[], string | undefined][] = [];

    reservations.forEach((reservation) => {
      const { startTime, endTime, excursion, excursionName, adults } =
        reservation;
      const rows = findTimezoneIndexes(startTime, endTime);
      const adultsPerTimeSlot = getAdultsPerTimeSlot(rows, adults);

      updates.push([adultsPerTimeSlot, excursion ? excursionName : undefined]);
    });

    updateJetskisReserved(updates);
  };

  const updateJetskisReserved = (
    reservations: [number[], string | undefined][],
  ) => {
    setJetskisReserved((prev) => {
      const newJetskisReserved = [...prev];

      reservations.forEach(([adultsPerTimeSlot, excursionName]) => {
        for (let i = 0; i < newJetskisReserved.length; i++) {
          if (newJetskisReserved[i][0] + adultsPerTimeSlot[i] <= 4) {
            newJetskisReserved[i][0] += adultsPerTimeSlot[i];
          }

          if (excursionName && newJetskisReserved[i][1].length < 2) {
            newJetskisReserved[i][1].push(excursionName);
          }
        }
      });

      return newJetskisReserved;
    });
  };

  const deleteHistoryAndUpdateJetskisReserved = () => {
    const oldHistory = [...history];
    const newState = [...jetskisReserved];

    for (let i = 0; i < jetskisReserved.length; i++) {
      newState[i][0] -= oldHistory[0][0][i];

      if (selection.excursion) {
        const excIndex = newState[i][1].findIndex((item) => {
          return item === oldHistory[0][1]![i];
        });

        if (excIndex !== -1) {
          newState[i][1].splice(excIndex, 1);
        }
      }
    }

    setJetskisReserved(newState);
    setHistory([]);
  };

  const handleCellClick = (row: number) => {
    const cellsToSelect = getCellsToSelect(selection!.rentTime!);
    const { excursion, excursionName, adults } = selection!;
    const roof = row + cellsToSelect;

    if (history.length === 1) {
      deleteHistoryAndUpdateJetskisReserved();
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
      console.log('New History', newHistory);

      // updateJetskisReserved(newHistory);
      setHistory(newHistory);
    }
  };

  const cellDisplay = (row: number) => {
    const reservedJetskis = jetskisReserved[row][0];
    const excursionsBooked = jetskisReserved[row][1];
    const { excursionName, excursion, adults } = selection!;

    let classes = 'cursor-pointer';

    if (history[0] && history[0][0][row] > 0) {
      classes = 'bg-green-500 cursor-pointer';
    } else if (reservedJetskis + adults! > 4) {
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

      console.log(data);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          Loading...
        </div>
      )}
    </div>
  );
}

async function handleSubmit(e: any) {
  e.preventDefault();
  // setLoading(true);
  // try {
  //
  // setLoading(false);
  // return;
  // }
  // const reservationsArray: any[] = [];
  // history.forEach((matrix) => {
  // let timeSlotIndexes: number[] = [];
  // let jetskiIndex = 0;
  // for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
  // for (let colIndex = 0; colIndex < jetskiIds?.length!; colIndex++) {
  // if (matrix[rowIndex][colIndex] === 1) {
  // timeSlotIndexes!.push(rowIndex);
  // jetskiIndex = colIndex;
  // }
  // }
  // }
  // const date = formatDateToISOWithoutTime(selection.startDate!);
  // let jetskiId = jetskiIds![jetskiIndex];
  // let startTimeData = timeSlots[timeSlotIndexes[0]];
  // let endTimeData =
  // timeSlots[timeSlotIndexes[timeSlotIndexes.length - 1]];
  // let endTimePlusHalfAnHour = addMinutesToTime(endTimeData, 30);
  // let startTime = new Date(
  // ${date}T${startTimeData}:00.000Z,
  // ).toISOString();
  // let endTime = new Date(
  // ${date}T${endTimePlusHalfAnHour}:00.000Z,
  // ).toISOString();
  // reservationsArray.push({
  // date,
  // startTime,
  // endTime,
  // jetskiId,
  // excursion: selection.excursion,
  // excursionName: selection.excursionName,
  // });
  // });
  // const orderData = {
  // adults: reservationsArray.length,
  // reservations: reservationsArray,
  // };
  // const { orderId } = await createOrder(token, orderData);
  // if (!orderId) {
  // throw new Error('Error creating reservation');
  // }
  // router.push(${Routes.public.payment}/${orderId});
  // } catch (e: any) {
  // console.log(e.message);
  // alert(e.message);
  // } finally {
  // setLoading(false); // Reset loading state
  // }
}
