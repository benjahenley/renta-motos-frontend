'use client';

import { reservationData } from 'public/data/orders';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import { checkRole } from '@/api/user/isAuthorized';
import { getToken } from '@/helpers/getToken';
import LoadingScreen from '@/components/loading-screen';
import { useRouter } from 'next/navigation';
import { extractTime } from '@/helpers/extract-time';
import { formatDateToISOWithoutTime } from '@/helpers/formatDate';
import { getReservationsByUserId } from '@/api/reservations/getReservationsByUserId';

async function getData(start: number, offset: number) {
  const data = await getReservationsByUserId();
  console.log(data);

  data
    .map((item: any) => {
      if (!item) {
        return null;
      }

      return {
        id: item.id,
        date: formatDateToISOWithoutTime(item.date),
        name: item.userFullName,
        status: item.status,
        endTime: item.endTime,
        startTime: item.startTime,
        jetskiId: item.jetskiId,
        checked: false,
      };
    })
    .filter(Boolean);

  const filteredData = data.slice(start, offset);
  return filteredData;
}

export default function reservationsPage() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<string>('desc');
  const [column, setColumn] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    async function checkUserRole() {
      try {
        await checkRole(token);
      } catch (e: any) {
        console.log(e.message);
      } finally {
        const reservations = await getData(0, 10);
        setData(reservations);
        setLoading(false);
      }
    }

    checkUserRole();
  }, [router, token]);

  useEffect(() => {
    const filterData = async () => {
      if (searchfilter) {
        setData((prevData) =>
          prevData.filter((item) =>
            item.name.toLowerCase().includes(searchfilter.toLowerCase()),
          ),
        );
      } else {
        let start = (current - 1) * 10;
        let offset = current * 10;
        const newData = await getData(start, offset);
        setData(newData);
      }
    };
    filterData();
  }, [searchfilter, token, current]);

  useEffect(() => {
    const fetchData = async () => {
      let start = (current - 1) * 10;
      let offset = current * 10;
      const fetchedData = await getData(start, offset);
      setData(fetchedData);
    };
    fetchData();
  }, [current, token]);

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

  const onChange = useCallback(
    (row: any) => {
      let fArr = [...data];
      let cArr: any = [];
      fArr.forEach((item) => {
        if (item.id === row.id) item.checked = !item.checked;
        cArr.push(item);
      });
      setData(cArr);
    },
    [data],
  );

  const onMore = useCallback((e: any, row: any) => {
    console.log(e.target.id);
  }, []);

  const onHeaderClick = useCallback(
    (value: string) => ({
      onClick: () => {
        setColumn(value);
        setOrder(order === 'desc' ? 'asc' : 'desc');
        if (order === 'desc') {
          //@ts-ignore
          setData([...data.sort((a, b) => (a[value] > b[value] ? -1 : 1))]);
        } else {
          //@ts-ignore
          setData([...data.sort((a, b) => (a[value] > b[value] ? 1 : -1))]);
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  // gets the columns of table
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
          total={data.length}
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
