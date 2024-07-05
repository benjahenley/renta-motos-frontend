'use client';

import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';
import { VendorProvider } from '../vendorContext';
import ModalContainer from '../modals/view';
import DrawerContainer from '../drawers/view';
import GalleryCarouselView from '../gallery/view';

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    intent: 'capture',
    currency: 'EUR',
    'data-sdk-integration-source': 'nextjs',
    crossorigin: 'anonymous',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <VendorProvider>
        {children}
        <ModalContainer />
        <DrawerContainer />
        <GalleryCarouselView />
      </VendorProvider>
    </PayPalScriptProvider>
  );
};
