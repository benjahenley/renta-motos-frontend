'use client';

import React, { useEffect, useState } from 'react';
import useJetskis from '@/hooks/use-jetskis';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Routes } from '@/config/routes';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Jetski, getJetskis } from '@/api/get-jetskis/useGetJetskis';
import { useRouter } from 'next/navigation';

const SimpleTable = ({
  data,
  handleToggleMaintenance,
}: {
  data: Jetski[];
  handleToggleMaintenance: (id: string) => void;
}) => {
  console.log(data);
  return (
    <div className="rc-table-container extratable__container">
      <div className="rc-table-content">
        <table className="extratable min-w-full border-collapse border border-gray-400">
          <thead className="rc-table-thead thead">
            <tr>
              <th className="tth px-4 py-2">Name</th>
              <th className="tth px-4 py-2">Status</th>
              <th className="tth px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((jetski, index) => (
              <tr className="tr" key={index}>
                <td className="td px-4 py-2">{jetski.name}</td>
                <td className="td px-4 py-2">
                  {jetski.available ? 'available' : 'maintenance'}
                </td>
                <td className="td px-4 py-2">
                  <Button onClick={() => handleToggleMaintenance(jetski.id)}>
                    {jetski.available
                      ? 'Disable for Maintenance'
                      : 'Enable for Rental'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JetskiManagement: React.FC = () => {
  const { jetskis, loading, error, toggleStatus } = useJetskis();
  const [current, setCurrent] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [displayData, setDisplayData] = useState<Jetski[]>([]);
  const router = useRouter();

  useEffect(() => {
    const filterData = () => {
      let filteredData = Array.isArray(jetskis) ? jetskis : [];
      if (searchFilter) {
        filteredData = filteredData.filter((jetski) =>
          jetski.name.toLowerCase().includes(searchFilter.toLowerCase()),
        );
      }
      const start = (current - 1) * 10;
      const offset = current * 10;
      setDisplayData(filteredData.slice(start, offset));
    };

    filterData();
  }, [jetskis, searchFilter, current]);

  const handleToggleMaintenance = async (id: string) => {
    try {
      await toggleStatus(id);
      // Después de actualizar el estado, necesitas volver a obtener los datos de jetskis para reflejar los cambios en la UI.
      const updatedJetskis = await getJetskis();
      setDisplayData(updatedJetskis);
    } catch (error) {
      console.error('Failed to update jetski status', error);
    }
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mb-6 mt-8 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Jetski Management
        </Text>
        <Button
          size="xl"
          rounded="pill"
          className="!p-2 capitalize text-white sm:rounded-md sm:!px-8 sm:!py-[10px]"
          onClick={() => router.push(Routes.private.addListing)}
        >
          <PlusIcon className="h-auto w-5 sm:mr-3" />
          <span className="hidden sm:block">Add Jet Ski</span>
        </Button>
        {/* <Input
          type="text"
          variant="outline"
          placeholder="Search by name"
          startIcon={<MagnifyingGlassIcon className="h-auto w-5" />}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          inputClassName="pl-12"
        /> */}
      </div>
      <SimpleTable
        data={displayData}
        handleToggleMaintenance={handleToggleMaintenance}
      />
      <div className="mt-8 text-center">
        <Pagination
          current={current}
          total={jetskis.length}
          pageSize={10}
          nextIcon="Next"
          prevIcon="Previous"
          prevIconClassName="!text-gray-dark"
          nextIconClassName="!text-gray-dark"
          onChange={(page) => {
            setCurrent(page);
          }}
        />
      </div>
    </div>
  );
};

export default JetskiManagement;
