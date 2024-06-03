export const getJetskis = async () => {
  const url = 'https://renta-motos-backend.vercel.app/api/jetskis';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const signData = await response.json();
    return signData;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
