import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ProductionCostForm } from './entities/cost-form.entity';
import { plainToClass } from 'class-transformer';
import { CostFormDto, CostFormUpdateDto } from './dto/cost-form.dto';

@Injectable()
export class CostFormService {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  async create(manager: EntityManager, costForm?: ProductionCostForm) {
    if (!costForm) costForm = new CostFormDto();

    return await manager.getRepository(ProductionCostForm).save(costForm);
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

  async delete(id: number) {
    return await this.datasource.manager.delete(ProductionCostForm, id);
  }
}
