'use client';

import { vendorData } from 'public/data/listing-details';
import { reviewsData } from 'public/data/reviews';
import SpecificationBlock from '@/components/listing-details/specification-block';
import BookingForm from '@/components/listing-details/booking-form/booking-form';
import CalenderBlock from '@/components/listing-details/calendar/calender-block';
import ListingDetailsHeroBlock from '@/components/listing-details/hero-block';
import DescriptionBlock from '@/components/listing-details/descripton-block';
import EquipmentBlock from '@/components/listing-details/equipment-block';
import LocationBlock from '@/components/listing-details/location-block';
// import ReviewBlock from '@/components/listing-details/review-block';
import VendorBlock from '@/components/listing-details/vendor-block';
// import ChatBlock from '@/components/listing-details/chat-block';
import { useModal } from '@/components/modals/context';
import Button from '@/components/ui/button';
import { useAtom, useSetAtom } from 'jotai';
import { selectionAtom } from '@/atoms/reservation';
import { useEffect } from 'react';

const rentTimeArray: Record<string, string> = {
  'isla-margarita': '1h',
  'cala-salada': '30min',
  'cala-comte': '1h',
  'cala-ubarca': '1h 30',
  portixol: '2h',
  'isla-es-vedra': '2h',
};

export default function ListingDetails({
  vendor,
  slug,
}: {
  vendor: any;
  slug: string;
}) {
  const { openModal } = useModal();
  const setSelection = useSetAtom(selectionAtom);

  useEffect(() => {
    const setSelectionData = () => {
      const excursion = slug !== 'listing-1' ? true : false;
      const excursionName = slug;
      const rentTime = vendor.triptime;

      setSelection({ excursion, excursionName, rentTime });
    };

    setSelectionData();
  }, []);

  return (
    <>
      <div className="flex justify-between gap-5 lg:gap-8 xl:gap-12 4xl:gap-16">
        <div className="w-full">
          <ListingDetailsHeroBlock vendor={vendor} />
          <DescriptionBlock vendor={vendor} />
          {/* <EquipmentBlock vendor={vendor} /> */}
          {/* <SpecificationBlock specifications={vendor.specifications} /> */}
          {/* <VendorBlock stats={reviewsData.stats} vendor={vendor.vendor} /> */}
          {/* <LocationBlock /> */}
          {/* <CalenderBlock /> */}
          {/* <ReviewBlock reviewsData={reviewsData} /> */}
          {/* <ChatBlock /> */}
        </div>
        <div className="hidden w-full max-w-sm pb-11 lg:block xl:max-w-md 3xl:max-w-lg">
          <div className="sticky top-32 4xl:top-40">
            <BookingForm
              listing={vendor}
              price={vendor.price}
              averageRating={reviewsData.stats.averageRating}
              totalReviews={reviewsData.stats.totalReview}
              slug={vendor.slug}
            />
          </div>
        </div>
      </div>
    </>
  );
}
