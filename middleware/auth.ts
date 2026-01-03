import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function createAuthResponse(message: string, status: number = 401) {
  return NextResponse.json({ error: message }, { status });
}

