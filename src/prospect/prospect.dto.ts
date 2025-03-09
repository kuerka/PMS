import { PaginationDto, SortDTO } from '@/pagination/pagination.dto';
import { ProspectProject } from './prospect.entity';
import { Exclude, Type } from 'class-transformer';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
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
  @IsDecimal()
  estimatedContractAmount: string;
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

class ProspectQuery {
  @IsOptional()
  @IsArray()
  searchValues: string[];
  @IsOptional()
  @IsString()
  projectDockingStage?: ProjectDockingStage | undefined;
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
  @IsArray()
  estimatedContractAmount: number[];
  @IsOptional()
  @IsArray()
  createdAt?: Date[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pageParams: PaginationDto;
  @IsOptional()
  @ValidateNested()
  @Type(() => SortDTO)
  sort: SortDTO;
}

export class ProspectQueryDto extends ProspectQuery {}
