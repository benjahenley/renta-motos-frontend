'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/ui/avatar';
import { Routes } from '@/config/routes';


interface MenuItemProps {
  text: string;
  link?: string;
}

const menu = {
  top: [
    {
      path: Routes.private.inbox,
      text: 'Message',
    },
    {
      path: Routes.private.trips,
      text: 'Trips',
    },
    {
      path: Routes.private.wishlist,
      text: 'Wishlist',
    },
  ],
  bottom: [
    {
      text: 'Dashboard',
    },
    // {
    //   path: Routes.private.accountSettings,
    //   text: 'settings',
    // },
    {
      path: Routes.public.help,
      text: 'Help',
    },
  ],
};

function MenuItem({ text, link }: MenuItemProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          href={link || ''}
          className={clsx(
            'block rounded-sm px-5 py-2 text-base font-normal capitalize text-gray-dark',
            active && 'bg-gray-lightest',
          )}
        >
          {text}
        </Link>
      )}
    </Menu.Item>
  );
}

export default function ProfileMenu({ className }: { className?: string }) {
  const { user, unauthorize, isAdmin } = useAuth();
  const router = useRouter();

  const handleDashboardClick = async () => {
    try {
      const isAdminUser = await isAdmin();
      if (isAdminUser) {
        router.push(Routes.private.dashboard);
      } else {
        router.push(Routes.private.reservations);
      }
    } catch (error) {
      console.error(error);
      router.push(Routes.private.reservations);
    }
  };

  return (
    <>
      <Menu
        as="div"
        className={clsx(
          'relative h-9 w-9 rounded-full bg-white shadow-card sm:h-10 sm:w-10 2xl:h-12 2xl:w-12 2xl:border 2xl:border-gray-lighter 2xl:p-[3px]',
          className,
        )}
      >
        <Menu.Button className="relative h-full w-full rounded-full bg-white">
          <Avatar
            className="cursor-pointer"
            src={user?.photoURL ?? ''}
            rounded="full"
            size="100%"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-lighter rounded-md bg-white py-2 shadow-card focus:outline-none">
            <div className="pb-3 pl-5">{user.displayName}</div>
            <div className="pt-1">
              {menu.bottom.map((item) =>
                item.text === 'Dashboard' ? (
                  <Menu.Item key={item.text}>
                    {({ active }) => (
                      <button
                        onClick={handleDashboardClick}
                        className={clsx(
                          'block w-full rounded-sm px-5 py-2 text-left text-base font-normal text-gray-dark',
                          active && 'bg-gray-lightest',
                        )}
                      >
                        {item.text}
                      </button>
                    )}
                  </Menu.Item>
                ) : (
                  <MenuItem key={item.text} text={item.text} link={item.path} />
                ),
              )}
              <Menu.Item
                className="block w-full rounded-sm px-5 py-2 text-left text-base font-normal text-gray-dark hover:bg-gray-lightest"
                as="button"
                onClick={() => unauthorize()}
              >
                Log out
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}

