import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';
import { CollaborationDepartment } from '../entities/collaboration-department.entity';

type DTO = Partial<CollaborationDepartment>;

export class CreateCollaborationDepartmentDto implements DTO {
  @IsInt()
  productionCostFormId: number;

  @IsString()
  departmentName: string;

  @IsOptional()
  @IsDecimal()
  budgetAmount?: string;

  @IsOptional()
  @IsDecimal()
  budgetExecutionAmount?: string;

  @IsOptional()
  @IsDecimal()
  settlementAmount?: string;
}

export class UpdateCollaborationDepartmentDto implements DTO {
  @IsInt()
  id: number;

  @IsString()
  departmentName: string;

  @IsOptional()
  @IsDecimal()
  budgetAmount?: string;

  @IsOptional()
  @IsDecimal()
  budgetExecutionAmount?: string;

  @IsOptional()
  @IsDecimal()
  settlementAmount?: string;
}
