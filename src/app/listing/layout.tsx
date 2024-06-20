import ReserveBottomMenu from '@/components/listing-details/booking-form/reserve-bottom-menu';
import ListingDetailsHeader from '@/components/header/listing-details';
import Footer from '@/components/footer/footer';
import ControlledOpenSpeedDial from '@/components/ui/drawers/speedDial';

export default function ListingDetailsLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <>
      <ListingDetailsHeader />
      <main className="flex-grow">{children}</main>
      <Footer className="pb-20 lg:pb-0 3xl:px-12 4xl:px-12" />
      <ReserveBottomMenu />
      <ControlledOpenSpeedDial/>
    </>
  );
}
