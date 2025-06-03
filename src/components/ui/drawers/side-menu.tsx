'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  CubeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { drawerStateAtom } from '@/components/drawers/view';
import ActionIcon from '@/components/ui/action-icon';
import { Routes } from '@/config/routes';
import Logo from '@/components/ui/logo';
import { WhatsappIcon } from '@/components/icons/whatsapp-icon';
import { InstaIcon } from '@/components/icons/instagram-icon';
import { FBIcon } from '@/components/icons/fb-icon';


const menu = [
  {
    name: 'home',
    icon: <HomeIcon className="h-auto w-5" />,
    path: Routes.public.home,
  },
  {
    name: 'Whatsapp',
    icon: <WhatsappIcon className="h-auto w-5" />,
    path: 'https://wa.me/34642973276',
    color: '#03B603',
  },
  {
    icon: <InstaIcon className="h-auto w-5" />,
    path: 'https://www.instagram.com/ibijetrent/',
    color: '#6A0AB5',
    name: 'Instagram',
  },
  {
    icon: <FBIcon className="h-auto w-5" />,
    path: 'https://www.facebook.com/ibijetrent?mibextid=LQQJ4d',
    color: '#2DA3DE',
    name: 'Facebook',
  },
  // {
  //   name: 'explore',
  //   icon: <MagnifyingGlassIcon className="h-auto w-5" />,
  //   path: Routes.public.explore,
  // },
  // {
  //   name: 'pricing',
  //   icon: <CubeIcon className="h-auto w-5" />,
  //   path: Routes.public.pricing,
  // },
  // {
  //   name: 'settings',
  //   icon: <Cog6ToothIcon className="h-auto w-5" />,
  //   path: Routes.private.accountSettings,
  // },
  {
    name: 'help',
    icon: <InformationCircleIcon className="h-auto w-5" />,
    path: Routes.public.help,
  },
];

interface navListTypes {
  navListItem: {
    name: string;
    icon?: React.ReactNode;
    path: string;
  }[];
}

function List({ navListItem }: navListTypes) {
  const pathname = usePathname();
  return (
    <ul className="mt-4 pt-4">
      {navListItem.map((item) => (
        <li
          key={item.name}
          className="border-b border-gray-lightest last:border-b-0"
        >
          <Link
            href={item.path}
            className={clsx(
              'flex items-center gap-3 px-10 py-4 text-base capitalize text-gray-dark hover:bg-gray-lightest',
              {
                'bg-gray-lightest': pathname === item.path,
              }
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SideMenu() {
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  return (
    <div className="ml-auto h-full bg-white md:ml-0">
      <div className="flex h-14 items-center justify-between px-10 pt-6 md:h-20 xl:h-24">
        <Logo className="!text-gray-dark" />
        <ActionIcon
          size="sm"
          variant="outline"
          className="border-none !p-0 focus:!ring-0"
          onClick={() => setDrawerState({ ...drawerSate, isOpen: false })}
        >
          <XMarkIcon className="h-6 w-6" />
        </ActionIcon>
      </div>
      <List navListItem={menu} />
    </div>
  );
}
