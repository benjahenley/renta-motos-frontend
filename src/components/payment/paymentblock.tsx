import  PaypalButton  from '@/components/paypal/paypalButton'
import React from 'react';
import PaymentForm from '@/components/payment/paymentform';
import Carrito from '@/components/payment/carrito';

export default function PaymentBlock() {
  return (
    <>
      <div className="container px-5 mt-5 max-w-[1280px] md:flex md:justify-between pb-10 md:mt-7 xl:mt-12 3xl:!px-0">

        <div className="md:w-[48%]">
          <PaypalButton totalValue={'4.99'} invoice={'Taza de cafe'}></PaypalButton>
          <Carrito />
        </div>
        
        <div className="md:w-[48%] mt-5 md:mt-0">
          <PaymentForm />
        </div>

      </div>
    </>
  );
};
