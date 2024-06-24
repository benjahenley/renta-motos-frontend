'use client';

import { getToken } from '@/helpers/getToken';

export interface Jetski {
  id: string;
  name: string;
  available: boolean;
  reservations: string[];
}

interface NewJetski {
  name: string;
  available: boolean;
  reservations: string[];
}

export const createJetski = async (jetski: NewJetski): Promise<Jetski> => {
  const url = '/api/jetski';

  try {
    const token = getToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jetski),
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
