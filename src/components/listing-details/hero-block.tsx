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
import EuroIcon from '@mui/icons-material/Euro';

interface ListingDetailsHeroBlockProps {
  vendor: VendorTypes;
  rentTime: string;
}

export default function ListingDetailsHeroBlock({
  vendor,
  rentTime,
}: ListingDetailsHeroBlockProps) {
  const [calculatedPrice] = useAtom(calculatedPriceAtom); // Use the atom here
  const [selection] = useAtom(selectionAtom); // Use the atom to get rentTime
  
  const rentime = selection.rentTime;
  console.log('tu rentime', rentime);

  return (
    <div className="flex justify-between items-center border-b border-gray-lighter pb-6 md:pb-8 2xl:pb-10">
      <div>
        <Text
          tag="h2"
          className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
        >
          {vendor.name}
        </Text>
      </div>
      <div className="!leading-7 md:!leading-10">
        <div className="mt-4 grid gap-1 grid-cols-2">
          <div className="flex items-center ">
            <div className=" mr-1 h-10 w-8">
              <AccessTimeIcon style={{ fontSize: '1.8rem' }} />
            </div>
            <p className="capitalize leading-6 text-xl pr-3 pb-2 sm:pb-0 !text-secondary">
              {vendor.triptime ? vendor.triptime : rentTime}
            </p>
          </div>
          <div className="flex items-center">
            <div className=" ml-6 h-10 w-8">
              <EuroIcon style={{ fontSize: '1.8rem' }} />
            </div>
            <p className="capitalize leading-6 text-xl pb-2 sm:pb-0 !text-secondary">
              {calculatedPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
