import { auth } from '@/lib/firebase';
import { User, signInWithEmailAndPassword } from 'firebase/auth';

export const signIn = async (
  email: string,
  password: string,
  remember: boolean,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const verified = userCredential.user.emailVerified;
    if (!verified) throw new Error('Email has not yet been verified');
    const user: User = userCredential.user;
    return user;
  } catch (error: any) {
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
    ) {
      throw new Error('Wrong Password.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No user found with this email.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many wrong attempts.');
    } else {
      throw new Error(error.message);
    }
  }
};
