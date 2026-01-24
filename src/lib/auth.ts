import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'besso-ranch-secret-change-me';
const TOKEN_NAME = 'besso_admin_token';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function generateToken(admin: AdminPayload): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminFromToken(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await verifyPassword(password, admin.password);

  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const payload: AdminPayload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };

  const token = generateToken(payload);

  return { success: true, token, admin: payload };
}

export { TOKEN_NAME };
