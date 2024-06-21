'use client';

import React from 'react';
import Carrito from '@/components/payment/carrito';
import PaymentBlock from '@/components/payment/paymentblock';
import { useRouter } from 'next/router';
import PaymentHeader from '@/components/header/payment-header';

export default function PaymentPage({ params }: { params: { id: string } }) {
  return (
    <>
      <PaymentHeader />
      <PaymentBlock reservationId={params.id} />
    </>
  );
}
