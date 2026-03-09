import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email?: string; password?: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email and password required');
    }
    if (!this.authService.validateCredentials(email, password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.authService.createToken(email);
    return { token, email };
  }

  @Get('me')
  async me(@Headers('authorization') authHeader?: string) {
    try {
      const token = authHeader?.replace(/^Bearer\s+/i, '');
      if (!token) {
        throw new UnauthorizedException('No token');
      }
      const user = this.authService.verifyToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return { email: user.email };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('logout')
  async logout() {
    return { success: true };
  }
}
