import { Expose } from 'class-transformer';
import { Users } from './user.entity';
import { IsString } from 'class-validator';

export class UserInfoDTO extends Users {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  phone: string;
  @Expose()
  departmentId: string;
  @Expose()
  limits: number;
}

type DTO = Partial<Users>;

export class UpdateUserDto implements DTO {
  @IsString()
  name: string;
  @IsString()
  phone: string;
  @IsString()
  departmentId: string;
}

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;
  @IsString()
  password: string;
}
