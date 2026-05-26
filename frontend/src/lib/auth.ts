import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required. Set it in your .env file.')
  }
  return secret
}

const JWT_SECRET = getJwtSecret()

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}

export function getUserFromRequest(req: NextRequest): { userId: string; email: string } | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return verifyToken(authHeader.substring(7))
}
