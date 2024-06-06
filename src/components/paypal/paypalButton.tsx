import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

interface PaypalButtonInterface {
  totalValue: string;
  invoice: string;
}

const PaypalButton : React.FC<PaypalButtonInterface> = (props) => {
    return (
        <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE", // Asegúrate de incluir 'intent' aquí
            purchase_units: [{
              amount: {
                currency_code: 'USD', 
                value: 'YOUR_ORDER_AMOUNT',
              },
              reference_id: 'YOUR_ORDER_ID',
            }],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order?.capture();
          // Handle successful transaction here
          await updateOrder(orderId);

        }}
        onError={(err) => {
          console.error('PayPal Checkout onError', err);
        }}
      />
        


       
    )
}

export default PaypalButton;
