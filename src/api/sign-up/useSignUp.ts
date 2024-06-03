export const signUpApi = async (data: object) => {
  const url = 'https://renta-motos-backend.vercel.app/api/sign-up';
  try {
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred');
    }

    const responseData = await response.json();
    console.log({ responseData });
    return responseData;
  } catch (error: any) {
    throw new Error(error.message || 'An unknown error occurred');
  }
};
