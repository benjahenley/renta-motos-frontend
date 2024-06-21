'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { vendorData } from 'public/data/listing-details';
import RelatedListingBlock from '@/components/listing-details/related-listings/related-listings-block';
import ListingDetails from '@/components/listing-details/listing-details-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import GallaryBlock from '@/components/listing-details/gallary-block';
import { useRouter } from 'next/navigation';
import { slugAtom } from '@/atoms/slug';
import { selectedVendorAtom } from '@/atoms/selectedVendor';

export default function ListingDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const slugMinusculas = slug.toLocaleLowerCase();
  const router = useRouter();
  const [, setSlug] = useAtom(slugAtom);
  const [, setSelectedVendor] = useAtom(selectedVendorAtom);

  useEffect(() => {
    // Almacenar el slug en el átomo
    setSlug(slug);
  }, [slug, setSlug]);

  var selectedVendor: any = {};

  // Buscar el vendor cuyo slug coincide con el recibido por parámetro
  try {
    const selectedVendorr = (vendorData as any)[slugMinusculas];
    if (!selectedVendorr) {
      throw new Error('not found');
    }
    selectedVendor = selectedVendorr;
    setSelectedVendor(selectedVendor); // Actualiza el valor del átomo aquí
  } catch (e) {
    router.push('/');
  }

  return (
    <>
      <div className="container-fluid w-full 3xl:!px-12">
        <GallaryBlock images={selectedVendor.gallary} />
        <ListingDetails vendor={selectedVendor} slug={slugMinusculas} />
        {/* <RelatedListingBlock /> */}
      </div>
      <SubscriptionBlock sectionClassName="3xl:!px-12 4xl:!px-12" />
    </>
  );
}
