import { Exclude } from 'class-transformer';
import { Users } from './user.entity';
import { IsInt, IsString } from 'class-validator';

export class UserNoPasswordDto extends Users {
  @Exclude()
  password: string;
}

type DTO = Partial<Users>;

export class UpdateUserDto implements DTO {
  @IsInt()
  id: number;
  @IsString()
  username: string;
  @IsString()
  phone: string;
  @IsString()
  departmentId: string;
  @IsInt()
  limits: number;
}

export class UpdatePasswordDto {
  id: number;
  oldPassword: string;
  password: string;
}
