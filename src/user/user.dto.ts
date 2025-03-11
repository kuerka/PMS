import { Expose } from 'class-transformer';
import { Users } from './user.entity';
import { IsInt, IsString } from 'class-validator';

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
  @IsInt()
  id: number;
  @IsString()
  name: string;
  @IsString()
  phone: string;
  @IsString()
  departmentId: string;
  @IsInt()
  limits: number;
}

export class UpdatePasswordDto {
  @IsInt()
  id: number;
  @IsString()
  oldPassword: string;
  @IsString()
  password: string;
}
