import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { email, password } = dto;
    if (!this.authService.validateCredentials(email, password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.authService.createToken(email);
    return { token, email };
  }

  @Get('me')
  async me(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('No token');
    const user = this.authService.verifyToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    return { email: user.email };
  }

  @Post('logout')
  async logout() {
    return { success: true };
  }
}
