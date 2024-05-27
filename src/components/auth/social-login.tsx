'use client';

import useAuth from '@/hooks/use-auth';
import Button from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/google';
import { useModal } from '@/components/modals/context';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function SocialLogin() {
  const { closeModal } = useModal();
  const { authorize } = useAuth();

  const handleSocialLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      const user = result.user;

      console.log(user);
      // const userData = await signInGoogle(user.email!, user.uid);

      // authorize(user);
      // closeModal();
    } catch (e: any) {
      switch (e.code) {
        case 'auth/popup-closed-by-user':
          console.warn('Sign-in popup closed by user.');
          alert(
            'Sign-in was not completed. Please try again. Consider reviewing your site settings to allow popups',
          );
          break;
        case 'auth/network-request-failed':
          console.error('Network error:', e);
          alert('Network error. Please check your connection and try again.');
          break;
        case 'auth/cancelled-popup-request':
          console.warn('Cancelled popup request:', e);
          alert('Popup request was cancelled. Please try again.');
          break;
        default:
          console.error('Error signing in with Google:', e);
          alert(
            'An unexpected error occurred during sign-in. Please try again later.',
          );
          break;
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
      >
        <GoogleIcon className="mr-5" />
        Sign up with Google
      </Button>
    </>
  );
}
