import { firestore } from '@/lib/firestore';

const collection = firestore.collection('users');

export async function verifyUserRole(uid: string) {
  const userSnapshot = await collection.where('uid', '==', uid).limit(1).get();

  if (userSnapshot.empty) {
    throw new Error('No user exists with that ID');
  }

  const userData = userSnapshot.docs[0].data();

  if (userData.role === 'admin') {
    console.log('User is verified as Admin');
    return true;
  } else {
    throw new Error('User is not allowed to access this site');
  }
}
