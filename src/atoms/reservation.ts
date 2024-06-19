import { atomWithStorage } from 'jotai/utils';

export type Selection = {
  date: string;
  adults: number;
  rentTime: '30min' | '1h' | '1h 30' | '2h' | '4h' | 'fullDay';
  excursion: boolean;
  excursionName: string;
};

export const selectionAtom = atomWithStorage<Partial<Selection>>(
  'selection',
  {},
);
