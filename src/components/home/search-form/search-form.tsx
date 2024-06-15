'use client';

import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { makeQueryString } from '@/utils/makeQueryString';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { useTranslation } from 'next-i18next';

type QueryStringType = {
  location?: string;
  departureDate: string;
  returnDate: string;
};

export default function FindTripForm() {
  // const { t } = useTranslation('common');
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchBox, setSearchBox] = useState<any>();
  const [locationInput, setLocationInput] = useState({
    searchedLocation: '',
    searchedPlaceAPIData: [],
  });

  const onLoad = (ref: any) => setSearchBox(ref);
  const onPlacesChanged = () => {
    const places = searchBox?.getPlaces();
    setLocationInput({
      searchedLocation: places && places[0] && places[0].formatted_address,
      searchedPlaceAPIData: places ? places : [],
    });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    // Supongamos que tienes un slug específico
    const specificSlug = 'listing/listing-1';

    // Construye la URL con el slug
    const slugUrl = `${specificSlug}`;

    let queryString = '';
    const queryObj: QueryStringType = {
      location: locationInput.searchedLocation,
      departureDate: format(startDate, 'yyyy-MM-dd'),
      returnDate: format(endDate, 'yyyy-MM-dd'),
    };
    queryString = makeQueryString(queryObj);
    // router.push(`${Routes.public.explore}?${queryString}`);
    router.push(slugUrl);
  };

  return (
    <form
      noValidate
      onSubmit={handleFormSubmit}
      className="relative z-[2] w-full max-w-[450px] min-h-[190px] sm:min-h-[465px] rounded-lg bg-white p-6 shadow-2xl sm:m-0 sm:max-w-[380px] sm:p-7 sm:pt-9 md:max-w-[400px] md:shadow-none lg:rounded-xl xl:max-w-[460px] xl:p-9 4xl:max-w-[516px] 4xl:p-12 flex flex-col justify-between lg:mt-8"
    >
      <div className="mb-3 sm:mb-0 flex-grow">
        <span className="mb-2 hidden font-satisfy text-xl leading-7 text-gray-dark sm:block 4xl:text-[28px] 4xl:leading-[44px]">
        Enjoy your ride in a unique way
        {/* {t('searchform1')} */}
        </span>
        <Text
          tag="h1"
          className="leading-12 mb-2 !text-xl text-center sm:text-left !font-black uppercase text-gray-dark sm:!text-[28px] sm:!leading-9  4xl:!text-4xl 4xl:!leading-[52px] sm:mt-20"
        >
          Experience <br className="hidden sm:block" />
          our aquatic bikes
        </Text>

      </div>

      <div className="mt-auto flex flex-col justify-end">
      <Text className="mb-5 hidden leading-6 !text-secondary sm:block 3xl:leading-8 4xl:mb-6 4xl:text-lg">
          Go check our equipment and do your reservation.
        </Text>
        <Button
          type="submit"
          className="w-full !py-[14px] text-sm !font-bold uppercase leading-6 md:!py-[17px] md:text-base lg:!rounded-xl 3xl:!py-[22px]"
          rounded="lg"
          size="xl"
        >
          Go check availability
        </Button>
      </div>
    </form>
  );
}
