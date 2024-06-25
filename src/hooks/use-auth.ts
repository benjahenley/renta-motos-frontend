'use client';

import { UserInfo } from 'firebase/auth';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { getToken } from '@/helpers/getToken';
import { checkRole } from '@/helpers/user/isAuthorized';
import { useModal } from '@/components/modals/context';

const isLoggedIn =
  typeof window !== 'undefined'
    ? localStorage.getItem('isAuthorized')
    : 'false';

const userAtom = atomWithStorage<Partial<UserInfo>>('loggedUser', {});

const authorizationAtom = atomWithStorage('isAuthorized', Boolean(isLoggedIn));

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);
  const { openModal } = useModal();

  const authorize = (user: UserInfo) => {
    setAuthorized(true);
    setUser(user);
  };

  const unauthorize = () => {
    setAuthorized(false);
    setUser({});

  };

  const isAdmin = async () => {
    try {
      const token = getToken();
      if (!token) {
        openModal('SIGN_IN');
      }
      const isAdminUser = await checkRole(token);
      return isAdminUser;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isAuthorized,
    user,
    authorize,
    unauthorize,
    isAdmin,
  };
}
// 'use client';

// import { UserInfo } from 'firebase/auth';
// import { useAtom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils';
// import { getToken, removeToken } from '@/helpers/getToken';
// import { checkRole } from '@/helpers/user/isAuthorized';
// import { useModal } from '@/components/modals/context';

// const isLoggedIn =
//   typeof window !== 'undefined'
//     ? localStorage.getItem('isAuthorized')
//     : 'false';

// const userAtom = atomWithStorage<Partial<UserInfo>>('loggedUser', {});

// const authorizationAtom = atomWithStorage('isAuthorized', Boolean(isLoggedIn));

// export default function useAuth() {
//   const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
//   const [user, setUser] = useAtom(userAtom);
//   const { openModal } = useModal();

//   const authorize = (user: UserInfo) => {
//     setAuthorized(true);
//     setUser(user);
//   };

//   const unauthorize = () => {
//     setAuthorized(false);
//     setUser({});
//     removeToken();
//     openModal('SIGN_IN'); // Abre el modal de inicio de sesión
//   };

//   const isAdmin = async () => {
//     try {
//       const token = getToken();
//       if (!token) {
//         throw new Error('Token not found');
//       }
//       const isAdminUser = await checkRole(token);
//       return isAdminUser;
//     } catch (error) {
//       console.error(error);
//       unauthorize(); // Si hay un error, desautoriza al usuario y abre el modal de inicio de sesión
//       return false;
//     }
//   };

//   return {
//     isAuthorized,
//     user,
//     authorize,
//     unauthorize,
//     isAdmin,
//   };
// }
