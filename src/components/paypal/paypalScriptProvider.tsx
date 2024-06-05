// 'use client'
import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture',
};

const PayPalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
