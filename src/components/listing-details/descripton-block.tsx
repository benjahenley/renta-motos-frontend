'use client';
import { VendorTypes } from '@/types';
import Text from '@/components/ui/typography/text';
import Section from '@/components/ui/section';

interface ListingDetailsHeroBlockProps {
  vendor: VendorTypes;
}

export default function DescriptionBlock({
  vendor,
}: ListingDetailsHeroBlockProps) {
  return (
    <Section className="py-5 lg:py-6 xl:py-7">
      <Text className="!text-base !leading-7 !text-secondary">
        {vendor.description2}
      </Text>
      <Text className="!text-base !leading-7 !text-secondary">
        {vendor.description}
      </Text>
    </Section>
  );
}
