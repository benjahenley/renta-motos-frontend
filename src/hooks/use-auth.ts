'use client';

import { UserType } from '@/interfaces/user';
import { User, UserInfo } from 'firebase/auth';
import { useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { AsyncStorage, SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { useEffect, useState } from 'react';

const isLoggedIn =
  typeof window !== 'undefined'
    ? localStorage.getItem('isAuthorized')
    : 'false';

const userAtom = atomWithStorage<Partial<UserInfo>>('loggedUser', {});

const authorizationAtom = atomWithStorage('isAuthorized', Boolean(isLoggedIn));

export default function useAuth() {
  // const storageValue: any = createJSONStorage(() => localStorage);

  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);

  return {
    isAuthorized,
    user,
    authorize(user: User) {
      // if (storageType) {
      //   setStorage(createJSONStorage(() => localStorage));
      // } else {
      //   setStorage(createJSONStorage(() => sessionStorage));
      // }
      setAuthorized(true);
      setUser(user);
    },

    unauthorize() {
      setAuthorized(false);
      setUser({});
    },
  };
}
