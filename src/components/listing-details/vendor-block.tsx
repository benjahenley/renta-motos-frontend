'use client';

import { useVendor } from '../vendorContext';
import { VendorTypes, ReviewStatsTypes } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Routes } from '@/config/routes';
import { useModal } from '@/components/modals/context';
import Text from '@/components/ui/typography/text';
import Section from '@/components/ui/section';
import Button from '@/components/ui/button';
import Rate from '@/components/ui/rating';

interface VendorProps {
  vendor: VendorTypes;
  stats: ReviewStatsTypes;
}

export default function VendorBlock({ vendor, stats }: VendorProps) {
  const { openModal } = useModal();
  const { selectedVendor } = useVendor()


  if (!selectedVendor) {
    return <div>Vendor not found</div>;
  }

  const selected = selectedVendor.vendor
  // const handleContactHost = () => {
  //   openModal('CONTACT_HOST');
  //   console.log(selected)
  //   console.log(vendor)
  // };
  
  
  return (
    <Section
      className="py-5 xl:py-7"
      title="owner info"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl mb-1.5"
    >
      <div className="mb-6 flex items-center pt-4">
        <Link href={Routes.public.userID('fabio-jaction')}>
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={selected.img}
              alt={selected.name}
              fill
              sizes="(min-width: 320) 100vw, 100vw"
              className="absolute object-cover"
            />
          </div>
        </Link>
        <div className="ml-3 md:ml-6">
          <Text tag="h6">
            <Link href={Routes.public.userID('fabio-jaction')}>
              {selected.name}
            </Link>
          </Text>
          {/* <div className="mt-2 flex items-center">
            <Rate allowHalf allowClear defaultValue={stats.averageRating} />
            <p className="ml-2 text-gray-dark md:ml-3">
              <span>(</span> {selected.totalReview} <span>)</span>
            </p>
          </div> */}
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 leading-[22px] sm:grid-cols-2 md:gap-5 md:text-base">
        <p>
          <span className="text-gray">Member since: </span>
          <span className="ml-1 text-gray-dark">{selected.memberSince}</span>
        </p>
        <p>
          <span className="text-gray">Languages spoken: </span>
          {selected.languages.map((item: string, index) => (
            <span key={item} className="ml-1 text-gray-dark">
              {item}
              {index < selected.languages.length - 1 && ' &'}
            </span>
          ))}
        </p>
        <p>
          <span className="text-gray">Response rate: </span>
          <span className="ml-1 text-gray-dark">
            More than {selected.responseRate}%
          </span>
        </p>
        <p>
          <span className="text-gray">Response time: </span>
          <span className="ml-1 text-gray-dark">{selected.responseTime}</span>
        </p>
      </div>
      <Button
        size="lg"
        variant="outline"
        className="w-full !border-gray-dark !px-4 !py-[8px] !font-bold text-gray-dark hover:bg-gray-dark hover:text-white md:w-auto md:border-gray lg:!px-[28px] lg:!py-[14px]"
        onClick={() => openModal('CONTACT_HOST')}
        // onClick={ handleContactHost}
      >
      
        Send a message
      </Button>
    </Section>
  );
}
