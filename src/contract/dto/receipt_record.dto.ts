import { IsDateString, IsDecimal, IsInt, IsOptional } from 'class-validator';
import { ContractReceiptRecord } from '../entities/receipt-record.entity';

type DTO = Partial<ContractReceiptRecord>;

export class CreateReceiptRecordDto implements DTO {
  @IsInt()
  contractPerformanceId: number;

  @IsDateString()
  receiptTime: string;

  @IsDecimal()
  receiptAmount: string;
}

export class UpdateReceiptRecordDto implements DTO {
  @IsInt()
  id: number;
  @IsOptional()
  @IsDateString()
  receiptTime: string;
  @IsOptional()
  @IsDecimal()
  receiptAmount: string;
}
