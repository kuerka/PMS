import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Contract } from '../entities/contract.entity';
import { PaginationDto } from '@/pagination/pagination.dto';
import { Type } from 'class-transformer';
import {
  createCostFormDto,
  updateCostFormDto,
} from '@/cost-form/dto/cost-form.dto';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { CreatePerformanceDto } from './performance.dto';
import { ContractPerformance } from '../entities/performance.entity';

type DTO = Partial<Contract>;
type AmountType = Contract['amountType'];

export class CreateContractDto implements DTO {
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

  @ValidateNested()
  @Type(() => createCostFormDto)
  productionCostForm: ProductionCostForm;
  @ValidateNested()
  @Type(() => CreatePerformanceDto)
  contractPerformance: ContractPerformance;
}

export class ContractQuery implements DTO {
  @IsOptional()
  @IsString()
  contractNumber?: string;
  @IsOptional()
  @IsString()
  projectName?: string;
  @IsOptional()
  @IsString()
  projectType?: string;
  @IsOptional()
  @IsString()
  projectLocation?: string;
  @IsOptional()
  @IsString()
  owner?: string;
  @IsOptional()
  @IsString()
  amountType?: AmountType;
  @IsOptional()
  @IsString()
  remark?: string;
  @IsOptional()
  @IsBoolean()
  isPreliminaryNumber?: boolean;
  @IsOptional()
  @IsDateString()
  projectStartDate?: string;
  @IsOptional()
  @IsDateString()
  projectEndDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => updateCostFormDto)
  productionCostForm?: ProductionCostForm;
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContractDto)
  contractPerformance?: ContractPerformance;
}

export class QueryContractDto implements PaginationDto {
  @IsOptional()
  @IsInt()
  page: number = 1;
  @IsOptional()
  @IsInt()
  limit: number;
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractQuery)
  query: ContractQuery;
}

export class UpdateContractDto implements DTO {
  @IsInt()
  id: number;
  @IsOptional()
  @IsString()
  contractNumber?: string;
  @IsOptional()
  @IsString()
  projectName?: string;
  @IsOptional()
  @IsString()
  projectType?: string;
  @IsOptional()
  @IsString()
  projectLocation?: string;
  @IsOptional()
  @IsString()
  owner?: string;
  @IsOptional()
  @IsString()
  amountType?: AmountType;
  @IsOptional()
  @IsString()
  remark?: string;
  @IsOptional()
  @IsBoolean()
  isPreliminaryNumber?: boolean;
  @IsOptional()
  @IsDateString()
  projectStartDate?: string;
  @IsOptional()
  @IsDateString()
  projectEndDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => updateCostFormDto)
  productionCostForm?: ProductionCostForm;
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContractDto)
  contractPerformance?: ContractPerformance;
}
