'use client';

import { destinations } from 'public/data/destinations';
import { useTimeout } from '@/hooks/use-timeout';
import DestinationCarousel from '@/components/home/destination-block/destination-carousel';
import BlockLoader from '@/components/ui/loader/block-loader';
import Section from '@/components/ui/section';

export default function DestinationBlock() {
  const { state } = useTimeout();

  return (
    <>
    <h3 className="my-16 pl-4 text-3xl lg:pt-10 sm:pl-6 lg:mt-16 sm:text-5xl text-center font-satisfy font-bold">"Experience magical places with our guidance"</h3>
    <Section
      title="Top destinations for your rides"
      description="Feel free to chose what suits for you."
      className="lg:container-fluid mt-12 pl-4 sm:pl-6 lg:mt-16"
      headerClassName="mb-4 md:mb-5 xl:mb-6"
    >
      {!state && <BlockLoader />}
      {state && <DestinationCarousel data={destinations} />}
    </Section></>
  );
}
