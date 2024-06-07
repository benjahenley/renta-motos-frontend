'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import { getReservations } from '@/helpers/getReservationList';
import { getOrdersByUserId } from '@/api/reservations/getReservationsByUserId';
import { checkRole } from '@/api/user/isAuthorized';
import { getToken } from '@/helpers/getToken';
import LoadingScreen from '@/components/loading-screen';
import { useRouter } from 'next/navigation';

// Función para obtener el userId del usuario logueado desde el localStorage
function getUserId() {
  const loggedUserString = localStorage.getItem('loggedUser');

  if (!loggedUserString) {
    throw new Error('User is not signed in');
  }

  let loggedUser;
  try {
    loggedUser = JSON.parse(loggedUserString);
  } catch (e) {
    throw new Error('Failed to parse logged user data');
  }

  const userId = loggedUser.uid; // Asumiendo que el userId está almacenado en la propiedad 'uid'
  return userId;
}

// Función que obtiene las reservas y las filtra por userId
async function getData(start: number, offset: number, userId: string) {
  const data = await getReservations();
  const userReservations = data.filter((reservation) => reservation.userId === userId);
  const filteredData = userReservations.slice(start, offset);
  return filteredData;
}

export default function ReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<string>('desc');
  const [column, setColumn] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function checkUserRole() {
      try {
        const token = getToken();
        await checkRole(token);  // Verificación de token, pero no redirigir por rol
        setLoading(false);
        } catch (e: any) {
          getOrdersByUserId
          console.log(e.message);
          setLoading(false);
          // router.push('/');  // Redirigir solo si la verificación de token falla
      }
    }

    checkUserRole();
  }, [router]);

  // Filtra los datos en la tabla según el searchfilter y el userId
  useEffect(() => {
    const filterData = async () => {
      const userId = getUserId();
      if (searchfilter) {
        setData(
          data.filter((item) =>
            item.name.toLowerCase().includes(searchfilter.toLowerCase()),
          ),
        );
      } else {
        let start = (current - 1) * 10;
        let offset = current * 10;
        try {
          const newData = await getData(start, offset, userId);
          console.log({ newData });
          setData(newData);
        } catch (e: any) {
          console.error(e.message);
        }
      }
    };
    filterData();
  }, [searchfilter, current]);

  // Función para seleccionar todos los checkboxes
  const onSelectAll = useCallback(
    (checked: boolean) => {
      let updatedData = data.map((item) => ({
        ...item,
        checked,
      }));
      setData(updatedData);
    },
    [data],
  );

  // Función para seleccionar un único checkbox
  const onChange = useCallback(
    (row: any) => {
      let updatedData = data.map((item) =>
        item.id === row.id ? { ...item, checked: !item.checked } : item
      );
      setData(updatedData);
    },
    [data],
  );

  // Función para manejar el botón "more"
  const onMore = useCallback((e: any, row: any) => {
    console.log(e.target.id);
  }, []);

  // Función para manejar el click en los headers de la tabla
  const onHeaderClick = useCallback(
    (value: string) => ({
      onClick: () => {
        setColumn(value);
        setOrder(order === 'desc' ? 'asc' : 'desc');
        if (order === 'desc') {
          setData([...data.sort((a, b) => (a[value] > b[value] ? -1 : 1))]);
        } else {
          setData([...data.sort((a, b) => (a[value] > b[value] ? 1 : -1))]);
        }
      },
    }),
    [data, order],
  );

  const columns: any = useMemo(
    () =>
      reservationColumn(
        order,
        column,
        onSelectAll,
        onChange,
        onMore,
        onHeaderClick,
      ),
    [order, column, onSelectAll, onChange, onMore, onHeaderClick],
  );

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mb-6 mt-8 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Reservations
        </Text>
        <Input
          type="text"
          variant="outline"
          placeholder="Search by name"
          startIcon={<MagnifyingGlassIcon className="h-auto w-5" />}
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          inputClassName="pl-12"
        />
      </div>
      <Table
        data={data}
        columns={columns}
        variant="minimal"
        className="text-sm"
      />
      <div className="mt-8 text-center">
        <Pagination
          current={current}
          total={data.length} // Usa data.length en lugar de reservationData.length
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
}
