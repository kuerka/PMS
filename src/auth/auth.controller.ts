import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtUserInfo, LimitsMap } from './constants';
import { Public, Roles } from './auth.decorators';

type Login = {
  username: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: Login) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Roles(LimitsMap.admin, LimitsMap.edit)
  @Post('profile')
  getProfile(@Request() req: { user: JwtUserInfo }) {
    return req.user;
  }
}
