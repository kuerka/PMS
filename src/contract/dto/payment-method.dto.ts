import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContractPaymentMethod } from '../entities/payment-method.entity';

type DTO = Partial<ContractPaymentMethod>;

export class CreatePaymentDto implements DTO {
  @IsInt()
  contractId: number;
  @IsString()
  conditionDescription: string;
  @IsBoolean()
  conditionProcessStatus: boolean;
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
  @IsBoolean()
  conditionProcessStatus: boolean;
  @IsOptional()
  @IsDecimal()
  accounts: string;
}
