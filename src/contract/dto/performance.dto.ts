import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContractPerformance } from '../entities/performance.entity';

type DTO = Partial<ContractPerformance>;

type BondType = ContractPerformance['bondType'];
type ContractExecutionStatus = ContractPerformance['contractExecutionStatus'];

export class CreatePerformanceDto implements DTO {
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
}

export class UpdatePerformanceDto implements DTO {
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
}
