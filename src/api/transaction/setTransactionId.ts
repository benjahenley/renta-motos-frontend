'use server';

export const setTransactionId = async (
  orderId: string,
  token: string,
  transactionId: string,
) => {
  const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/transaction';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, transactionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const res = await response.json();

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      message:
        'No se pudo actualizar el id de la transacción: ' + error.message,
    };
  }
};
