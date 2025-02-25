import { IsInt, IsString } from 'class-validator';
import { Contract } from '../entities/contract.entity.entity';
import { PaginationDto } from '@/pagination/pagination.dto';

type DTO = Partial<Contract>;

export class ContractDto implements DTO {
  @IsString()
  contractNumber: string;
  @IsString()
  projectName: string;
  @IsString()
  projectType: string;
  @IsString()
  projectLocation: string;
  @IsString()
  owner: string;
  @IsString()
  amountType: '包干总价' | '固定单价';
  @IsString()
  remark?: string;
}

export class ContractQueryDto implements PaginationDto {
  page: number;
  limit: number;
}

export class ContractUpdateDto implements DTO {
  @IsInt()
  id: number;
  @IsString()
  contractNumber: string;
  @IsString()
  projectName: string;
  @IsString()
  projectType: string;
  @IsString()
  projectLocation: string;
  @IsString()
  owner: string;
  @IsString()
  amountType: '包干总价' | '固定单价';
  @IsString()
  remark?: string;
}
