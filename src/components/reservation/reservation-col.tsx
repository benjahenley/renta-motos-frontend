'use client';

import DotsDropdown from '@/components/reservation/dots-dropdown';
import Checkbox from '@/components/ui/form-fields/checkbox';
import HeaderCell from '@/components/ui/table/header-cell';
import Avatar from '@/components/ui/avatar';
import Badge from '@/components/ui/badge';

export enum STATUS {
  Received = 'received',
  Pending = 'pending',
  Cancelled = 'cancelled',
}

export function getStatus(status: string) {
  if (status === STATUS.Received) {
    return 'success';
  }
  if (status === STATUS.Pending) {
    return 'warning';
  }
  if (status === STATUS.Cancelled) {
    return 'danger';
  }
}

export const reservationColumn = (
  order: string,
  column: string,
  onSelectAll: (key: boolean) => any,
  onChange: (row: any) => any,
  onMore: (e: any, row: any) => any,
  onHeaderClick: (value: string) => any,
  onDeleteSuccess: (id: string) => any,   // Añadido onDeleteSuccess
) => [
  {
    title: (
      <HeaderCell
        title={
          <Checkbox
            variant="outline"
            inputClassName="!bg-white focus:!ring-0"
            onChange={(e) => onSelectAll(e.target.checked)}
            iconClassName="bg-gray-dark rounded cursor-pointer"
          />
        }
        className="lg:pl-5"
      />
    ),
    dataIndex: 'checked',
    key: 'checked',
    width: 50,
    render: (checked: boolean, row: any) => (
      <div className="inline-flex cursor-pointer lg:pl-5">
        <Checkbox
          variant="outline"
          checked={row.checked}
          onChange={() => onChange(row)}
          inputClassName="!bg-white focus:!ring-0"
          iconClassName="bg-gray-dark rounded cursor-pointer"
        />
      </div>
    ),
  },
  {
    title: <HeaderCell title={'ID'} />,
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: (
      <HeaderCell
        title={'Date'}
        sortable={true}
        ascending={order === 'asc' && column === 'date'}
      />
    ),
    onHeaderCell: () => onHeaderClick('date'),
    dataIndex: 'date',
    key: 'date',
    width: 150,
    render: (date: any) => <p className="whitespace-nowrap">{date}</p>,
  },
  {
    title: <HeaderCell title={'Start Time'} />,
    dataIndex: 'startTime',
    key: 'startTime',
    width: 120,
    render: (startTime: string) => (
      <p className="whitespace-nowrap">{startTime}</p>
    ),
  },
  {
    title: <HeaderCell title={'End Time'} />,
    dataIndex: 'endTime',
    key: 'endTime',
    width: 120,
    render: (endTime: string) => <p className="whitespace-nowrap">{endTime}</p>,
  },
  {
    title: <HeaderCell title={'Customer'} />,
    dataIndex: 'userFullName',
    key: 'userFullName',
    width: 200,
    render: (name: any) => <p className="whitespace-nowrap">{name}</p>,
  },
  {
    title: <HeaderCell title={'Status'} />,
    dataIndex: 'status',
    key: 'status',
    width: 50,
    render: (status: string) => {
      if (!status) return '__';
      return (
        // @ts-ignore
        <Badge variant="flat" className="uppercase" color={getStatus(status)}>
          {status}
        </Badge>
      );
    },
  },

  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    width: 50,
    render: (value: any, row: any) => (
      <div className="flex items-center gap-2">
        <DotsDropdown key={row.key} reservationId={row.id} onDeleteSuccess={() => onDeleteSuccess(row.id)}  // Ajustado para pasar el id
          onClick={(e: any) => onMore(e, row)} />
      </div>
    ),
  },
];
