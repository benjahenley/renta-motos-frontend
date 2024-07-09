'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaypalButton } from '../paypal/paypalButton';
import { getToken } from '@/helpers/getToken';
import { useModal } from '../modals/context';
import { getReservationById } from '@/helpers/reservations/getReservationsById';
import { Reservation } from '@/interfaces/reservation';
import { Routes } from '@/config/routes';
import LoadingScreen from '../loading-screen';
import CarritoTesting from './carrito-testing';

type Props = {
  reservationId: string;
};

export default function PaymentBlockTesting({ reservationId }: Props) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation>();
  const { openModal } = useModal();
  const [error, setError] = useState<string>('');

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
          router.push(Routes.private.reservations);
        }
      };

      apiCallTheOrder(reservationId);
    }
  }, [reservationId, router]);

  return (
    <>
      {!reservation ? (
        <LoadingScreen />
      ) : (
        <div className="container px-5 mt-5 max-w-[1280px] md:flex md:justify-between pb-10 md:mt-7 xl:mt-12 3xl:!px-0">
          <div className="md:w-[48%] m-auto">
            <CarritoTesting order={reservation} />
            <p className="text-red-500 text-center mt-2 ">
              ** Please note reservations are non-refundable, the rest of the
              rent fee must be payed on reservation day **
            </p>
            {error !== '' && (
              <div>
                <p className="text-red-500 text-center mt-2 ">{error}</p>
              </div>
            )}
            <div className="mt-20">
              <PaypalButton
                onError={(err) => setError(err)}
                reservationId={reservationId}
                amount={100}
              ></PaypalButton>
            </div>
          </div>

          {/* <div className="md:w-[48%] mt-5 md:mt-0"><PaymentForm /></div> */}
        </div>
      )}
    </>
  );
}
