'use client'

import React from 'react';
import ListingDetailsHeader from '@/components/header/listing-details';
import Carrito from '@/components/payment/carrito';
import PaymentBlock from '@/components/payment/paymentblock';

export default function PaymentPage({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <>
      <ListingDetailsHeader />
      <PaymentBlock />
    </>
  );
};
