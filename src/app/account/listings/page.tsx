'use client';

import { reservationData } from 'public/data/orders';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { getAllReservations } from '@/helpers/reservations/getAllReservations';
import { useRouter } from 'next/navigation';

async function getData(start: number, offset: number) {
  const data = await getAllReservations();
  const filteredData = data.slice(start, offset);
  return filteredData;
}

export default function LIstingPage() {
  const [order, setOrder] = useState<string>('desc');
  const [column, setColumn] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);
  const router = useRouter();

  // filter data in table
  useEffect(() => {
    const filterData = async () => {
      let fArr = [...data];
      if (searchfilter) {
        setData(
          fArr.filter((item) =>
            item.name.toLowerCase().includes(searchfilter.toLowerCase()),
          ),
        );
      } else {
        let start = (current - 1) * 10;
        let offset = current * 10;
        const newData = await getData(start, offset);
        console.log({ newData });
        setData(newData);
      }
    };
    filterData();
  }, [searchfilter]);

  // table current change
  useEffect(() => {
    const fetchData = async () => {
      let start = (current - 1) * 10;
      let offset = current * 10;
      const fetchedData = await getData(start, offset);
      setData(fetchedData);
    };
    fetchData();
  }, [current]);

  // select all checkbox function
  const onSelectAll = useCallback(
    (checked: boolean) => {
      let fArr = [...data];
      let cArr: any = [];
      if (checked) {
        fArr.forEach((item) => {
          item.checked = true;
          cArr.push(item);
        });
        setData(cArr);
      } else {
        fArr.forEach((item) => {
          item.checked = false;
          cArr.push(item);
        });
        setData(fArr);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [data],
  );

  // single select checkbox function
  const onChange = useCallback(
    (row: any) => {
      let fArr = [...data];
      let cArr: any = [];
      fArr.forEach((item) => {
        if (item.id === row.id) item.checked = !item.checked;
        cArr.push(item);
      });
      setData(cArr);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [data],
  );

  // handle more button with edit, preview, delete
  const onMore = useCallback((e: any, row: any) => {
    console.log(e.target.id);
  }, []);

  const onDeleteSuccess = (id: string) => {
    // handle success, such as showing a success message or updating state
    setData((prevData) => prevData.filter((item) => item.id !== id));
    router.refresh();
  };

  // on header click sort table by ascending or descending order
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
        onDeleteSuccess,
      ),
    [order, column, onSelectAll, onChange, onMore, onHeaderClick],
  );

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mb-6 mt-8 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Your Listings
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
          total={reservationData.length}
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
