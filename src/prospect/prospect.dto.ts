import { PaginationDto } from '@/pagination/pagination.dto';
import { ProspectProject } from './prospect.entity';
import { Exclude } from 'class-transformer';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

type Dto = Partial<ProspectProject>;
type ProjectDockingStage = ProspectProject['projectDockingStage'];
export type FullDto = ProspectProject;

export class createProspectDto implements Dto {
  @IsString()
  projectName: string;
  @IsString()
  estimatedContractAmount: string | null;
  @IsString()
  businessPersonnel: string;
  @IsString()
  leadingBusinessDepartment: string | null;
  @IsString()
  assistingBusinessDepartment: string | null;
  @IsString()
  projectDockingStage: ProjectDockingStage;
  @IsString()
  remark: string | null;
  @IsBoolean()
  isPriorWorkStarted: boolean;

  @IsOptional()
  @Exclude()
  createdAt: Date | null;
  @IsOptional()
  @Exclude()
  updatedAt: Date | null;
}

export class prospectDto extends ProspectProject {
  @Exclude()
  id: number;
  @Exclude()
  updatedAt: Date = new Date();
}

export class ProspectQueryDto implements PaginationDto {
  page: number = 1;
  limit: number = 10;
  query: {
    name: string;
  };
}

export class ProspectUpdateDto extends ProspectProject {
  @Exclude()
  createdAt: Date | null;
  @Exclude()
  updatedAt: Date | null = new Date();
  @Exclude()
  productionCostForm: ProductionCostForm;
}
