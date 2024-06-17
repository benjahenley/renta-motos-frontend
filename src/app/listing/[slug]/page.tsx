'use client';

import { vendorData } from 'public/data/listing-details';
import RelatedListingBlock from '@/components/listing-details/related-listings/related-listings-block';
import ListingDetails from '@/components/listing-details/listing-details-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import GallaryBlock from '@/components/listing-details/gallary-block';
import { useRouter } from 'next/navigation';

export default function ListingDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const router = useRouter();

  console.log(slug);

  var selectedVendor: any = {};

  // Buscar el vendor cuyo slug coincide con el recibido por parámetro
  try {
    const selectedVendorr = (vendorData as any)[slug];
    if (!selectedVendorr) {
      throw new Error('not found');
    }
    selectedVendor = selectedVendorr;
  } catch (e) {
    router.push('/');
  }

  return (
    <>
      <div className="container-fluid w-full 3xl:!px-12">
        <GallaryBlock images={selectedVendor.gallary} />
        <ListingDetails vendor={selectedVendor} slug={slug} />
        {/* <RelatedListingBlock /> */}
      </div>
      <SubscriptionBlock sectionClassName="3xl:!px-12 4xl:!px-12" />
    </>
  );
}
