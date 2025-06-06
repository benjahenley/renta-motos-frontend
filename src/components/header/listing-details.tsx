'use client';

import { useRef } from 'react';
import useAuth from '@/hooks/use-auth';
import { addScrollingClass } from '@/utils/add-scrolling-class';
import SearchIconBtn from '@/components/ui/search-icon-btn';
import SideNavButton from '@/components/ui/side-nav-button';
import ProfileMenu from '@/components/header/profile-menu';
import { useModal } from '@/components/modals/context';
import Searchbox from '@/components/ui/search-box';
import Button from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { useIsMounted } from '@/hooks/use-is-mounted';

export default function ListingDetailsHeader() {
  const mounted = useIsMounted();
  const { openModal } = useModal();
  const { isAuthorized } = useAuth();
  const headerRef = useRef(null);
  addScrollingClass(headerRef);

  return (
    <header
      ref={headerRef}
      className="dashboard-header sticky left-0 top-0 z-[100] flex w-full items-center justify-between bg-white  2xl:px-3 3xl:px-7 4xl:px-14"
    >
      <div className="container-fluid grid w-full grid-cols-2 items-center gap-0 lg:grid-cols-[auto_1fr] 3xl:!px-12">
        <div className="flex items-center gap-2 md:gap-4 2xl:gap-5">
          {/* <SideNavButton className="!block" /> */}
          <Logo className="!text-gray-dark" />
        </div>
        {/* <Searchbox className="hidden lg:block" /> */}
        <div className="flex items-center justify-self-end gap-5">
          {/* <SearchIconBtn /> */}
          {mounted ? (
            <>
              {isAuthorized ? (
                <ProfileMenu  />
              ) : (
                <Button
                  size="sm"
                  onClick={() => openModal('SIGN_IN')}
                  className="rounded-lg !px-4 py-2 text-sm capitalize md:text-base"
                >
                  Log in
                </Button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
