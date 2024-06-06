'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useJetskis from '@/hooks/use-jetskis';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Jetski } from '@/api/get-jetskis/useGetJetskis';

const SimpleTable = ({ data, handleToggleMaintenance }: { data: Jetski[], handleToggleMaintenance: (id: number, currentStatus: 'available' | 'maintenance') => void }) => {
  return (
    <div className='rc-table-container extratable__container'>
            <div className='rc-table-content'>
            <table className="extratable  min-w-full border-collapse border border-gray-400">
      <thead className='rc-table-thead thead'>
        <tr>
          <th className="tth px-4 py-2">Name</th>
          <th className="tth px-4 py-2">Status</th>
          <th className="tth px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(jetski => (
          <tr className='tr' key={jetski.id}>
            <td className="td px-4 py-2">{jetski.name}</td>
            <td className="td px-4 py-2">{jetski.status}</td>
            <td className="td px-4 py-2">
              <Button onClick={() => handleToggleMaintenance(jetski.id, jetski.status)}>
                {jetski.status === 'available' ? 'Disable for Maintenance' : 'Enable for Rental'}
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

  
  // Uso de SimpleTable en lugar de Table
  const JetskiManagement: React.FC = () => {
    const { jetskis, loading, error, updateStatus } = useJetskis();
    const [current, setCurrent] = useState(1);
    const [searchFilter, setSearchFilter] = useState('');
    const [displayData, setDisplayData] = useState<Jetski[]>([]);
  
    useEffect(() => {
      const filterData = async () => {
        let filteredData = Array.isArray(jetskis) ? jetskis : [];
        if (searchFilter) {
          filteredData = filteredData.filter(jetski =>
            jetski.name.toLowerCase().includes(searchFilter.toLowerCase())
          );
        }
        const start = (current - 1) * 10;
        const offset = current * 10;
        setDisplayData(filteredData.slice(start, offset));
        console.log("Filtered and paginated data:", filteredData.slice(start, offset));
      };
  
      filterData();
    }, [jetskis, searchFilter, current]);
  
    const handleToggleMaintenance = (id: number, currentStatus: 'available' | 'maintenance') => {
      const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';
      updateStatus(id, newStatus);
    };
  
    return loading ? (
      <p>Loading...</p>
    ) : (
      <div className="container-fluid mb-12 lg:mb-16">
        <div className="mb-6 mt-8 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
          <Text tag="h4" className="text-xl">
            Jetski Management
          </Text>
          <Input
            type="text"
            variant="outline"
            placeholder="Search by name"
            startIcon={<MagnifyingGlassIcon className="h-auto w-5" />}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            inputClassName="pl-12"
          />
        </div>
        <SimpleTable data={displayData} handleToggleMaintenance={handleToggleMaintenance}/>
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
  