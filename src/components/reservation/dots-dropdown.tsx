'use client';

import {
  cancelReservation,
  deleteReservation,
} from '@/api/reservations/deleteReservation';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { SailBoatIcon } from '../icons/sail-boat';

interface MenuItemProps {
  onClick?: (e: any) => void;
  reservationId: string;
  status: string; // Añadido estado
  onDeleteSuccess: () => void;
}

export default function DotsDropdown({
  onClick,
  reservationId,
  status,
  onDeleteSuccess,
}: MenuItemProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: any) => {
    setLoading(true);
    console.log('Cancelling reservation with ID:', reservationId); // Verifica que el ID se use correctamente
    try {
      await cancelReservation(reservationId);

      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = () => {
    router.push(Routes.public.payment(reservationId));
  };

  return (
    <>
      <Menu as="div" className="relative inline-block">
        <div>
          <Menu.Button className="text-gray-dark">
            <EllipsisHorizontalIcon className="h-auto w-5" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 bottom-full z-10 min-w-[160px] rounded-lg bg-white shadow-lg xl:mb-2 xl:min-w-[192px]">
            <div className="rounded-lg p-2">
              {status === 'pending' && (
                <Menu.Item
                  as="button"
                  type="button"
                  className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm capitalize hover:bg-gray-lightest"
                  onClick={handlePayOrder}
                  id="Pay Order"
                >
                  <SailBoatIcon className="h-auto w-5" />
                  Pay Order
                </Menu.Item>
              )}
              <Menu.Item
                as="button"
                type="button"
                className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm capitalize hover:bg-gray-lightest"
                onClick={handleDelete}
                id="Cancel"
              >
                <TrashIcon className="h-auto w-5" />
                Cancel
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
