import SelectCalendarExcursions from '@/components/calendar/selectCalendarExcursions';

export default function SelectCalendar() {
  return (
    <>
      <SelectCalendarExcursions></SelectCalendarExcursions>
    </>
    // <div className={clsx('container mb-12 mt-8 px-4 lg:mb-16')}>
    //   <div className="m-auto w-full max-w-7xl rounded-lg border border-gray-200 bg-white p-6 pt-9 sm:p-12">
    //     {!jetskiIds || timezonesState.length === 0 ? (
    //       <div>LOADING...</div>
    //     ) : (
    //       <>
    //         <div className="mb-8">
    //           <h2 className="mb-3 text-3xl font-bold uppercase leading-[48px] text-primary text-center">
    //             DATE: {date.getDate()}/{date.getMonth() + 1}/
    //             {date.getFullYear()}
    //           </h2>
    //           <p className="text-base leading-5 text-gray"></p>
    //           <p className="text-base leading-5 text-gray">
    //             Adults: {selection.selected?.adults}
    //           </p>
    //           <p className="text-base leading-5 text-gray">
    //             Type: {selection.selected?.rentTime}
    //           </p>
    //         </div>
    //         <div className="overflow-x-auto">
    //           <table className="extratable min-w-full border-collapse border border-gray-400">
    //             <thead className="thead">
    //               <tr>
    //                 <th className="thh px-4 py-2">Times</th>

    //                 {jetskiIds!.map((id) => (
    //                   <th key={id} className="thh px-4 py-2">
    //                     {/* ICON */}Boat
    //                   </th>
    //                 ))}
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {timezonesState.map((slot, rowIndex) => (
    //                 <tr className="tr" key={rowIndex}>
    //                   <td className="td px-4 py-2">{slot}</td>
    //                   {jetskiIds!.map((boat, colIndex) => (
    //                     <td
    //                       key={boat}
    //                       className={`td px-4 py-2 ${cellDisplay(
    //                         rowIndex,
    //                         colIndex,
    //                       )}`}
    //                       onClick={() => handleCellClick(rowIndex, colIndex)}
    //                     ></td>
    //                   ))}
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>

    //         <div>
    //           <Button
    //             disabled={
    //               history.length === selection.selected?.adults! ? false : true
    //             }
    //             size="xl"
    //             rounded="lg"
    //             type="submit"
    //             variant="solid"
    //             className="mt-4 w-full !py-[14px] text-base !font-bold uppercase tracking-widest"
    //             onClick={handleSubmit}
    //           >
    //             {loading ? 'Processing...' : 'Create Reservation'}
    //           </Button>
    //         </div>
    //       </>
    //     )}
    //   </div>
    //   {loading && (
    //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    //       Loading...
    //     </div>
    //   )}
    // </div>
  );
}
