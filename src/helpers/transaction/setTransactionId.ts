export const setTransactionId = async (
  reservationId: string,
  token: string,
  transactionId: string,
) => {
  const url = '/api/transaction';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reservationId, transactionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const res = await response.json();
    console.log('res?');

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      message:
        'No se pudo actualizar el id de la transacción: ' + error.message,
    };
  }
};
