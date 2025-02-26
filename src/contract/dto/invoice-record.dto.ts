import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContractInvoiceRecord } from '../entities/invoice-record.entity';
import { Exclude } from 'class-transformer';

type DTO = Partial<ContractInvoiceRecord>;

export class CreateInvoiceRecordDto implements DTO {
  @IsInt()
  contractPerformanceId: number;

  @IsDateString()
  invoiceTime: string;

  @IsDecimal()
  invoiceAmount: string;

  @IsEnum(['增值税专用发票', '增值税普通发票'])
  invoiceType: '增值税专用发票' | '增值税普通发票';

  @IsString()
  @IsOptional()
  remark: string;

  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();

  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}

export class UpdateInvoiceRecordDto implements DTO {
  @IsInt()
  id: number;

  @IsInt()
  contractPerformanceId: number;

  @IsDateString()
  invoiceTime: string;

  @IsDecimal()
  invoiceAmount: string;

  @IsEnum(['增值税专用发票', '增值税普通发票'])
  invoiceType: '增值税专用发票' | '增值税普通发票';

  @IsString()
  @IsOptional()
  remark: string;

  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}
