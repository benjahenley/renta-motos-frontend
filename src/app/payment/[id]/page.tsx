'use client';

import React from 'react';
import ListingDetailsHeader from '@/components/header/listing-details';
import Carrito from '@/components/payment/carrito';
import PaymentBlock from '@/components/payment/paymentblock';
import { useRouter } from 'next/router';

export default function PaymentPage({ params }: { params: { id: string } }) {
  // const router = useRouter();
  // const { id } = router.query;
  console.log(params);
  return (
    <>
      <ListingDetailsHeader />
      <PaymentBlock reservationId={params.id} />
    </>
  );
}
