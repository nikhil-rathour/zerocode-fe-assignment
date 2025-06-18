import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { encrypt } from '@/lib/server-auth';
import { LoginFormData } from '@/lib/types';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { email, password }: LoginFormData = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = await encrypt(userData);

    const response = NextResponse.json({ user: userData }, { status: 200 });

    response.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      path: '/', // optional but good to include
    });

    console.log('Login successful',user);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
