import { vendorData } from 'public/data/listing-details';
import RelatedListingBlock from '@/components/listing-details/related-listings/related-listings-block';
import ListingDetails from '@/components/listing-details/listing-details-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import GallaryBlock from '@/components/listing-details/gallary-block';

export default function ListingDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  console.log(slug);

  // Buscar el vendor cuyo slug coincide con el recibido por parámetro
  const selectedVendor = (vendorData as any)[slug];

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
