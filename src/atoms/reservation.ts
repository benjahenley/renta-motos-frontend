import { atomWithStorage } from 'jotai/utils';

export type Selection = {
  date: string;
  adults: number;
  rentTime: '30min' | '1h' | '1h30' | '2h' | '4h' | 'fullDay';
  excursion: boolean;
  excursionName?: string | undefined;
};

export const selectionAtom = atomWithStorage<Partial<Selection>>(
  'selection',
  {},
);
