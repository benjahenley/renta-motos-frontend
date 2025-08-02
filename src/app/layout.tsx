import '@/styles/globals.css';
import React from 'react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Satisfy, Lato } from 'next/font/google';
import { Providers } from '@/components/providers/providers';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Head from 'next/head';  // Importar Head

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ibijet Rent",
  "url": "https://www.tusitio.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.tusitio.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

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
  title: 'Motoboat Ibiza',
  description: 'Find your boat with the best experience.',
  icons: {
    icon: '/images/logo.png', // Asegurate que exista en /public/images/logo.png
  },
  openGraph: {
    title: 'Motoboat Ibiza',
    description: 'Find your boat with the best experience.',
    url: 'https://motoboatibiza.es/',
    siteName: 'Motoboat Ibiza',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Motoboat Ibiza',
      },
    ],
    type: 'website',
  },
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
     
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
