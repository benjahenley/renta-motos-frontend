import { firestore } from '@/lib/firestore';

export async function createTransaction(
  reservationId: string,
  transactionId: string,
) {
  try {
    const transactionRef = firestore.collection('transactions').doc();

    await transactionRef.set({
      id: transactionId,
      reservationId: reservationId,
      createdAt: new Date().toISOString(),
    });

    const reservationRef = firestore
      .collection('reservations')
      .doc(reservationId);

    const reservationSnap = await reservationRef.get();

    if (!reservationSnap.exists) {
      throw new Error('Reservation not found');
    }

    await reservationRef.update({
      transactionId,
    });

    return { ok: true };
  } catch (error) {
    console.error('Error creating transaction/reservation:', error);
    throw new Error('Unable to create transaction');
  }

  // await Transaction.createTransaction(reservationId, transactionId);
}
