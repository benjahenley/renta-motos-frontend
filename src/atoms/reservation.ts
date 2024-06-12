import { atomWithStorage } from 'jotai/utils';

export type reservation = {
  selected: {
    adults: number;
    rentTime: '1h' | '2h' | '4h' | 'fullDay';
    excursion: string | boolean;
    excursionName?: string | undefined;
  };
  startDate: Date;
};

export const selectionAtom = atomWithStorage<Partial<reservation | {}>>(
  'reservation',
  {},
);
