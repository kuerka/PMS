import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';
import { ContractPaymentMethod } from '../entities/payment-method.entity';

type DTO = Partial<ContractPaymentMethod>;

export class CreatePaymentDto implements DTO {
  @IsInt()
  contractId: number;
  @IsString()
  conditionDescription: string;
  @IsDecimal()
  accounts: string;
}

export class UpdatePaymentDto implements DTO {
  @IsInt()
  id: number;
  @IsOptional()
  @IsString()
  conditionDescription: string;
  @IsOptional()
  @IsDecimal()
  accounts: string;
}
