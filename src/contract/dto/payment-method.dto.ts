import { IsInt, IsOptional, IsString } from 'class-validator';
import { ContractPaymentMethod } from '../entities/payment-method.entity';
import { Exclude } from 'class-transformer';

type DTO = Partial<ContractPaymentMethod>;

type ConditionProcessStatus = ContractPaymentMethod['conditionProcessStatus'];

export class CreatePaymentDto implements DTO {
  @IsInt()
  contractId: number;
  @IsString()
  conditionDescription: string;
  @IsString()
  conditionProcessStatus: ConditionProcessStatus;
  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}

export class UpdatePaymentDto implements DTO {
  @IsInt()
  id: number;
  @IsString()
  conditionDescription: string;
  @IsString()
  conditionProcessStatus: ConditionProcessStatus;
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}
