import { FailedCause } from '@/response-formatter/response-formatter.interceptor';
import { UserNoPasswordDto } from '@/user/user.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByName(username);
    if (user?.password !== password)
      return new FailedCause('Username or password is incorrect');

    const userDto = plainToClass(UserNoPasswordDto, user);
    const payload = await this.jwtService.signAsync({ ...userDto });
    return { token: payload };
  }
}
