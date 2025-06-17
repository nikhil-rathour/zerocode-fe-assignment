export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'] });
  return payload;
}

export async function GET() {
  try {
    const cookieStore = cookies(); 
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await decrypt(session);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
