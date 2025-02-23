import { PaginationDto } from '@/pagination/pagination.dto';
import { ProspectProject } from './prospect.entity';
import { Exclude } from 'class-transformer';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';

export class prospectDto extends ProspectProject {
  @Exclude()
  id: number;
  @Exclude()
  updatedAt: Date = new Date();
}

export class ProspectQueryDto extends PaginationDto {
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
