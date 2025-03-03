import { IsInt, IsString, IsOptional } from 'class-validator';
import { InvoiceHeader } from '../entities/invoice-header.entity';

type DTO = Partial<InvoiceHeader>;

export class CreateInvoiceHeaderDto implements DTO {
  @IsInt()
  contractPerformanceId: number;
  @IsString()
  companyName: string;
  @IsString()
  contactPhone: string;
  @IsString()
  taxpayerIdentificationNumber: string;
  @IsString()
  bankAccount: string;
  @IsString()
  bankName: string;
  @IsString()
  address: string;
}

export class UpdateInvoiceHeaderDto implements DTO {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  taxpayerIdentificationNumber?: string;

  @IsString()
  @IsOptional()
  bankAccount?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
