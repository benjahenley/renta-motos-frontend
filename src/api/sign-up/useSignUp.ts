export const signUpApi = async (data: object) => {
  const url = process.env.URL_API_SERVER + '/sign-up';

  try {
    const response = await fetch(url, {
      method: 'POST',
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
