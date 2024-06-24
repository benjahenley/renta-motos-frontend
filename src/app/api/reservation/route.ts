import {
  createReservation,
  deleteReservation,
} from '@/controllers/reservation';
import { getOneHourExpirationDate } from '@/helpers/getDate';
import { authenticateToken } from '@/middlewares/token';
import { mainReservationSchema } from '@/yup/reservation';
import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';

function handleError(e: any) {
  if (e instanceof yup.ValidationError) {
    const errors = e.inner.map((err: any) => ({
      path: err.path,
      message: err.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }
  return NextResponse.json({ error: (e as Error).message }, { status: 500 });
}

// CREATE RESERVATION
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateToken(request);
    const requestData = await request.json();

    const { adults, excursion, startTime, endTime, excursionName, date } =
      await mainReservationSchema.validate(requestData, {
        abortEarly: false,
      });

    const expirationDate = getOneHourExpirationDate();

    const reservationId = await createReservation({
      date,
      userId,
      excursion,
      startTime,
      endTime,
      excursionName,
      adults,
      expirationDate,
    });

    return NextResponse.json({ reservationId });
  } catch (e: unknown) {
    return handleError(e);
  }
}

//DELETE RESERVATION
export async function DELETE(req: NextRequest) {
  try {
    const uid = await authenticateToken(req);

    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get('id');

    if (!reservationId) {
      const response = NextResponse.json(
        { error: 'reservationId is required' },
        { status: 400 },
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,POST,DELETE',
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Authorization, Content-Type',
      );
      return response;
    }

    await deleteReservation(reservationId);

    const response = NextResponse.json({
      success: 'Successfully removed reservation from database',
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,POST,DELETE',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type',
    );
    return response;
  } catch (e: any) {
    const response = NextResponse.json({ error: e.message }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,POST,DELETE',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type',
    );
    return response;
  }
}
