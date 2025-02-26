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
import {
  createCostFormDto,
  updateCostFormDto,
} from '@/cost-form/dto/cost-form.dto';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { CreatePerformanceDto } from './performance.dto';
import { ContractPerformance } from '../entities/performance.entity';

type DTO = Partial<Contract>;
type AmountType = Contract['amountType'];

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
  amountType: AmountType;
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
  @ValidateNested()
  @Type(() => createCostFormDto)
  productionCostForm: ProductionCostForm;
  @ValidateNested()
  @Type(() => CreatePerformanceDto)
  contractPerformance: ContractPerformance;
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
  amountType: AmountType;
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
  updatedAt: Date = new Date();
  @IsOptional()
  @ValidateNested()
  @Type(() => updateCostFormDto)
  productionCostForm: ProductionCostForm;
}
