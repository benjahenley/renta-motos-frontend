'use client'

import React from 'react';
import PaymentForm from '@/components/payment/paymentform';
import ListingDetailsHeader from '@/components/header/listing-details';
import { TabItem, Tablist, TabPanel, TabPanels } from '@/components/ui/tab';
import { Tab } from '@headlessui/react';
import Carrito from '@/components/payment/carrito'

export default function PaymentPage({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <>
      <ListingDetailsHeader />
      <div className="container-fluid mt-5 grid !max-w-[1280px] grid-cols-1 gap-5 pb-10 md:mt-7 lg:grid-cols-3 xl:mt-12 xl:grid-cols-3 xl:gap-8 2xl:gap-12 3xl:mt-16 3xl:!px-0">
        <div className="lg:col-span-1">
          <Carrito />
        </div>
        <div className="lg:col-span-2">
          <div className="container mx-auto p-4">
            <PaymentForm />
          </div>
        </div>
      </div>
    </>
  );
};
