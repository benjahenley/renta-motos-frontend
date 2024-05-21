'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface UserType {
  name: string;
  avatar: string;
  role: string;
}

const isLoggedIn =
  typeof window !== 'undefined'
    ? localStorage.getItem('isAuthorized')
    : 'false';

const userAtom = atomWithStorage<Partial<UserType>>('loggedUser', {});
const authorizationAtom = atomWithStorage('isAuthorized', Boolean(isLoggedIn));

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);

  return {
    isAuthorized,
    user,
    authorize(user: UserType) {
      setAuthorized(true);
      setUser(user);
    },
    unauthorize(user: UserType) {
      setAuthorized(false);
      setUser({});
    },
  };
}
