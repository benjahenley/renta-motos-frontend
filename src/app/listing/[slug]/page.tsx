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

  console.log(params);

  // Buscar el vendor cuyo slug coincide con el recibido por parámetro
  const selectedVendor = (vendorData as any)[slug];

  // if (!selectedVendor) {
  // return <div>No se encontró el vendedor con el slug proporcionado</div>;
  // }

  // Función para buscar el vendedor por su slug
  // const findVendorBySlug = (slug: string) => {
  //   for (const key in vendorData) {
  //     if (vendorData.hasOwnProperty(key) && vendorData[key].slug === slug) {
  //       return vendorData[key];
  //     }
  //   }
  //   return null;
  // };

  // // Capturar el vendor cuyo slug coincide con el recibido por parámetro
  // const selectedVendor = findVendorBySlug(slug);

  // if (!selectedVendor) {
  //   return <div>No se encontró el vendedor con el slug proporcionado</div>;
  // }

  return (
    <>
      <div className="container-fluid w-full 3xl:!px-12">
        <GallaryBlock images={selectedVendor.gallary} />
        <ListingDetails vendor={selectedVendor} />
        {/* <RelatedListingBlock /> */}
      </div>
      <SubscriptionBlock sectionClassName="3xl:!px-12 4xl:!px-12" />
    </>
  );
}
