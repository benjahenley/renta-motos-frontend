import React, { useEffect, useState } from 'react';
import Carrito from '@/components/payment/carrito';
import { useRouter } from 'next/navigation';
import { PaypalButton } from '../paypal/paypalButton';
import { getOrder } from '@/api/order/getOrder';
import { getToken } from '@/helpers/getToken';
import { useModal } from '../modals/context';

type Props = {
  orderId: string;
};

type Order = {
  price: number;
};

export default function PaymentBlock({ orderId }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const { openModal } = useModal();

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    } else {
      const apiCallTheOrder = async (orderId: string) => {
        const token = getToken();

        if (!token) {
          openModal('SIGN_IN');
        }

        try {
          const order = await getOrder(token, orderId);

          setOrder(order);
        } catch (error) {
          console.error('Error fetching order:', error);
          router.push('/');
        }
      };

      apiCallTheOrder(orderId);
    }
  }, [orderId, router]);

  return (
    <>
      {!order ? (
        <div className="text-center">'LOADING'</div>
      ) : (
        <div className="container px-5 mt-5 max-w-[1280px] md:flex md:justify-between pb-10 md:mt-7 xl:mt-12 3xl:!px-0">
          <div className="md:w-[48%] m-auto">
            <Carrito order={order} />
            <p className="text-red-500 text-center mt-2 ">
              ** Please note reservations are non-refundable, the rest of the
              rent fee must be payed on reservation day **
            </p>
            <div className="mt-20">
              <PaypalButton
                orderId={orderId}
                amount={order.price * 0.3}
              ></PaypalButton>
            </div>
          </div>

          {/* <div className="md:w-[48%] mt-5 md:mt-0"><PaymentForm /></div> */}
        </div>
      )}
    </>
  );
}
