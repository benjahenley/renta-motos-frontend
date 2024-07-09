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
  onError: (error: string) => void;
}

export const PaypalButton: React.FC<PaypalButtonInterface> = ({
  onError,
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
      onError(e.message);
      return '';
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
        return;
      } else {
        throw new Error('Status is not completed, error with paypal handling.');
      }
    } catch (e: any) {
      onError(e.message);
      return;
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
