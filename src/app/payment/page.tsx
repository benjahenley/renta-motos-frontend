'use client'

import React from 'react';
import PaymentForm from '@/components/payment/paymentform';
import ListingDetailsHeader from '@/components/header/listing-details';
import Carrito from '@/components/payment/carrito';

export default function PaymentPage({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <>
      <ListingDetailsHeader />
      <div className="container-fluid mt-5 pb-10 md:mt-7 xl:mt-12 3xl:mt-16 3xl:!px-0">
        <div className="flex flex-col lg:flex-row justify-start gap-5 lg:gap-8 2xl:gap-12">
          <div className="lg:w-1/3">
            <Carrito />
          </div>
          <div className="lg:w-2/3">
            <main className="flex-grow">{children}</main>
            <div className="p-4">
              <PaymentForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
