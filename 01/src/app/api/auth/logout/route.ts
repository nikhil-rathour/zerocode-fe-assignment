import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  response.cookies.set({
    name: 'session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
  });

  return response;
}