import { IsDateString, IsInt, IsString } from 'class-validator';
import { ContractPerformance } from '../entities/performance.entity';

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
}
