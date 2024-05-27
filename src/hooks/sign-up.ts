import { signUpApi } from '@/api/sign-up/useSignUp';
import { auth } from '@/lib/firebase';
import {
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

type Props = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
};

export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: Props) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });
    await sendEmailVerification(user);

    await signUpApi({ email, password, firstName, lastName, uid: user.uid });

    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
    ) {
      throw new Error('Wrong Password.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No user found with this email.');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('The email is currently in use.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many wrong attempts.');
    } else {
      throw new Error(error.message);
    }
  }
};
