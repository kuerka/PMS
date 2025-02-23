import { Exclude } from 'class-transformer';
import { ProductionCostForm } from '../entities/cost-form.entity';
import { ProspectProject } from '@/prospect/prospect.entity';

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
