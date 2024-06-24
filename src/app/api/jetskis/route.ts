import { getAllJetskis } from '@/controllers/jetskis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const jetskis = await getAllJetskis();
    const response = NextResponse.json(jetskis);
    response.headers.set('Cache-Control', 'no-store');
    return NextResponse.json(jetskis);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
