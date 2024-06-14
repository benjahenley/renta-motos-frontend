// import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
// import { useAtom, useAtomValue } from 'jotai';
// import { reservation, selectionAtom } from '@/atoms/reservation';
// import Button from '@/components/ui/button';
// import { getJetskis } from '@/api/get-jetskis/useGetJetskis';
// import { getToken } from '@/helpers/getToken';
// import { getReservationsByDate } from '@/api/reservations/getReservationsByDate';
// import {
//   formatDateToISOWithoutTime,
//   formatDateToISOWithoutTime as removeTime,
// } from '@/helpers/formatDate';
// import { useModal } from '../modals/context';
// import { Routes } from '@/config/routes';
// import { useRouter } from 'next/navigation';
// import { createOrder } from '@/api/order/createOrder';
// import { orderAtom } from '@/atoms/order';
// import {
//   findJetskiIndex,
//   findTimezoneIndexes,
//   getCellsToSelect,
//   getGuidesTemplate,
//   getMatrixTemplate,
//   populateMatrix,
//   timeSlots,
// } from '@/helpers/matrix-formation';
// import { Reservation } from '@/interfaces/jetski';
// import { addMinutesToTime } from '@/helpers/extract-time';

// const matrix: (number | string[])[][] = [
//   [2, ['excursion2', 'excursion1']],
//   [1, ['excursion2']],
//   [0, ['excursion2', 'excursion1']],
//   [1, ['excursion2', 'excursion1']],
//   [1, ['excursion2']],
//   [2, ['excursion2', 'excursion1']],
//   [0, []],
// ];

// const params = ['excursionName', 'startTime', 'endTime'];

// export default function SelectCalendar() {
//   const { openModal, closeModal } = useModal();
//   const router = useRouter();
//   const selection = useAtomValue<Partial<reservation>>(selectionAtom);

//   const [loading, setLoading] = useState(false);
//   const [matrixState, setMatrixState] =
//     useState<(number | null)[][]>(getMatrixTemplate());
//   const [history, setHistory] = useState<any[][][]>([]);
//   const [jetskiIds, setJetskiIds] = useState<string[] | null>(null);
//   const [guides, setGuidesState] = useState<number[]>(getGuidesTemplate());

//   const rentTime = selection!.selected!.rentTime;

//   const updateMatrix = (
//     rows: number[] | number,
//     col: number,
//     data: 0 | 1 | null,
//   ) => {
//     setMatrixState((prevMatrix) => {
//       const newMatrix = prevMatrix.map((row, rowIndex) =>
//         Array.isArray(rows)
//           ? row.map((cell, colIndex) =>
//               rows.includes(rowIndex) && colIndex === col ? data : cell,
//             )
//           : rowIndex === rows
//             ? row.map((cell, colIndex) => (colIndex === col ? data : cell))
//             : row,
//       );
//       return newMatrix;
//     });
//   };

//   const updateGuideCounter = (rows: number[], value: '+' | '-') => {
//     setGuidesState((prevGuides) =>
//       prevGuides.map((count, index) =>
//         rows.includes(index) ? count + (value === '+' ? 1 : -1) : count,
//       ),
//     );
//   };

//   const pushToHistory = (rows: number | number[], col: number) => {
//     const populatedMatrix: (number | null)[][] = populateMatrix(rows, col);

//     setHistory((prevHistory) => {
//       const newHistory = [...prevHistory, populatedMatrix];

//       if (newHistory.length > selection.selected?.adults!) {
//         newHistory.shift();
//       }

//       return newHistory;
//     });
//   };

//   const removeSelectionFromHistory = (
//     row: number,
//     col: number,
//     cellsToSelect: number,
//   ) => {
//     const matchingIndex = history.findIndex((matrix) =>
//       matrix.slice(row, row + cellsToSelect).some((row) => row[col] === 1),
//     );

//     if (matchingIndex !== -1) {
//       const historyMatrix = history[matchingIndex];

//       setMatrixState((prevMatrix) =>
//         prevMatrix.map((rowArray, rowIndex) =>
//           rowArray.map((cell, colIndex) =>
//             historyMatrix[rowIndex][colIndex] === 1 ? 0 : cell,
//           ),
//         ),
//       );

//       setHistory((prevHistory) => {
//         const newHistory = [...prevHistory];
//         newHistory.splice(matchingIndex, 1);
//         return newHistory;
//       });
//     }
//   };

//   const inhabilitateReservedCells = (arrayOfReservations: Reservation[]) => {
//     for (var reservation of arrayOfReservations) {
//       let { jetskiId, startTime, endTime, excursion, excursionName } =
//         reservation;
//       const col = findJetskiIndex(jetskiId);
//       const rows = findTimezoneIndexes(startTime, endTime);

//       if (excursion) {
//         updateGuideCounter(rows, '+', excursionName);
//       }

//       updateMatrix(rows, col, null);
//     }
//   };

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const { jetskis } = await getJetskis();
//         const { reservations } = await getReservationsByDate(removeTime(date));

//         setJetskiIds(jetskis.map((jetski) => jetski.id));
//         inhabilitateReservedCells(reservations);
//       } catch (error) {
//         console.error('Error fetching items:', error);
//       }
//     };

//     fetchItems();
//   }, [selection]);

//   const handleCellClick = (row: number, col: number) => {
//     const currentMatrix: (number | null)[][] = [...matrixState];
//     const cellsToSelect: number = getCellsToSelect(rentTime);
//     const selectedCell: number | null = currentMatrix[row][col];
//     const roof: number = row + cellsToSelect;
//     const rows: number[] = [];

