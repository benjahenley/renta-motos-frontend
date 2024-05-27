'use client';

import { useEffect } from 'react';
import { useVendor } from '../../../components/vendorContext';
import { vendorData } from 'public/data/listing-details';
import RelatedListingBlock from '@/components/listing-details/related-listings/related-listings-block';
import ListingDetails from '@/components/listing-details/listing-details-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import GallaryBlock from '@/components/listing-details/gallary-block';
import { VendorTypes } from '@/types'; // Importa VendorTypes

export default function ListingDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { setSelectedVendor } = useVendor();
  const vendorsArray = Object.values(vendorData); // Convertir el objeto en un array
  const selectedVendor = vendorsArray.find(v => v.slug === slug) as VendorTypes; // Encontrar el vendor correcto y asegurar el tipo

  useEffect(() => {
    if (selectedVendor) {
      setSelectedVendor(selectedVendor);
    }
    console.log(selectedVendor)
  }, [selectedVendor, setSelectedVendor]);

  if (!selectedVendor) {
    return <div>No se encontró el vendedor con el slug proporcionado</div>;
  }

  return (
    <>
      <div className="container-fluid w-full 3xl:!px-12">
        <GallaryBlock images={selectedVendor.gallary} />
        <ListingDetails vendor={selectedVendor} />
        <RelatedListingBlock />
      </div>
      <SubscriptionBlock sectionClassName="3xl:!px-12 4xl:!px-12" />
    </>
  );
}
