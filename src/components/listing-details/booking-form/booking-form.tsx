'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { z } from 'zod';
import SelectBox from '@/components/listing-details/booking-form/select-box';
import DateTime from '@/components/ui/form-fields/date-time-picker';
import Button from '@/components/ui/button';
import { useModal } from '@/components/modals/context';
import { useAtom, useSetAtom } from 'jotai';
import { selectionAtom } from '@/atoms/reservation';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { getToken } from '@/helpers/getToken';
import { excursionAtom } from '@/atoms/excursion'; // Ajusta la ruta según tu estructura de proyecto

interface BookingFormProps {
  price: number;
  averageRating: number;
  totalReviews: number;
  listing: any;
  slug: string;
  className?: string;
}

const rentTimeOptions = ['1h', '2h', '4h', 'fullDay'] as const;
type RentTime = (typeof rentTimeOptions)[number];

const BookingSchema = z.object({
  startDate: z.date().min(new Date(), { message: 'Invalid Start Date!' }),
  selected: z.object({
    adults: z.number().min(1, 'Minimum 1 Adult required!'),
    rentTime: z.enum(rentTimeOptions),
  }),
});

type BookingSchemaType = z.infer<typeof BookingSchema>;

export default function BookingForm({
  price,
  averageRating,
  totalReviews,
  className,
  listing,
  slug,
}: BookingFormProps) {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSchemaType>({
    defaultValues: {
      selected: {
        adults: 1,
        rentTime: 'fullDay',
      },
    },
    resolver: zodResolver(BookingSchema),
  });

  const router = useRouter();
  const { openModal } = useModal();
  const [error, setError] = useState<string | undefined>();
  const [rentTime, setRentTime] = useState<RentTime>('2h');
  const [adults, setAdults] = useState<number>(1);
  const [selection, setSelection] = useAtom(selectionAtom);
  const [focus, setFocus] = useState<boolean>(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(450);
  const [minEndDate, setMinEndDate] = useState<Date | null>(null);

  const rentPrices: Record<RentTime, number> = {
    '1h': 100,
    '2h': 250,
    '4h': 300,
    fullDay: 450,
  };

  useEffect(() => {
    const price = rentPrices[rentTime] * adults;
    setCalculatedPrice(price);
  }, [rentTime, adults]);

  async function handleBooking(data: any) {
    const date = new Date(data.startDate).toISOString();

    const newSelection = {
      ...selection,
      adults: data.selected.adults,
      rentTime: data.selected.rentTime,
      date,
    };

    setSelection(newSelection);

    console.log('SELECTION:', newSelection);

    try {
      const token = getToken();
      if (!token) {
        openModal('SIGN_IN');
        return;
      }

      router.push(Routes.private.selectCalendar);
    } catch (e) {
      console.error('Error checking token:', e);
      openModal('SIGN_IN');
    }
  }

  function onError(errors: any) {
    console.log('Form errors:', errors);
    if (typeof errors === 'object') return;
    setError(errors);
  }

  return (
    <form
      onError={() => console.log(errors)}
      noValidate
      onSubmit={handleSubmit(handleBooking, onError)}
      className={clsx(
        'rounded-xl border border-gray-lighter bg-white p-8 shadow-card',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-bold text-gray-dark xl:text-[22px]">
          ${price} Euro <span className="text-base"></span>
        </p>
      </div>
      <div
        className={clsx(
          'relative mt-6 grid grid-cols-2 gap-3 rounded-t-lg border border-b-0 border-gray-lighter',
          focus && '!border-b !border-gray-dark ring-[1px] ring-gray-900/20',
        )}
        onBlur={() => setFocus(false)}
      >
        <span className="absolute left-4 top-3 inline-block -translate-x-3 scale-75 text-sm font-semibold uppercase text-gray-dark">
          Day Trip
        </span>

        <Controller
          name="startDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTime
              onFocus={(e) => {
                e.target.blur();
                setFocus(true);
              }}
              onClickOutside={() => setFocus(false)}
              placeholderText="Add date"
              minDate={new Date()}
              selected={value}
              onChange={(date: Date) => {
                setMinEndDate(date);
                onChange(date);
              }}
              selectsStart
              startDate={getValues('startDate')}
              dateFormat="eee dd / LL / yy"
              popperClassName="!translate-x-0 !right-0 !top-full booking-form-calendar"
              inputClassName="border-0 !text-base text-gray-dark !h-16 pt-5"
            />
          )}
        />
      </div>
      <Controller
        name="selected"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectBox
            defaultSelected={value}
            onChange={({ rentTime, adults }) => {
              setRentTime(rentTime as any);
              setAdults(adults as any);
              onChange({ rentTime, adults });
            }}
            rentTimeDisabled={listing.triptime !== undefined}
          />
        )}
      />
      <p className="flex items-center justify-between text-xs text-danger">
        <span>{errors.startDate?.message}</span>
        <span>{errors.selected?.adults?.message}</span>
        {error && <span>{error}</span>}
      </p>
      <Button
        size="xl"
        rounded="lg"
        type="submit"
        variant="solid"
        className="mt-4 w-full !py-[14px] text-base !font-bold uppercase tracking-widest"
      >
        Check availability
      </Button>
      <ul className="mt-3 xl:mt-5">
        <li className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0">
          <span className="font-normal"> {rentTime} Rent Time</span>
          <span className="font-bold">${calculatedPrice}</span>
        </li>
        {/* {list.map((item) => (
          <li
            key={item.title}
            className="flex items-center justify-between py-1.5 text-base capitalize text-gray-dark first:pt-0 last:border-t last:border-gray-lighter last:pb-0"
          >
            <span className="font-normal">{item.title}</span>
            {item.type === 'discount' ? (
              <span className="font-bold text-red">-${item.money}</span>
            ) : (
              <span className="font-bold">${item.money}</span>
            )}
          </li>
        ))} */}
      </ul>
    </form>
  );
}
