import { IsDecimal, IsInt, IsOptional, IsDateString } from 'class-validator';
import { CollaborationCompanyPayment } from '../entities/collaboration-company-payment.entity';

type DTO = Partial<CollaborationCompanyPayment>;

export class CreatePaymentDto implements DTO {
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsDecimal()
  paymentAmount?: string;

  @IsOptional()
  @IsDateString()
  paymentTime?: string;
}

export class UpdatePaymentDto implements DTO {
  @IsInt()
  id: number;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsDecimal()
  paymentAmount?: string;

  @IsOptional()
  @IsDateString()
  paymentTime?: string;
}
