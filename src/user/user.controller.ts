import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/auth.decorators';
import { LimitsMap } from 'src/auth/constants';
import { plainToClass } from 'class-transformer';
import {
  UpdatePasswordDto,
  UpdateUserDto,
  UserNoPasswordDto,
} from './user.dto';
import { FailedCause } from '@/response-formatter/response-formatter.interceptor';

@Controller('user')
@Roles(LimitsMap.admin, LimitsMap.edit, LimitsMap.view)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsersById(@Query('id') id: number) {
    const user = await this.userService.findById(id);
    if (!user) return new FailedCause('User not found');
    return plainToClass(UserNoPasswordDto, user);
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
