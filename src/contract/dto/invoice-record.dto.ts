import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContractInvoiceRecord } from '../entities/invoice-record.entity';

type DTO = Partial<ContractInvoiceRecord>;

export class CreateInvoiceRecordDto implements DTO {
  @IsInt()
  contractId: number;

  @IsDateString()
  invoiceTime: string;

  @IsDecimal()
  invoiceAmount: string;

  @IsEnum(['增值税专用发票', '增值税普通发票'])
  invoiceType: '增值税专用发票' | '增值税普通发票';

  @IsString()
  remark: string;
}

export class UpdateInvoiceRecordDto implements DTO {
  @IsInt()
  id: number;
  @IsOptional()
  @IsDateString()
  invoiceTime: string;
  @IsOptional()
  @IsDecimal()
  invoiceAmount: string;
  @IsOptional()
  @IsEnum(['增值税专用发票', '增值税普通发票'])
  invoiceType: '增值税专用发票' | '增值税普通发票';
  @IsOptional()
  @IsString()
  remark: string;
}
