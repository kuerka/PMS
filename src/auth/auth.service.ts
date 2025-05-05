import { FailedCause } from '@/response-formatter/response-formatter.interceptor';
import { UserInfoDTO } from '@/user/user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByName(username);
    if (user?.password !== password)
      return new FailedCause('Username or password is incorrect');

    const userDto = plainToClass(UserInfoDTO, user, {
      excludeExtraneousValues: true,
    });
    const payload = await this.jwtService.signAsync({ ...userDto });
    this.logger.log(`登录用户: ${JSON.stringify(userDto)}`);
    return { token: payload };
  }
}
