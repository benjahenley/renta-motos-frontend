import React, { useEffect, useState } from 'react';
import Carrito from '@/components/payment/carrito';
import { useRouter } from 'next/navigation';
import { PaypalButton } from '../paypal/paypalButton';
import { getToken } from '@/helpers/getToken';
import { useModal } from '../modals/context';
import { getReservationById } from '@/api/reservations/getReservationsById';
import { Reservation } from '@/interfaces/reservation';

type Props = {
  reservationId: string;
};

export default function PaymentBlock({ reservationId }: Props) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation>();
  const { openModal } = useModal();

  console.log(reservationId);

  useEffect(() => {
    if (!reservationId) {
      router.push('/');
    } else {
      const apiCallTheOrder = async (reservationId: string) => {
        const token = getToken();

        if (!token) {
          openModal('SIGN_IN');
        }

        try {
          const reservationData = await getReservationById(
            token,
            reservationId,
          );

          setReservation(reservationData);
        } catch (error) {
          console.error('Error fetching order:', error);
          router.push('/');
        }
      };

      apiCallTheOrder(reservationId);
    }
  }, [reservation, router]);

  return (
    <>
      {!reservation ? (
        <div className="text-center">'LOADING'</div>
      ) : (
        <div className="container px-5 mt-5 max-w-[1280px] md:flex md:justify-between pb-10 md:mt-7 xl:mt-12 3xl:!px-0">
          <div className="md:w-[48%] m-auto">
            <Carrito order={reservation} />
            <p className="text-red-500 text-center mt-2 ">
              ** Please note reservations are non-refundable, the rest of the
              rent fee must be payed on reservation day **
            </p>
            <div className="mt-20">
              <PaypalButton
                orderId={reservationId}
                amount={reservation.price * 0.3}
              ></PaypalButton>
            </div>
          </div>

          {/* <div className="md:w-[48%] mt-5 md:mt-0"><PaymentForm /></div> */}
        </div>
      )}
    </>
  );
}
