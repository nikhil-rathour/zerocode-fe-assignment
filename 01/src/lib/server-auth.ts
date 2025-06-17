'use server';

import { jwtVerify, SignJWT } from 'jose';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'] });
  return payload;
}

// Client-side helper functions
export async function getSessionFromClient() {
  const response = await fetch('/api/auth/session');
  if (!response.ok) return null;
  const data = await response.json();
  return data.user;
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
} 