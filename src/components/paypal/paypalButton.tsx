'use client';

import React from 'react';
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js';

import { getToken } from '@/helpers/getToken';

import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { changeReservationStatusToApproved } from '@/helpers/reservations/changeStatusToApproved';
import { setTransactionId } from '@/helpers/transaction/setTransactionId';
import { paypalCheckPayment } from '@/helpers/payments/paypal-check-payments';

interface PaypalButtonInterface {
  reservationId: string;
  amount: number;
}

export const PaypalButton: React.FC<PaypalButtonInterface> = ({
  reservationId,
  amount,
}) => {
  const router = useRouter();
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions,
  ): Promise<string> => {
    try {
      const orderId = await actions.order.create({
        intent: 'CAPTURE',
        purchase_units: [
          {
            invoice_id: reservationId,
            amount: {
              currency_code: 'EUR',
              value: `${roundedAmount}`,
            },
          },
        ],
      });

      if (!orderId) {
        throw new Error('Expected an order id to be passed');
      }

      const token = getToken();

      if (!token) {
        throw new Error('Token expired, please sign in again');
      }

      const { ok } = await setTransactionId(reservationId, token, orderId);

      if (!ok) {
        throw new Error('Failed to update the order');
      }

      return orderId;
    } catch (e: any) {
      alert(e.message);
      console.error('Create Order Error:', e.message);
      router.push(Routes.private.reservations);
      throw new Error(e.message);
    }
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    try {
      const details = await actions.order?.capture();
      if (!details) throw new Error('Capture details are missing');

      const { status } = await paypalCheckPayment(details.id!);
      console.log(status);
      if (status === 'COMPLETED') {
        console.log('order has been completed');

        await changeReservationStatusToApproved(reservationId);

        router.push(Routes.private.reservations);
      }
    } catch (e: any) {
      console.error('OnApprove Error:', e.message);
      alert(e.message);
    }
  };

  const styles: PayPalButtonsComponentProps['style'] = {
    shape: 'rect',
    layout: 'vertical',
  };

  return (
    <PayPalButtons
      style={styles}
      createOrder={createOrder}
      onApprove={onApprove}
    />
  );
};
