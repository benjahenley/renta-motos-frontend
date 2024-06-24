import { firestore } from '@/lib/firestore';
import { User } from '@/models/user';

const collection = firestore.collection('users');

type Props = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  uid: string;
};

export async function signUp({
  email,
  firstName,
  lastName,
  password,
  uid,
}: Props) {
  const checkEmailInDB = async () => {
    const snapshot = await collection.where('email', '==', email).get();

    if (snapshot.empty) {
      return null;
    } else {
      return snapshot.docs[0].data().uid;
    }
  };

  const checkEmail = await checkEmailInDB();

  if (checkEmail) throw new Error('there is already a user with that email');

  try {
    const userRef = await collection.add({
      uid,
      role: 'user',
      email,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    const userData = await userRef.get();

    return userData.id;
  } catch (e: any) {
    return e.message;
  }
}
