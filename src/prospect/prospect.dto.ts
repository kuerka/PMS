import { PaginationDto } from '@/pagination/pagination.dto';
import { ProspectProject } from './prospect.entity';
import { Exclude, Type } from 'class-transformer';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  createCostFormDto,
  updateCostFormDto,
} from '@/cost-form/dto/cost-form.dto';

type DTO = Partial<ProspectProject>;
type ProjectDockingStage = ProspectProject['projectDockingStage'];
export type FullDto = ProspectProject;

export class createProspectDto implements DTO {
  @IsString()
  projectName: string;
  @IsString()
  estimatedContractAmount: string | null;
  @IsString()
  businessPersonnel: string;
  @IsString()
  leadingBusinessDepartment: string | null;
  @IsArray()
  assistingBusinessDepartment: object | null;
  @IsString()
  projectDockingStage: ProjectDockingStage;
  @IsString()
  remark: string | null;
  @IsBoolean()
  isPriorWorkStarted: boolean;

  // @IsOptional()
  // @Exclude()
  // createdAt: Date = new Date();
  // @IsOptional()
  // @Exclude()
  // updatedAt: Date = new Date();

  @IsOptional()
  @ValidateNested()
  @Type(() => createCostFormDto)
  productionCostForm: ProductionCostForm;
}

export class UpdateProspectDto implements DTO {
  @IsInt()
  id: number;
  @IsString()
  projectName: string;
  estimatedContractAmount: string | null;
  @IsString()
  businessPersonnel: string;
  @IsString()
  leadingBusinessDepartment: string | null;
  @IsArray()
  assistingBusinessDepartment: object | null;
  @IsBoolean()
  isPriorWorkStarted: boolean | null;
  @IsString()
  projectDockingStage: ProjectDockingStage;
  @IsString()
  remark: string | null;
  // @IsOptional()
  // @Exclude()
  // updatedAt: Date = new Date();
  @IsOptional()
  @ValidateNested()
  @Type(() => updateCostFormDto)
  productionCostForm: ProductionCostForm;
}

export class prospectDto extends ProspectProject {
  @Exclude()
  id: number;
  @Exclude()
  updatedAt: Date = new Date();
}

class ProspectQuery implements DTO {
  @IsOptional()
  @IsInt()
  id?: number | undefined;
  @IsOptional()
  @IsString()
  projectName?: string | undefined;
  @IsOptional()
  @IsString()
  businessPersonnel?: string | undefined;
  @IsOptional()
  @IsString()
  leadingBusinessDepartment?: string | undefined;
  @IsOptional()
  @IsArray()
  assistingBusinessDepartment?: object | undefined;
  @IsOptional()
  @IsBoolean()
  isPriorWorkStarted?: boolean | undefined;
  @IsOptional()
  @IsString()
  projectDockingStage?: ProjectDockingStage | undefined;
  @IsOptional()
  @IsString()
  estimatedContractAmount?: string | undefined;
  @IsOptional()
  @IsString()
  remark?: string | undefined;
  @IsOptional()
  @IsDateString()
  createdAt?: Date | undefined;
  @IsOptional()
  @IsDateString()
  updatedAt?: Date | undefined;
}

export class ProspectQueryDto implements PaginationDto {
  @IsOptional()
  @IsInt()
  page: number = 1;
  @IsOptional()
  @IsInt()
  limit: number = 10;
  @IsOptional()
  @ValidateNested()
  @Type(() => ProspectQuery)
  query: ProspectQuery;
}

export class ProspectUpdateDto extends ProspectProject {
  @Exclude()
  createdAt: Date | null;
  @Exclude()
  updatedAt: Date | null = new Date();
  @Exclude()
  productionCostForm: ProductionCostForm;
}
