'use client';

import { UserInfo } from 'firebase/auth';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { getToken } from '@/helpers/getToken';
import { checkRole } from '@/api/user/isAuthorized';
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
      // throw new Error('User is not authorized');
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
