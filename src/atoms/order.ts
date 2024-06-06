import { atomWithStorage } from 'jotai/utils';

export type order = {
  orderId: string;
};

export const orderAtom = atomWithStorage<Partial<order | {}>>('orderId', '');
