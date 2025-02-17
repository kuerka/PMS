import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/auth.decorators';

@Controller('user')
@Roles('ADMIN')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsersById(@Query('id') id: number) {
    console.log('id', id);
    const res = await this.userService.findById(id);
    console.log('res', res);
    return res;
  }
}
