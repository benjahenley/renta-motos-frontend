'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { VendorProvider } from '../vendorContext';
import ModalContainer from '../modals/view';
import DrawerContainer from '../drawers/view';
import GalleryCarouselView from '../gallery/view';

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
        intent: 'capture',
        currency: 'USD',
      }}
    >
      <VendorProvider>
        {children}
        <ModalContainer />
        <DrawerContainer />
        <GalleryCarouselView />
      </VendorProvider>
    </PayPalScriptProvider>
  );
};
