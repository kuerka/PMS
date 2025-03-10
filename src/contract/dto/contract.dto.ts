import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Contract } from '../entities/contract.entity';
import { PaginationDto, SortDTO } from '@/pagination/pagination.dto';
import { Type } from 'class-transformer';
import {
  createCostFormDto,
  updateCostFormDto,
} from '@/cost-form/dto/cost-form.dto';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';

type DTO = Partial<Contract>;
type AmountType = Contract['amountType'];
type BondType = Contract['bondType'];
type ContractExecutionStatus = Contract['contractExecutionStatus'];

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

  @IsString()
  bondType: BondType;
  @IsDecimal()
  cashBondAmount: string;
  @IsDateString()
  bondExpiryDate: string;
  @IsDecimal()
  contractSettlementAmount: string;
  @IsDecimal()
  accountsReceivable: string;
  @IsString()
  contractExecutionStatus: ContractExecutionStatus;

  @ValidateNested()
  @Type(() => createCostFormDto)
  productionCostForm: ProductionCostForm;
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

  @IsInt()
  id: number;
  @IsOptional()
  @IsString()
  bondType: BondType;
  @IsOptional()
  @IsDecimal()
  cashBondAmount: string;
  @IsOptional()
  @IsDateString()
  bondExpiryDate: string;
  @IsOptional()
  @IsDecimal()
  contractSettlementAmount: string;
  @IsOptional()
  @IsDecimal()
  accountsReceivable: string;
  @IsOptional()
  @IsString()
  contractExecutionStatus: ContractExecutionStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => updateCostFormDto)
  productionCostForm?: ProductionCostForm;
}

export class QueryContractDto {
  @IsOptional()
  @IsArray()
  searchValues: string[];
  @IsOptional()
  @IsArray()
  projectType: string[];
  @IsOptional()
  @IsString()
  projectLocation: string;
  @IsOptional()
  @IsString()
  owner: string;
  @IsOptional()
  @IsString()
  amountType: AmountType;
  @IsOptional()
  @IsArray()
  projectDate: string[];
  @IsOptional()
  @IsString()
  bondType: string;
  @IsOptional()
  @IsArray()
  cashBondAmount: string[];
  @IsOptional()
  @IsArray()
  bondExpiryDate: string[];
  @IsOptional()
  @IsArray()
  contractSettlementAmount: string[];
  @IsOptional()
  @IsArray()
  accountsReceivable: string[];
  @IsOptional()
  @IsArray()
  contractExecutionStatus: ContractExecutionStatus[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pageParams: PaginationDto;
  @IsOptional()
  @ValidateNested()
  @Type(() => SortDTO)
  sort: SortDTO;
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
  @IsString()
  bondType: BondType;
  @IsOptional()
  @IsDecimal()
  cashBondAmount: string;
  @IsOptional()
  @IsDateString()
  bondExpiryDate: string;
  @IsOptional()
  @IsDecimal()
  contractSettlementAmount: string;
  @IsOptional()
  @IsDecimal()
  accountsReceivable: string;
  @IsOptional()
  @IsString()
  contractExecutionStatus: ContractExecutionStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => updateCostFormDto)
  productionCostForm?: ProductionCostForm;
}
