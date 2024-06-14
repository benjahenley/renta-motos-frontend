'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { reservation, selectionAtom } from '@/atoms/reservation';
import Button from '@/components/ui/button';
import { Jetski, getJetskis } from '@/api/get-jetskis/useGetJetskis';
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
import {
  findTimezoneIndexes,
  getCellsToSelect,
  getGuidesTemplate,
  getHistoryTemplate,
  getJetskisAndExcursionsTemplate,
  jetskiData,
  populateMatrix,
  timeSlots,
} from '@/helpers/matrix-formation';
import { Reservation } from '@/interfaces/jetski';
import { addMinutesToTime } from '@/helpers/extract-time';

///ejemplo
const matrix: (number | string[])[][] = [
  [2, ['excursion2', 'excursion1']],
  [3, ['excursion2']],
  [2, ['excursion2', 'excursion1']],
  [0, ['excursion2', 'excursion1']],
  [1, ['excursion2']],
  [2, ['excursion2', 'excursion1']],
  [0, []],
];

export default function SelectCalendarExcursions() {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const selection = useAtomValue<Partial<reservation>>(selectionAtom);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<number[]>(getHistoryTemplate());
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [guides, setGuidesState] = useState<number[]>(getGuidesTemplate());

  const [jetskisReserved, setjetskisReserved] = useState(
    getJetskisAndExcursionsTemplate(),
  );

  const rentTime = selection!.selected!.rentTime;

  // const updateJetskisAndGuidesCounter = (
  //   rows: number[],
  //   excursionName?: string,
  // ) => {
  //   setjetskisReserved((prevData) => {
  //     const data = prevData.map((slot, index) => {
  //       if (index >= rows[0] && index <= rows[rows.length - 1]) {
  //         const newCount = slot[0] + 1;
  //         const newExcursions = excursionName
  //           ? [...slot[1], excursionName]
  //           : [...slot[1]];
  //         return [newCount, newExcursions] as [number, string[]];
  //       }
  //       return slot;
  //     });
  //     return data;
  //   });
  // };

  // const pushToHistory = (rows: number | number[], col: number) => {
  //   const populatedMatrix: (number | null)[][] = populateMatrix(rows, col);

  //   setHistory((prevHistory) => {
  //     const newHistory = [...prevHistory, populatedMatrix];

  //     if (newHistory.length > selection.selected?.adults!) {
  //       newHistory.shift();
  //     }

  //     return newHistory;
  //   });
  // };

  // const removeSelectionFromHistory = (
  //   row: number,
  //   col: number,
  //   cellsToSelect: number,
  // ) => {
  //   const matchingIndex = history.findIndex((matrix) =>
  //     matrix.slice(row, row + cellsToSelect).some((row) => row[col] === 1),
  //   );

  //   if (matchingIndex !== -1) {
  //     const historyMatrix = history[matchingIndex];

  //     setMatrixState((prevMatrix) =>
  //       prevMatrix.map((rowArray, rowIndex) =>
  //         rowArray.map((cell, colIndex) =>
  //           historyMatrix[rowIndex][colIndex] === 1 ? 0 : cell,
  //         ),
  //       ),
  //     );

  //     setHistory((prevHistory) => {
  //       const newHistory = [...prevHistory];
  //       newHistory.splice(matchingIndex, 1);
  //       return newHistory;
  //     });
  //   }
  // };

  const deleteHistory = (rows: number[]) => {
    setHistory([]);
  };

  const inhabilitateReservedCells = (arrayOfReservations: Reservation[]) => {
    const updates: [number[], string | undefined][] = [];

    for (const reservation of arrayOfReservations) {
      const { startTime, endTime, excursion, excursionName } = reservation;
      const rows = findTimezoneIndexes(startTime, endTime);

      updates.push([rows, excursion ? excursionName : undefined]);
    }

    console.log(updates);

    setjetskisReserved((prevData) => {
      const data = prevData.map((slot, index) => {
        updates.forEach(([rows, excursionName]) => {
          if (index >= rows[0] && index <= rows[rows.length - 1]) {
            slot[0]++;
            if (excursionName) {
              slot[1] = [...slot[1], excursionName];
            }
          }
        });

        return slot;
      });
      return data;
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const jetskis = await jetskiData();
        const { reservations } = await getReservationsByDate(removeTime(date));
        console.log(reservations);

        setJetskis(jetskis);
        inhabilitateReservedCells(reservations);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [selection]);

  const handleCellClick = (row: number) => {
    const cellsToSelect: number = getCellsToSelect(rentTime);
    const { excursion, excursionName, adults } = selection.selected!;
    const roof: number = row + cellsToSelect;
    const template = getHistoryTemplate();
    let rows = [];

    if (history[row] === 1) {
      setHistory([]);
    }

    if (roof > timeSlots.length) {
      console.log('Cannot select the timeSlot');
      return;
    }

    for (let i = row; i < roof; i++) {
      const jetskisTaken = jetskisReserved[i][0];
      const excursionsArray = jetskisReserved[i][1];
      const isClicked = history[i];

      if (isClicked) {
        setHistory([]);
        return;
      }

      if (jetskisTaken + adults >= 4) {
        console.log(
          'the selection overlaps with existing reservations. No jetskis available in some of said timeSlots',
        );
        return;
      }

      const excursionIndex = excursionsArray.findIndex(
        (excursion) => excursion === excursionName,
      );

      if (excursionIndex === -1 && excursionsArray.length >= 2) {
        console.log('Guides are full for some of the selected timeSlots');
        return;
      }

      rows.push(row);
    }
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

  const cellDisplay = (row: number) => {
    const remainingJetskis = 4 - jetskisReserved[row][0];
    const excursionsBooked = jetskisReserved[row][1];
    const { excursionName, excursion, adults } = selection.selected!;

    let classes = 'cursor-pointer';

    // if cell is selected, show green
    if (history[row] === 1) {
      classes = 'bg-green-500 cursor-pointer';
    }

    // if timeSlot does not have enough jetskis left based on selection, inhabilitate.
    if (remainingJetskis - adults <= 0) {
      classes = 'bg-gray-300 cursor-not-allowed';
    }

    // if user does not have a licence
    if (excursion) {
      // Check if the excursion being reserved is different, and if there are guides available.
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
                      {/* {jetskis!.map((boat, colIndex) => ( */}
                      <td
                        // key={boat.id}
                        className={`td px-4 py-2 ${cellDisplay(rowIndex)}`}
                        onClick={() => handleCellClick(rowIndex)}
                      ></td>
                      {/* ))} */}
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
