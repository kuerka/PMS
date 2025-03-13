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
import { AnyRole } from 'src/auth/constants';
import { UpdatePasswordDto, UpdateUserDto, UserInfoDTO } from './user.dto';
import { FailedCause } from '@/response-formatter/response-formatter.interceptor';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';

@Controller('user')
@Roles(...AnyRole)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsersById(@Req() request: Request) {
    const userInfo = plainToClass(UserInfoDTO, request['user'], {
      excludeExtraneousValues: true,
    });
    return userInfo;
  }

  @Post('update/info')
  async updateInfo(@Body() userDto: UpdateUserDto) {
    const user = this.userService.create(userDto);
    await this.userService.updateInfo(userDto.id, user);
  }

  @Post('update/password')
  async updatePassword(@Body() passwordDto: UpdatePasswordDto) {
    const { id, oldPassword, password } = passwordDto;
    const users = await this.userService.findById(id);
    if (users?.password !== oldPassword)
      return new FailedCause('Old password is incorrect');
    await this.userService.updatePassword(id, password);
  }
}
