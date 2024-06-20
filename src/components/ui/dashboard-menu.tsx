'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';
import { Dialog, Transition } from '@headlessui/react';
import { getToken } from '@/helpers/getToken';
import { checkRole } from '@/helpers/user/isAuthorized';
import useAuth from '@/hooks/use-auth';

const menuDataAdmin = [
  {
    text: 'Overview',
    path: Routes.private.dashboard,
  },
  {
    text: 'Jetskis',
    path: Routes.private.jetskys,
  },
];

const menuDataUser = [
  {
    text: 'Reservation',
    path: Routes.private.reservations,
  },
];

export default function DashboardMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, unauthorize } = useAuth();

  useEffect(() => {
    async function checkUserRole() {
      try {
        const token = getToken();
        const role = await checkRole(token);
        setIsAdmin(true);
      } catch (e: any) {
        console.log(e.message);
        setIsAdmin(false);
      }
    }

    checkUserRole();
  }, []);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const menuData = isAdmin === true ? menuDataAdmin : menuDataUser;

  return (
    <div>
      {/* Menu for larger screens */}
      <div className="hidden md:block">
        <ul className="flex items-center gap-6 lg:gap-8 xl:gap-12 3xl:gap-12">
          {menuData.map((item) => (
            <li key={item.text} className="relative">
              <Link
                href={item.path}
                className={clsx(
                  'inline-block text-base font-normal capitalize text-gray-dark',
                  pathname === item.path && '!font-bold',
                )}
              >
                {item.text}
              </Link>
              {pathname === item.path && (
                <motion.div
                  layoutId="linkUnderline"
                  className="absolute -bottom-5 left-0 h-[2px] w-full rounded-md bg-gray-dark lg:-bottom-6 xl:h-1 2xl:-bottom-7 4xl:-bottom-9"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Button and Modal for mobile screens */}
      <div className="block md:hidden">
        <button
          onClick={openModal}
          className="px-4 py-2 border rounded text-gray-dark"
        >
          Menu
        </button>

        <Transition show={isOpen} as={React.Fragment}>
          <Dialog
            onClose={closeModal}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    Menu
                  </Dialog.Title>
                  <div className="mt-4">
                    {menuData.map((item) => (
                      <button
                        key={item.text}
                        onClick={() => {
                          closeModal();
                          router.push(item.path);
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-dark"
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                  <button
                    className="block w-full rounded-sm px-4 py-2 text-left text-base font-normal text-gray-dark hover:bg-gray-lightest"
                    onClick={() => unauthorize()}
                  >
                    Log out
                  </button>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
