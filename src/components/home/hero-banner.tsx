import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import FindTripForm from '@/components/home/search-form/search-form';
import Button from '@/components/ui/button';

interface HeroBannerProps {
  destinationRef: React.RefObject<HTMLDivElement>;
}

export default function HeroBanner({ destinationRef }: HeroBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative flex flex-col sm:flex-row min-h-[760px] items-end justify-center sm:justify-start sm:px-0 pb-28 pt-20 sm:pt-[120px] md:pl-16 3xl:pb-[132px] 3xl:pt-[142px] 4xl:pl-[200px]">
      <div className="absolute bottom-56 w-full flex flex-col items-center sm:w-full sm:items-start sm:static sm:pl-6">
        <div className="block sm:hidden mb-4">
          <Button
            type="button"
            className="w-full !py-[14px] text-sm !font-bold uppercase leading-6 md:!py-[17px] md:text-base lg:!rounded-xl 3xl:!py-[22px]"
            rounded="lg"
            size="xl"
            onClick={openModal}
          >
            GO CHECK !
          </Button>
        </div>
        <div className="hidden sm:block w-full">
          <FindTripForm destinationRef={destinationRef} />
        </div>
      </div>
      <div className="z-[-50] inset-0 sm:hidden">
        <video
          src="/video/video.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>
      <div className="hidden sm:block w-full h-full">
        <Image
          src="/images/top-boats/dos.jpeg"
          alt="Home banner 1"
          fill
          priority
          className="aspect-[2/1] h-full bg-gray-lighter object-cover"
        />
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg relative p-6 max-h-[80vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
            <FindTripForm destinationRef={destinationRef} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
