import { atomWithStorage } from 'jotai/utils';

export type reservation = {
  selected: {
    adults: number;
    rentTime: '2h' | '4h' | 'fullDay';
  };
  startDate: Date;
};

export const reservationAtom = atomWithStorage<Partial<reservation | {}>>(
  'reservation',
  {},
);
