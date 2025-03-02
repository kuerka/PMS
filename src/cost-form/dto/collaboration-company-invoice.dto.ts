import { IsDecimal, IsInt, IsOptional, IsDateString } from 'class-validator';
import { CollaborationCompanyInvoice } from '../entities/collaboration-company-invoice.entity';

type DTO = Partial<CollaborationCompanyInvoice>;

export class CreateInvoiceDto implements DTO {
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsDecimal()
  invoiceAmount?: string;

  @IsOptional()
  @IsDateString()
  invoiceTime?: string;
}

export class UpdateInvoiceDto implements DTO {
  @IsInt()
  id: number;

  @IsOptional()
  @IsDecimal()
  invoiceAmount?: string;

  @IsOptional()
  @IsDateString()
  invoiceTime?: string;
}
