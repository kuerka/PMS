import { IsInt, IsString } from 'class-validator';
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
