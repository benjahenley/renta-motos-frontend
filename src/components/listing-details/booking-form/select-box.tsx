'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Listbox } from '@headlessui/react';
import { ArrowDownIcon } from '@/components/icons/arrow-down';
import Radio from '@/components/ui/form-fields/radio';
import Counter from '@/components/ui/counter';
import Button from '@/components/ui/button';

interface SelectedProps {
  adults: number;
  rentTime: string;
}

interface SelectBoxProps {
  className?: string;
  label?: string;
  defaultSelected: SelectedProps;
  labelClassName?: string;
  onChange: (selected: SelectedProps) => void;
  listing?: any; // Propiedad que contiene el objeto listing
  rentTimeDisabled?: boolean; // Nuevo prop para deshabilitar rentTime
}

export default function SelectBox({
  className,
  defaultSelected,
  onChange,
  listing,
  rentTimeDisabled = false,
}: SelectBoxProps) {
  const [adults, setAdults] = useState(defaultSelected.adults);
  const [rentTime, setRentTime] = useState(defaultSelected.rentTime);

  useEffect(() => {
    onChange({
      adults,
      rentTime,
    });
  }, [adults, rentTime]);

  return (
    <div className={className}>
      <Listbox as="div">
        <div className="relative">
          <Listbox.Button as="div">
            {({ open }) => (
              <button
                className={clsx(
                  'flex h-16 w-full cursor-pointer items-center justify-between rounded-b-lg border border-gray-lighter bg-white px-4 py-2.5 text-left uppercase text-gray-dark focus:outline-none xl:py-3',
                  open && 'border-gray-dark ring-[1px] ring-gray-900/20',
                )}
              >
                <span className="block">
                  {adults} <span className="ml-2">Guests</span>
                </span>
                <span
                  className={clsx(
                    'transition-transform duration-200',
                    open ? '-rotate-180' : 'rotate-0',
                  )}
                >
                  <ArrowDownIcon className="h-4 w-4 font-bold text-gray" />
                </span>
              </button>
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute left-0 mt-1 grid w-full grid-cols-1 gap-3 rounded-lg border border-gray-lighter bg-white p-6 text-base shadow-lg ring-1 ring-gray-lightest">
            <div className="flex w-full items-center justify-between">
              <div className="text-sm xl:text-base">
                <h5 className="font-bold text-gray-dark">Adults</h5>
                <p className="font-normal text-gray xl:mt-1">Age 18+</p>
              </div>
              <Counter
                count={adults}
                countBy={1}
                onCount={(val) => setAdults(val)}
              />
            </div>

            {!rentTimeDisabled && ( // Solo mostrar si no está deshabilitado rentTime
              <div className="flex items-center justify-between">
                <h5 className="text-base font-bold text-gray-dark">
                  Rent time
                </h5>
                <div className="flex items-center gap-3 xl:gap-7">
                  <Radio
                    readOnly
                    label="full day"
                    checked={rentTime === 'fullDay'}
                    onChange={() => setRentTime('fullDay')}
                    className="[&>div>div]:!p-0"
                    labelClassName="!text-sm xl:!text-base"
                    inputClassName={clsx(
                      rentTime === 'fullDay' &&
                        '!border-gray-lightest focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark',
                    )}
                  />
                  <Radio
                    readOnly
                    label="1h"
                    checked={rentTime === '1h'}
                    onChange={() => setRentTime('1h')}
                    className="[&>div>div]:!p-0"
                    labelClassName="!text-sm xl:!text-base"
                    inputClassName={clsx(
                      rentTime === '1h' &&
                        '!border-gray-lightest focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark',
                    )}
                  />
                  <Radio
                    readOnly
                    label="2h"
                    checked={rentTime === '2h'}
                    onChange={() => setRentTime('2h')}
                    className="[&>div>div]:!p-0"
                    labelClassName="!text-sm xl:!text-base"
                    inputClassName={clsx(
                      rentTime === '2h' &&
                        '!border-gray-lightest focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark',
                    )}
                  />
                  <Radio
                    readOnly
                    label="4h"
                    checked={rentTime === '4h'}
                    onChange={() => setRentTime('4h')}
                    className="[&>div>div]:!p-0"
                    labelClassName="!text-sm xl:!text-base"
                    inputClassName={clsx(
                      rentTime === '4h' &&
                        '!border-gray-lightest focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark',
                    )}
                  />
                </div>
              </div>
            )}
            <Listbox.Option className="mt-4" value={0}>
              <Button
                variant="solid"
                className="w-full"
                onClick={() =>
                  onChange({
                    adults: adults,
                    rentTime: rentTime,
                  })
                }
              >
                Apply
              </Button>
            </Listbox.Option>
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
