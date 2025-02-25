import { Exclude } from 'class-transformer';
import { ProductionCostForm } from '../entities/cost-form.entity';
import { ProspectProject } from '@/prospect/prospect.entity';
import { IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  @Exclude()
  createdAt: Date = new Date();
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
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
  @IsOptional()
  @Exclude()
  updatedAt: Date = new Date();
}

export class CostFormDto extends ProductionCostForm {
  @Exclude()
  id: number;
  @Exclude()
  createdAt: Date = new Date();
  @Exclude()
  updatedAt: Date = new Date();
}

export class CostFormUpdateDto extends ProductionCostForm {
  @Exclude()
  createdAt: Date | null;
  @Exclude()
  updatedAt: Date | null = new Date();
  @Exclude()
  prospectProjectId: number | null;
  @Exclude()
  prospectProject: ProspectProject;
}
