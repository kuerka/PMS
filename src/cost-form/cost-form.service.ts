import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductionCostForm } from './entities/cost-form.entity';
import { plainToClass } from 'class-transformer';
import { CostFormDto, CostFormUpdateDto } from './dto/cost-form.dto';
import { CollaborationCompany } from './entities/collaboration-company.entity';
import { CompanyDto } from './dto/collaboration-company.dto';

@Injectable()
export class CostFormService {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async create(costForm?: ProductionCostForm) {
    if (!costForm) costForm = new CostFormDto();

    return await this.datasource.manager
      .getRepository(ProductionCostForm)
      .save(costForm);
  }

  async update(costForm: ProductionCostForm) {
    return await this.datasource
      .getRepository(ProductionCostForm)
      .save(costForm);
  }

  async updateWithProspect(costForm: ProductionCostForm, prospectId: number) {
    console.log('update with prospect');
    costForm = plainToClass(CostFormUpdateDto, costForm);
    costForm.prospectProjectId = prospectId;
    return await this.update(costForm);
  }

  async appendCollaborationCompany(company?: CollaborationCompany) {
    if (!company) company = new CompanyDto();

    return await this.datasource
      .getRepository(CollaborationCompany)
      .save(company);
  }

  async updateCollaborationCompany(company: CollaborationCompany) {
    return await this.datasource
      .getRepository(CollaborationCompany)
      .update(company.id, company);
  }

  async delete(id: number) {
    return await this.datasource.manager.delete(ProductionCostForm, id);
  }
}
