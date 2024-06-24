import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/middlewares/token';
import { verifyUserRole } from '@/controllers/user';

export async function GET(request: NextRequest) {
  try {
    const uid = await authenticateToken(request);
    const token = await verifyUserRole(uid);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
