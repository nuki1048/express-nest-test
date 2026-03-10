import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'change-me';

@Injectable()
export class AuthService {
  validateCredentials(email: string, password: string): boolean {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  }

  createToken(email: string): string {
    const payload = JSON.stringify({ email, iat: Date.now() });
    const signature = crypto
      .createHmac('sha256', ADMIN_SESSION_SECRET)
      .update(payload)
      .digest('hex');
    return Buffer.from(JSON.stringify({ payload, signature })).toString(
      'base64',
    );
  }

  verifyToken(token: string): { email: string } | null {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString()) as {
        payload: string;
        signature: string;
      };
      const expected = crypto
        .createHmac('sha256', ADMIN_SESSION_SECRET)
        .update(decoded.payload)
        .digest('hex');
      if (decoded.signature !== expected) return null;
      const { email } = JSON.parse(decoded.payload) as { email: string };
      return { email };
    } catch {
      return null;
    }
  }
}
