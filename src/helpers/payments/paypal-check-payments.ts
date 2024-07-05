import { PaypalOrderStatusResponse } from '@/interfaces/paypal';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: 'no se pudo obtener token de verificacion',
    };
  }
  const resp = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: 'Error al verificar el pago',
    };
  }

  const { status, purchase_units } = resp;
  // const {} = purchase_units[0]
  console.log(status, purchase_units);
  return { status, purchase_units };
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.NEXT_PUBLIC_PAYPAL_OAUTH_URL ?? '';

  console.log(PAYPAL_CLIENT_ID);

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8',
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions: any = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  try {
    const result = await fetch(oauth2Url, requestOptions).then((r) => r.json());
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string,
): Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.NEXT_PUBLIC_PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const data = await fetch(paypalOrderUrl, requestOptions).then((r) =>
      r.json(),
    );
    return data;
  } catch (e: any) {
    console.log(e);
    return null;
  }
};
