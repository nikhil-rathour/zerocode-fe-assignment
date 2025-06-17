import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Client-side helper functions
export async function getSessionFromClient() {
  const response = await fetch('/api/auth/session');
  if (!response.ok) return null;
  return response.json();
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}