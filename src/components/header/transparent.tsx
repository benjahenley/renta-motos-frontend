'use client';

import { useRef } from 'react';
import { addScrollingClass } from '@/utils/add-scrolling-class';
// import SearchIconBtn from '@/components/ui/search-icon-btn';
import Menu from '@/components/header/menu';
import Logo from '@/components/ui/logo';
// import LanguageSwitcher from '@/components/language/languageSwitcher'

export default function TransparentHeader() {
  const headerRef = useRef(null);
  addScrollingClass(headerRef);

  return (
    <header
      ref={headerRef}
      className="transparent-header fixed left-0 top-0 z-[100] flex w-full items-center justify-between bg-white sm:bg-transparent  2xl:px-5 3xl:px-8 4xl:px-14 px-9"
    >

      <div className="flex w-full justify-center sm:w-auto sm:justify-center">
        <Logo />
      </div>
      <div className="hidden sm:flex items-center">
        {/* <LanguageSwitcher/> */}
        {/* <SearchIconBtn className="md:hidden" /> */}
        <Menu />
      </div>
    </header>
  );
}
