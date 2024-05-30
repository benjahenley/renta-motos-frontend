import { atomWithStorage } from 'jotai/utils';

export type reservation = {
  selected: {
    adults: number;
    rentTime: '2hs' | '4hs' | 'fullDay';
  };
  startDate: Date;
};

export const reservationAtom = atomWithStorage<Partial<reservation | {}>>(
  'reservation',
  {},
);
