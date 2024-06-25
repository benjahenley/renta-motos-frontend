'use client';

import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import Input from '@/components/ui/form-fields/input'; // Importa el componente Input
import { JetskiItem } from './jetskiItem';
import { getToken } from '@/helpers/getToken';
import { getJetskis } from '@/helpers/jetskis/getJetskis';
import { createNewJetski } from '@/controllers/jetskis';
import { Jetski } from '@/interfaces/jetski';
import LoadingScreen from '../loading-screen';
import Swal from 'sweetalert2'; // Importa SweetAlert
import { useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';



const SimpleTable = ({ data }: { data: Jetski[] }) => {
  return (
    <div className="rc-table-container extratable2__container">
      <div className="rc-table-content">
        <table className="extratable2 min-w-full border-collapse border border-gray-400">
          <thead className="rc-table-thead thead2">
            <tr>
              <th className="tth2 px-4 py-2">Name</th>
              <th className="tth2 px-4 py-2">Status</th>
              <th className="tth2 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((jetski, index) => (
              <JetskiItem jetski={jetski} key={index}></JetskiItem>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JetskiManagement: React.FC = () => {
  const [jetskis, setJetskis] = useState<Jetski[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [displayData, setDisplayData] = useState<Jetski[]>([]);
  const [jetskiName, setJetskiName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const router = useRouter(); // Utiliza el hook useRouter

  const getAllJetskis = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const newJetskis = await getJetskis(token);
      console.log({ newJetskis });
      setJetskis(newJetskis);
    } catch (error) {
      console.error('Failed to fetch jetskis', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllJetskis();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filteredData = [...jetskis];

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

  const handleAddJetski = async () => {
    if (!jetskiName) {
      setAddError('Please enter a name for the jetski.');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to add a jetski?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getToken();
          await createNewJetski(jetskiName);
          const newJetski: Jetski = {
            id: Date.now().toString(), // Usa un ID temporal único
            name: jetskiName,
            available: true, // Define el estado inicial del jetski
          };
          setJetskis((prevJetskis) => [...prevJetskis, newJetski]);

          setJetskiName('');
          setAddError(null);
          router.push(Routes.private.dashboard); // Redirige al dashboard
        } catch (error: any) {
          router.push(Routes.private.dashboard); // Redirige al dashboard
          Swal.fire({
            title: 'Success!',
            text: 'Jetski added successfully!',
            icon: 'success',
          }).then(() => {
            router.push(Routes.private.jetskys); // Redirige a jetskys
          });

          // setAddError(error.message);
          console.log(error)
        }
      }
    });
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mb-6 mt-8 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Jetski Management
        </Text>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            variant="outline"
            placeholder="Jetski Name"
            value={jetskiName}
            onChange={(e) => setJetskiName(e.target.value)}
            inputClassName="pl-2 mr-2"
          />
          <Button
            size="xl"
            rounded="pill"
            className="!p-2 capitalize w-36 text-white sm:rounded-md  sm:!py-[10px]"
            onClick={handleAddJetski}
          >
            <PlusIcon className="h-auto w-5 sm:mr-3" />
            <span className="hidden w-20 sm:block">Add Jet Ski</span>
          </Button>
        </div>
        {addError && <p className="text-red-500">{addError}</p>}
      </div>

      <SimpleTable data={displayData} />
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
