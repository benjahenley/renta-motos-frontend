'use client';

import { usePathname } from 'next/navigation';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Drawer from '@/components/ui/drawer';
import clsx from 'clsx';

const PhotoGallery = dynamic(
  () => import('@/components/ui/drawers/photo-gallery')
);

const SideMenu = dynamic(() => import('@/components/ui/drawers/side-menu'));
const Filter = dynamic(() => import('@/components/explore/filter'));
const BookingFormModal = dynamic(
  () => import('@/components/ui/drawers/booking-form-drawer')
);

export type DRAWER_VIEW =
  | 'PHOTO_GALLERY'
  | 'SIDE_MENU'
  | 'BOOKING_FORM'
  | 'FILTER_MENU';



// render drawer contents
function renderDrawerContent(view: DRAWER_VIEW | string, params?: any) {
  switch (view) {
    case 'PHOTO_GALLERY':
      console.log('Params en renderDrawerContent:', params); // Verifica si params está llegando correctamente
      return params ? <PhotoGallery gallary={params.gallary} /> : null;//aca toquetie
    case 'SIDE_MENU':
      return <SideMenu />;
    case 'FILTER_MENU':
      return <Filter />;
    case 'BOOKING_FORM':
      return <BookingFormModal vendor={params} />;
    default:
      return null;
  }
}

type DrawerPropsType = {
  isOpen: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  view: string;
  customSize?: string;
  params?: Record<string, any>; // Agregar un campo para los parámetros aca toquetie
};

export const drawerStateAtom = atom<DrawerPropsType>({
  isOpen: false,
  placement: 'left',
  view: 'SIDE_MENU',
  params: {},//aca toquetie
});

export default function DrawerContainer() {
  let [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  const pathName = usePathname();
  useEffect(() => {
    setDrawerState({ ...drawerSate, isOpen: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <>
      <Drawer
        isOpen={drawerSate.isOpen}
        placement={drawerSate.placement}
        customSize={drawerSate.customSize}
        containerClassName={clsx(
          drawerSate.view === 'BOOKING_FORM' && 'bg-white',
          drawerSate.view === 'PHOTO_GALLERY' && 'bg-white overflow-y-auto'
        )}
        onClose={() => setDrawerState({ ...drawerSate, isOpen: false })}
      >
        {renderDrawerContent(drawerSate.view, drawerSate.params)}
      </Drawer>
    </>
  );
}
