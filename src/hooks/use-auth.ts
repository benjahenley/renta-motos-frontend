// 'use client';

// import { useAtom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils';
// import { UserType } from '@/interfaces/user';

// export const customStorage = {
//   getItem: (key: string): string | null => {
//     if (typeof window !== 'undefined') {
//       return sessionStorage.getItem(key) || localStorage.getItem(key);
//     }
//     return null;
//   },
//   setItem: (key: string, value: string, rememberMe: boolean) => {
//     if (typeof window !== 'undefined') {
//       if (rememberMe) {
//         localStorage.setItem(key, value);
//       } else {
//         sessionStorage.setItem(key, value);
//       }
//     }
//   },
//   removeItem: (key: string) => {
//     if (typeof window !== 'undefined') {
//       sessionStorage.removeItem(key);
//       localStorage.removeItem(key);
//     }
//   },
// };

// // Ensure proper type alignment
// const customStringStorage = {
//   getItem: (key: string) => {
//     const value = customStorage.getItem(key);
//     return value !== null ? JSON.parse(value) : null;
//   },
//   setItem: (key: string, value: any) => {
//     customStorage.setItem(key, JSON.stringify(value), true);
//   },
//   removeItem: (key: string) => {
//     customStorage.removeItem(key);
//   },
// };

// const customBooleanStorage = {
//   getItem: (key: string) => {
//     const value = customStorage.getItem(key);
//     return value !== null ? JSON.parse(value) : false;
//   },
//   setItem: (key: string, value: boolean) => {
//     customStorage.setItem(key, JSON.stringify(value), true);
//   },
//   removeItem: (key: string) => {
//     customStorage.removeItem(key);
//   },
// };

// // Define atoms using custom storage
// const userAtom = atomWithStorage<Partial<UserType>>(
//   'loggedUser',
//   {},
//   customStringStorage,
// );
// const authorizationAtom = atomWithStorage<boolean>(
//   'isAuthorized',
//   false,
//   customBooleanStorage,
// );

// export default function useAuth() {
//   const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
//   const [user, setUser] = useAtom(userAtom);

//   const authorize = (user: Partial<UserType>, rememberMe: boolean) => {
//     setAuthorized(true);
//     setUser(user);
//     customStorage.setItem('loggedUser', JSON.stringify(user), rememberMe);
//     customStorage.setItem('isAuthorized', JSON.stringify(true), rememberMe);
//   };

//   const unauthorize = () => {
//     setAuthorized(false);
//     setUser({});
//     customStorage.removeItem('loggedUser');
//     customStorage.removeItem('isAuthorized');
//   };

//   return {
//     isAuthorized,
//     user,
//     authorize,
//     unauthorize,
//   };
// }

'use client';

import { UserType } from '@/interfaces/user';
import { User, UserInfo } from 'firebase/auth';
import { useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const isLoggedIn =
  typeof window !== 'undefined'
    ? localStorage.getItem('isAuthorized')
    : 'false';

const storage = createJSONStorage(
  // getStringStorage
  () => localStorage, // or sessionStorage, asyncStorage or alike
);

const userAtom = atomWithStorage<Partial<UserInfo>>(
  'loggedUser',
  {},
  createJSONStorage(() => localStorage),
);

const authorizationAtom = atomWithStorage(
  'isAuthorized',
  Boolean(isLoggedIn),
  storage,
);

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);

  return {
    isAuthorized,
    user,
    authorize(user: User) {
      setAuthorized(true);
      setUser(user);
    },

    unauthorize() {
      setAuthorized(false);
      setUser({});
    },
  };
}
