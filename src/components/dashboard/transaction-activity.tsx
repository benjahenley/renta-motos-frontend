import { reservationData } from 'public/data/orders';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import { getToken } from '@/helpers/getToken';
import { getAllReservations } from '@/api/reservations/getAllReservations'
import { deleteReservation } from '@/api/reservations/deleteReservation';
import DotsDropdown from '../reservation/dots-dropdown';
import { useRouter } from 'next/navigation';

async function getData(start: number, offset: number) {
  const reservations = await getAllReservations();
  const filteredData = reservations.slice(start, offset);
  return filteredData;
}

export default function TransactionActivity() {
  const router = useRouter();
  const [order, setOrder] = useState<string>('desc');
  const [column, setColumn] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);

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
  }, [searchfilter, current]);

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
    },
    [data]
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
    },
    [data]
  );

  // handle more button with edit, preview, delete
  const onMore = useCallback(
    async (e: any, row: any) => {
      if (e.target.id === 'delete') {
        try {
          await deleteReservation(row.id);
          setData((prevData) => prevData.filter((item) => item.id !== row.id));
        } catch (error) {
          console.error('Failed to delete reservation:', error);
        }
      } else {
        console.log(e.target.id);
      }
    },
    [data]
  );

  const onDeleteSuccess = (id: string) => {
    // handle success, such as showing a success message or updating state
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };


  // on header click sort table by ascending or descending order
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
    [data, order]
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
        onDeleteSuccess,  // Añadido onDeleteSuccess
      ),
    [order, column, onSelectAll, onChange, onMore, onHeaderClick, ]
  );

  return (
    <>
      <div className="mb-4 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:gap-5 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Transaction Activity
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
        data={data.map((item) => ({
          ...item,
          actions: (
            <DotsDropdown
              key={item.id}
              reservationId={item.id}
              onDeleteSuccess={() => setData(data.filter((d) => d.id !== item.id))}
            />
          ),
        }))}
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
          variant="solid"
          prevIconClassName="!text-gray-dark"
          nextIconClassName="!text-gray-dark"
          onChange={(page) => {
            setCurrent(page);
          }}
        />
      </div>
    </>
  );
}
