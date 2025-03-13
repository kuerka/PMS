import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorators';
import { LoginDto } from './auth.dto';
import { Response } from 'express';
import { FailedCause } from '@/response-formatter/response-formatter.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { username, password } = loginDto;
    const result = await this.authService.login(username, password);
    if (!(result instanceof FailedCause)) {
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 6 * 60 * 60 * 1000,
      });
    }
    return result;
  }
}
