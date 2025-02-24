import { Exclude } from 'class-transformer';
import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { ProductionCostForm } from '../entities/cost-form.entity';

export class CompanyDto extends CollaborationCompany {
  @Exclude()
  id: number;
  @Exclude()
  createdAt: Date = new Date();
  @Exclude()
  updatedAt: Date = new Date();
}

export class CompanyUpdateDto extends CollaborationCompany {
  @Exclude()
  productionCostFormId: number | null;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date = new Date();
  @Exclude()
  productionCostForm: ProductionCostForm;
}
