import { IsInt, IsOptional, IsString } from 'class-validator';
import { InvoiceHeader } from '../entities/invoice-header.entity';
import { Exclude } from 'class-transformer';

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
  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}

export class UpdateInvoiceHeaderDto implements DTO {
  @IsInt()
  id: number;
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
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}
