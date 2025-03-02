import { IsInt, IsString } from 'class-validator';
import { ContractPaymentMethod } from '../entities/payment-method.entity';

type DTO = Partial<ContractPaymentMethod>;

type ConditionProcessStatus = ContractPaymentMethod['conditionProcessStatus'];

export class CreatePaymentDto implements DTO {
  @IsInt()
  contractId: number;
  @IsString()
  conditionDescription: string;
  @IsString()
  conditionProcessStatus: ConditionProcessStatus;
}

export class UpdatePaymentDto implements DTO {
  @IsInt()
  id: number;
  @IsString()
  conditionDescription: string;
  @IsString()
  conditionProcessStatus: ConditionProcessStatus;
}
