import { IsInt, IsString } from 'class-validator';
import { File } from './file.entity';
import { Transform } from 'class-transformer';
import { parseIntString } from '@/utils/type';

type FileType = File['type'];

export class UploadFileDTO {
  @Transform(({ value }) => parseIntString(<string>value))
  @IsInt()
  id: number;
  @IsString()
  type: FileType;
  @IsString()
  name: string;
}

export class UpdateTypeDTO {
  @IsInt()
  id: number;
  @IsString()
  type: FileType;
}
