import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Contract } from '../entities/contract.entity.entity';
import { PaginationDto } from '@/pagination/pagination.dto';
import { Exclude, Type } from 'class-transformer';
import { createCostFormDto } from '@/cost-form/dto/cost-form.dto';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';

type DTO = Partial<Contract>;

export class ContractDto implements DTO {
  @IsOptional()
  @IsInt()
  prospectProjectId?: number | null | undefined;
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
  remark: string;
  @IsBoolean()
  isPreliminaryNumber: boolean;
  @IsDateString()
  projectStartDate: string;
  @IsDateString()
  projectEndDate: string;
  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
  @IsOptional()
  @ValidateNested()
  @Type(() => createCostFormDto)
  productionCostForm: ProductionCostForm;
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
