export const signIn = async (data: object) => {
  const url = 'http://localhost:3001/api/sign-in';
  try {
    const response = await fetch(url, {
      method: 'post',
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
