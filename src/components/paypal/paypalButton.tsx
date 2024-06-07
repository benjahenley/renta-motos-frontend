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
import { setTransactionId } from '@/api/transaction/setTransactionId';
import { getToken } from '@/helpers/getToken';
import { paypalCheckPayment } from '@/api/payments/paypal-check-payments';

interface PaypalButtonInterface {
  orderId: string;
  amount: number;
}
export const PaypalButton: React.FC<PaypalButtonInterface> = ({
  orderId,
  amount,
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions,
  ): Promise<string> => {
    try {
      const transactionId = await actions.order.create({
        purchase_units: [
          {
            invoice_id: orderId,
            amount: {
              value: `${roundedAmount}`,
            },
          },
        ],
      });

      const token = getToken();

      if (!token) {
        throw new Error('token expired, please sign in again');
      }
      console.log(transactionId);

      const { ok } = await setTransactionId(orderId, token, transactionId);

      if (!ok) {
        throw new Error('No se pudo actualizar la orden');
      }

      return transactionId;
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details) return;

    await paypalCheckPayment(details.id!);
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
