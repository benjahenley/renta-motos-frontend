'use client';

import { VendorTypes } from '@/types';
import { Menu } from '@headlessui/react';
import { HeartIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { ShareIcon } from '@/components/icons/share-icon';
import { useModal } from '@/components/modals/context';
import Text from '@/components/ui/typography/text';
import { useAtom } from 'jotai';
import { selectionAtom } from '@/atoms/reservation'; 
import { calculatedPriceAtom } from '@/atoms/price'; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface ListingDetailsHeroBlockProps {
  vendor: VendorTypes;
  rentTime: string;
}

// share icons
// function ShareIcons() {
//   const { openModal } = useModal();
//   return (
//     <div className="mt-1 hidden items-center gap-3 bg-white md:flex 3xl:gap-6">
//       <Button
//         className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
//         size="sm"
//         variant="outline"
//         rounded="pill"
//         onClick={() => openModal('SHARE')}
//       >
//         <ShareIcon className="h-auto w-5" />
//       </Button>
//       {/* <Button
//         className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
//         size="sm"
//         variant="outline"
//         rounded="pill"
//       >
//         <HeartIcon className="h-auto w-5" />
//       </Button> */}
//     </div>
//   );
// }

// function ShareMenu() {
//   const { openModal } = useModal();
//   return (
//     <Menu as="div" className="relative md:hidden">
//       <div>
//         <Menu.Button className="h-6 w-6 rounded-full border-none outline-none hover:ring-2 hover:ring-gray-lighter">
//           <EllipsisHorizontalIcon className="h-6 w-6" />
//         </Menu.Button>
//         <Menu.Items className="absolute right-0">
//           <div className="flex w-[150px] flex-col rounded-lg bg-white py-1 shadow-card">
//             <Menu.Item>
//               <button
//                 onClick={() => openModal('SHARE')}
//                 className="border-gray-lightest py-2 text-base font-medium text-gray-dark hover:bg-gray-lightest"
//               >
//                 Share Now
//               </button>
//             </Menu.Item>
//             <Menu.Item>
//               <button className="border-gray-lightest py-2 text-base font-medium text-gray-dark hover:bg-gray-lightest">
//                 Add to wishlist
//               </button>
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </div>
//     </Menu>
//   );
// }

export default function ListingDetailsHeroBlock({
  vendor,
  rentTime,
}: ListingDetailsHeroBlockProps) {
  const [calculatedPrice] = useAtom(calculatedPriceAtom); // Use the atom here
  const [selection] = useAtom(selectionAtom); // Use the atom to get rentTime
  
  const rentime = selection.rentTime
  console.log('tu rentime', rentime)

  return (
    <div className="flex justify-between border-b border-gray-lighter pb-6 md:pb-8 2xl:pb-10">
      <div>
        {/* <p className="text-gray-dark">{vendor.location}</p> */}
        <Text
          tag="h2"
          className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
        >
          {vendor.name}
        </Text>
        {/* <div className="mt-3 flex items-center gap-2 leading-4 text-gray-dark md:mt-4">
          <p>{vendor.boatGuests} guests</p>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          <p>{vendor.boatCabins} cabins</p>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          <p>{vendor.boatBathrooms} bathrooms</p>
        </div> */}
      </div>
      <div className="relative flex flex-end">
        <div className="mt-4 grid gap-1 grid-cols-2">
          <div className="flex items-center">
            <div className="relative mr-1 h-10 w-10">
              <AccessTimeIcon style={{ fontSize: '2.5rem' }} />
            </div>
            <p className="capitalize leading-6 !text-secondary">
              {/* PIJAAA */}
              {rentTime} 
              </p>
          </div>
          <div className="flex items-center">
            <div className="relative mr-1 h-10 w-10">
              <AttachMoneyIcon style={{ fontSize: '2.5rem' }} />
            </div>
            <p className="capitalize leading-6 !text-secondary">
              ${calculatedPrice}
            </p>
          </div>
        </div>
        {/* <ShareMenu /> */}
        {/* <ShareIcons /> */}
      </div>
    </div>
  );
}
