export interface Jetski {
  id: string;
  name: string;
  available: boolean;
  reservations: string[];
}

export const getJetskis = async (): Promise<{ jetskis: Jetski[] }> => {
  const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/jetskis';
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const data: { jetskis: Jetski[] } = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};

// export const updateJetskiStatus = async (id: string, available: boolean): Promise<Jetski> => {
//   const url = `${process.env.NEXT_PUBLIC_URL_API_SERVER}/jetskis/${id}`;
//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ available }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'An unknown error occurred');
//     }

//     const data: Jetski = await response.json();
//     return data;
//   } catch (error: any) {
//     throw new Error(error.message || 'An unknown error occurred');
//   }
// };


export const updateJetskiStatus = async (id: string): Promise<Jetski> => {
  const url = `${process.env.NEXT_PUBLIC_URL_API_SERVER}/jetskis/${id}`;
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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