//     if (roof > timeSlots.length) {
//       console.log('Cannot select the timeSlot');
//       return;
//     }

//     for (let i = row; i < roof; i++) {
//       const cell = currentMatrix[i][col];

//       if (cell === null) {
//         console.log('The selection overlaps with an existing reservation');
//         return;
//       }

//       if (cell === 1) {
//         console.log(
//           'The selection overlaps with an existing selection, deleting previous one',
//         );
//         removeSelectionFromHistory(row, col, cellsToSelect);
//         return;
//       }

//       rows.push(i);
//     }

//     if (selectedCell === 0) {
//       if (history.length === selection.selected?.adults!) {
//         console.log('Reached limit of selections');
//         return;
//       }
//       // if ((cellsToSelect = 1)) {
//       //   updateMatrix(row, col, 1);
//       //   pushToHistory(row, col);
//       //   return;
//       // }

//       updateMatrix(rows, col, 1);
//       updateGuideCounter(rows, '+');
//       pushToHistory(rows, col);
//     } else if (selectedCell === 1) {
//       console.log('removing selection');
//       removeSelectionFromHistory(row, col, cellsToSelect);
//       return;
//     } else {
//       console.log('selection is null');
//       return;
//     }
//   };

//   async function handleSubmit(e: any) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         closeModal();
//         openModal('SIGN_IN');
//         setLoading(false);
//         return;
//       }

//       const reservationsArray: any[] = [];

//       history.forEach((matrix) => {
//         let timeSlotIndexes: number[] = [];
//         let jetskiIndex = 0;

//         for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
//           for (let colIndex = 0; colIndex < jetskiIds?.length!; colIndex++) {
//             if (matrix[rowIndex][colIndex] === 1) {
//               timeSlotIndexes!.push(rowIndex);
//               jetskiIndex = colIndex;
//             }
//           }
//         }

//         const date = formatDateToISOWithoutTime(selection.startDate!);
//         let jetskiId = jetskiIds![jetskiIndex];
//         let startTimeData = timeSlots[timeSlotIndexes[0]];
//         let endTimeData =
//           timeSlots[timeSlotIndexes[timeSlotIndexes.length - 1]];

//         let endTimePlusHalfAnHour = addMinutesToTime(endTimeData, 30);

//         let startTime = new Date(
//           `${date}T${startTimeData}:00.000Z`,
//         ).toISOString();

//         let endTime = new Date(
//           `${date}T${endTimePlusHalfAnHour}:00.000Z`,
//         ).toISOString();

//         reservationsArray.push({
//           date,
//           startTime,
//           endTime,
//           jetskiId,
//           excursion: selection.selected!.excursion,
//           excursionName: selection.selected!.excursionName,
//         });
//       });

//       const orderData = {
//         adults: reservationsArray.length,
//         reservations: reservationsArray,
//       };

//       const { orderId } = await createOrder(token, orderData);

//       if (!orderId) {
//         throw new Error('Error creating reservation');
//       }

//       router.push(`${Routes.public.payment}/${orderId}`);
//     } catch (e: any) {
//       console.log(e.message);
//       alert(e.message);
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   }

//   const date = new Date(selection.startDate!);

//   const cellDisplay = (row: number, col: number) => {
//     const cellState = matrixState[row][col];
//     return cellState === null
//       ? 'bg-gray-300 cursor-not-allowed'
//       : cellState === 1
//         ? 'bg-green-500 cursor-pointer'
//         : 'cursor-pointer';
//   };

//   return (
//     <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
//       <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
//         {!jetskiIds || timeSlots.length === 0 ? (
//           <div>LOADING...</div>
//         ) : (
//           <>
//             <div className="mb-8">
//               <h2 className="mb-3 text-3xl font-bold uppercase leading-[48px] text-primary text-center">
//                 DATE: {date.getDate()}/{date.getMonth() + 1}/
//                 {date.getFullYear()}
//               </h2>
//               <p className="text-base leading-5 text-gray"></p>
//               <p className="text-base leading-5 text-gray">
//                 Adults: {selection.selected?.adults}
//               </p>
//               <p className="text-base leading-5 text-gray">
//                 Type: {selection.selected?.rentTime}
//               </p>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="extratable min-w-full border-collapse border border-gray-400">
//                 <thead className="thead">
//                   <tr>
//                     <th className="thh px-4 py-2">Times</th>

//                     {jetskiIds!.map((id) => (
//                       <th key={id} className="thh px-4 py-2">
//                         {/* ICON */}Boat
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {timeSlots.map((slot, rowIndex) => (
//                     <tr className="tr" key={rowIndex}>
//                       <td className="td px-4 py-2">{slot}</td>
//                       {jetskiIds!.map((boat, colIndex) => (
//                         <td
//                           key={boat}
//                           className={`td px-4 py-2 ${cellDisplay(
//                             rowIndex,
//                             colIndex,
//                           )}`}
//                           onClick={() => handleCellClick(rowIndex, colIndex)}
//                         ></td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div>
//               <Button
//                 disabled={
//                   history.length === selection.selected?.adults! ? false : true
//                 }
//                 size="xl"
//                 rounded="lg"
//                 type="submit"
//                 variant="solid"
//                 className="mt-4 w-full !py-[14px] text-base !font-bold uppercase tracking-widest"
//                 onClick={handleSubmit}
//               >
//                 {loading ? 'Processing...' : 'Create Reservation'}
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           Loading...
//         </div>
//       )}
//     </div>
//   );
// }
