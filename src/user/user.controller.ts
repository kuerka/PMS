import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/auth.decorators';
import { ANY_ROLE } from 'src/auth/constants';
import { UpdatePasswordDto, UpdateUserDto, UserInfoDTO } from './user.dto';
import { FailedCause } from '@/response-formatter/response-formatter.interceptor';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { Users } from './user.entity';

@Controller('user')
@Roles(...ANY_ROLE)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsersById(@Req() request: Request) {
    const { id } = <Users>request['user'];
    if (!id) return;
    const user = this.userService.findById(id);
    const userInfo = plainToClass(UserInfoDTO, user, {
      excludeExtraneousValues: true,
    });
    return userInfo;
  }

  @Post('update/info')
  async updateInfo(@Body() userDto: UpdateUserDto, @Req() request: Request) {
    const { id } = <Users>request['user'];
    if (!id) return;
    const user = this.userService.create(userDto);
    await this.userService.updateInfo(id, user);
  }

  @Post('update/password')
  async updatePassword(
    @Body() passwordDto: UpdatePasswordDto,
    @Req() request: Request,
  ) {
    const { id } = <Users>request['user'];
    if (!id) return;
    const { oldPassword, password } = passwordDto;
    const users = await this.userService.findById(id);
    if (users?.password !== oldPassword)
      return new FailedCause('Old password is incorrect');
    await this.userService.updatePassword(id, password);
  }
}
