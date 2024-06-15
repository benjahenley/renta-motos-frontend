import { atomWithStorage } from 'jotai/utils';

export type Excursion = {
    excursion: boolean;
    excursionName: string;
};

export const excursionAtom = atomWithStorage<Partial<Excursion>>('excursion', {
    excursion: false,
    excursionName: '',
});
