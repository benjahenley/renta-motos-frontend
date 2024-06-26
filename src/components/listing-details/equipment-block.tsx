'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Image from 'next/image';
import RevealContent from '@/components/ui/revel-content';
import Section from '@/components/ui/section';
import { EquipmentsTypes } from '@/types';
import { VendorTypes } from '@/types';
import { useAtom } from 'jotai';
import { selectionAtom } from '@/atoms/reservation'; 

interface EquipmentBlock {
  vendor: VendorTypes;
}

export default function EquipmentBlock({ vendor }: EquipmentBlock) {

  return (
    <Section
      className="py-5 pt-2 xl:py-7"
      title="Trip Details"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl mb-2"
    >
      {/* <p>{vendor.name}</p> */}
      <RevealContent defaultHeight={100} buttonText="View more">
        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-3">
          <>
            <div className="flex items-center">
              <div className="relative mr-1 h-10 w-10">
                <AccessTimeIcon style={{ fontSize: '2.5rem' }}/>
              </div>
              <p className="capitalize leading-6 !text-secondary">
                {vendor.triptime}
              </p>
            </div>
            <div  className="flex items-center">
              <div className="relative mr-1 h-10 w-10">
                <AttachMoneyIcon style={{ fontSize: '2.5rem' }}/>
              </div>
              <p className="capitalize leading-6 !text-secondary">
                {vendor.pricestring}
              </p>
            </div></>
        </div>
      </RevealContent>
    </Section>
  );
}
