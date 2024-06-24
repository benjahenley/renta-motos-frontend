'use server';

import { firestore } from '@/lib/firestore';

const collection = firestore.collection('jetskis');

export async function getAllJetskis() {
  const jetskisSnap = await collection.get();

  if (jetskisSnap.empty) {
    throw new Error('No Jetskis found');
  }

  const data: any[] = [];
  jetskisSnap.docs.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  console.log(jetskisSnap.docs, jetskisSnap, data);

  return data;
}

export async function getAvailableJetskis() {
  const jetskisSnap = await collection.where('available', '==', true).get();

  if (jetskisSnap.empty) {
    throw new Error('No Jetskis found');
  }

  const data: any[] = [];
  jetskisSnap.forEach((doc) => {
    data.push(doc.id);
  });

  return data;
}

export async function toggleAvailable(jetskiId: string) {
  try {
    const jetskiRef = collection.doc(jetskiId);
    const jetskiDoc = await jetskiRef.get();

    if (!jetskiDoc.exists) {
      throw new Error(`Jetski with ID ${jetskiId} does not exist`);
    }

    const status = jetskiDoc.data()!.available;
    console.log({ status });

    await jetskiRef.update({ available: !status });
    return true;
  } catch (error: any) {
    console.error(
      `Error toggling availability for jetski ${jetskiId}:`,
      error.message,
    );

    return false;
  }
}

export async function createNewJetski(name: string) {
  try {
    const jetskiRef = collection.doc();
    const data = {
      available: true,
      name,
    };
    return await jetskiRef.set(data);
  } catch (error: any) {
    throw new Error('Error creating new Jetski:', error);
  }
}
