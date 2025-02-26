import { IsDateString, IsDecimal, IsInt, IsOptional } from 'class-validator';
import { ContractReceiptRecord } from '../entities/receipt-record.entity';
import { Exclude } from 'class-transformer';

type DTO = Partial<ContractReceiptRecord>;

export class CreateReceiptRecordDto implements DTO {
  @IsInt()
  contractPerformanceId: number;

  @IsDateString()
  receiptTime: string;

  @IsDecimal()
  receiptAmount: string;

  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();

  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}

export class UpdateReceiptRecordDto implements DTO {
  @IsInt()
  id: number;

  @IsDateString()
  receiptTime: string;

  @IsDecimal()
  receiptAmount: string;

  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}
