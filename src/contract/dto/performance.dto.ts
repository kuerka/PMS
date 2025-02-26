import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { ContractPerformance } from '../entities/performance.entity';
import { Exclude } from 'class-transformer';

type DTO = Partial<ContractPerformance>;

type BondType = ContractPerformance['bondType'];
type ContractExecutionStatus = ContractPerformance['contractExecutionStatus'];

export class CreatePerformanceDto implements DTO {
  @IsString()
  bondType: BondType;
  @IsString()
  cashBondAmount: string;
  @IsDateString()
  bondExpiryDate: string;
  @IsString()
  contractSettlementAmount: string;
  @IsString()
  accountsReceivable: string;
  @IsString()
  contractExecutionStatus: ContractExecutionStatus;
  @IsString()
  accumulatedInvoiceAmount: string;
  @IsString()
  accumulatedReceiptAmount: string;
  @IsString()
  uncollectedAmount: string;
  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}

export class UpdatePerformanceDto implements DTO {
  @IsInt()
  id: number;
  @IsString()
  bondType: BondType;
  @IsString()
  cashBondAmount: string;
  @IsDateString()
  bondExpiryDate: string;
  @IsString()
  contractSettlementAmount: string;
  @IsString()
  accountsReceivable: string;
  @IsString()
  contractExecutionStatus: ContractExecutionStatus;
  @IsString()
  accumulatedInvoiceAmount: string;
  @IsString()
  accumulatedReceiptAmount: string;
  @IsString()
  uncollectedAmount: string;
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}
