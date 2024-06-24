export const signIn = async (data: object) => {
  const url = '/api/sign-in';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
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

export const signInGoogle = async (email: string, uid: string) => {
  const url = '/api/sign-in';
  try {
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify({ email, uid }),
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
