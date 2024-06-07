
// export interface Jetski {
//   id: number;
//   name: string;
//   status: 'available' | 'maintenance';
// }
// // api/get-jetskis/useGetJetskis.ts
// export const getJetskis = async (): Promise<{ jetskis: Jetski[] }> => {
//   const url = process.env.NEXT_PUBLIC_URL_API_SERVER + '/jetskis';
//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'An unknown error occurred');
//     }

//     const data: { jetskis: Jetski[] } = await response.json();
//     return data;
//   } catch (error: any) {
//     throw new Error(error.message || 'An unknown error occurred');
//   }
// };


// export const updateJetskiStatus = async (id: number, status: 'available' | 'maintenance'): Promise<Jetski> => {
//   const url = `${process.env.NEXT_PUBLIC_URL_API_SERVER}/jetskis/${id}`;
//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ status }),
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


// src/api/get-jetskis/useGetJetskis.ts
export interface Jetski {
  id: number;
  name: string;
  status: 'available' | 'maintenance';
  reservations: any[]; // Agregar esta propiedad
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

export const updateJetskiStatus = async (id: number, status: 'available' | 'maintenance'): Promise<Jetski> => {
  const url = `${process.env.NEXT_PUBLIC_URL_API_SERVER}/jetskis/${id}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
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
