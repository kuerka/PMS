import { Exclude } from 'class-transformer';
import { Users } from './user.entity';

export class UserNoPasswordDto extends Users {
  @Exclude()
  password: string;
}

export class UpdatePasswordDto {
  id: number;
  oldPassword: string;
  password: string;
}
