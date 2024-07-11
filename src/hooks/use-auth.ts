'use client';

import { useEffect } from 'react';
import { UserInfo, onIdTokenChanged, getIdToken, signOut } from 'firebase/auth';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { auth } from '@/lib/firebase'; // Adjust the import according to your setup
import { checkRole } from '@/helpers/user/isAuthorized';
import { useModal } from '@/components/modals/context';

const isLoggedIn =
  typeof window !== 'undefined'
    ? localStorage.getItem('isAuthorized')
    : 'false';

const userAtom = atomWithStorage<Partial<UserInfo>>('loggedUser', {});
const tokenAtom = atomWithStorage<string | null>('authToken', null);
const authorizationAtom = atomWithStorage('isAuthorized', Boolean(isLoggedIn));

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const { openModal } = useModal();

  const authorize = (user: UserInfo) => {
    setAuthorized(true);
    setUser(user);
  };

  const unauthorize = async () => {
    setAuthorized(false);
    setUser({});
    setToken(null);
    await signOut(auth);
  };

  const isAdmin = async () => {
    try {
      const currentToken = await getIdToken(auth.currentUser!);
      if (!currentToken) {
        openModal('SIGN_IN');
      }
      const isAdminUser = await checkRole(currentToken);
      return isAdminUser;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        const newToken = await currentUser.getIdToken(true); // Force refresh token
        setToken(newToken);
        setAuthorized(true);
        setUser(currentUser as UserInfo);
      } else {
        setAuthorized(false);
        setUser({});
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    isAuthorized,
    user,
    authorize,
    unauthorize,
    isAdmin,
  };
}
