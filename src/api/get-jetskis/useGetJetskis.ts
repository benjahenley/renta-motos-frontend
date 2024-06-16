export interface Jetski {
  id: string;
  name: string;
  available: boolean;
  reservations: string[];
}

export const getJetskis = async (): Promise<Jetski[]> => {
  const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/jetskis';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: Jetski[] = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};

export const updateJetskiStatus = async (id: string): Promise<Jetski> => {
  const url = `${process.env.NEXT_PUBLIC_URL_API_SERVER}/jetski`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jetskiId: id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: Jetski = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
