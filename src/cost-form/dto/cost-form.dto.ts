import { ProductionCostForm } from '../entities/cost-form.entity';
import { IsDecimal, IsInt, IsString } from 'class-validator';

type DTO = Partial<ProductionCostForm>;

export class createCostFormDto implements DTO {
  @IsString()
  leadingDepartment: string;
  @IsDecimal()
  projectCompletionProgress: string;
  @IsString()
  projectCompletionDescription: string;
  @IsDecimal()
  totalBudgetAmount: string;
  @IsDecimal()
  totalSettlementAmount: string;
  @IsString()
  remark: string;
}

export class updateCostFormDto implements DTO {
  @IsString()
  leadingDepartment: string;
  @IsDecimal()
  projectCompletionProgress: string;
  @IsString()
  projectCompletionDescription: string;
  @IsDecimal()
  totalBudgetAmount: string;
  @IsDecimal()
  totalSettlementAmount: string;
  @IsString()
  remark: string;
}

export class updateCostProgressDto implements DTO {
  @IsInt()
  id: number;
  @IsDecimal()
  projectCompletionProgress: string;
  @IsString()
  projectCompletionDescription: string;
}
