import { ProductionCostForm } from '../entities/cost-form.entity';
import { IsString } from 'class-validator';

type DTO = Partial<ProductionCostForm>;

export class createCostFormDto implements DTO {
  @IsString()
  leadingDepartment: string;
  @IsString()
  projectCompletionProgress: string;
  @IsString()
  projectCompletionDescription: string;
  @IsString()
  totalBudgetAmount: string;
  @IsString()
  totalBudgetExecutionAmount: string;
  @IsString()
  totalSettlementAmount: string;
  @IsString()
  remark: string;
}

export class updateCostFormDto implements DTO {
  @IsString()
  leadingDepartment: string;
  @IsString()
  projectCompletionProgress: string;
  @IsString()
  projectCompletionDescription: string;
  @IsString()
  totalBudgetAmount: string;
  @IsString()
  totalBudgetExecutionAmount: string;
  @IsString()
  totalSettlementAmount: string;
  @IsString()
  remark: string;
}
