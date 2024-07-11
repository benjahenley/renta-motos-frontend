import React from 'react';
import PaymentHeader from '@/components/header/payment-header';
import PaymentBlockTesting from '@/components/testing/paymentblock-testing';

export default function TestingPage({ params }: { params: { id: string } }) {
  return (
    <>
      <PaymentHeader />
      <PaymentBlockTesting reservationId={params.id} />
    </>
  );
}
