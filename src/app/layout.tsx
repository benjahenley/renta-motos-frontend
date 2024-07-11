import '@/styles/globals.css';
import React from 'react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Satisfy, Lato } from 'next/font/google';
import { Providers } from '@/components/providers/providers';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
});

const satisfy = Satisfy({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
});

// Move viewport to generateViewport
export const generateViewport = () => {
  return {
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  };
};

export const metadata: Metadata = {
  title: 'Ibijet Rent',
  description: 'Find your boat with the best experience.',
  icons: ['/images/probando.svg'],
};

export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  return (
    <html
      lang="en"
      className={clsx(
        'h-full font-lato antialiased',
        satisfy.variable,
        lato.variable,
      )}
    >
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <head />
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
