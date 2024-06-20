'use server';

export const getAvailableJetskis = async (): Promise<string[]> => {
  const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/jetskis/available';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: string[] = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
