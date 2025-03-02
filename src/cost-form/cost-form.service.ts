import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ProductionCostForm } from './entities/cost-form.entity';
import { CollaborationDepartmentService } from './services/collaboration-department.service';
import { CollaborationCompanyService } from './services/collaboration-company.service';

@Injectable()
export class CostFormService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private departmentService: CollaborationDepartmentService,
    private companyService: CollaborationCompanyService,
  ) {}

  create(costForm: DeepPartial<ProductionCostForm>) {
    return this.datasource.manager.create(ProductionCostForm, costForm);
  }

  async add(costForm: ProductionCostForm, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.getRepository(ProductionCostForm).save(costForm);
  }

  async findByProspectId(prospectProjectId: number) {
    return await this.datasource
      .getRepository(ProductionCostForm)
      .findOneBy({ prospectProjectId });
  }

  async update(costForm: ProductionCostForm, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await this.datasource
      .getRepository(ProductionCostForm)
      .save(costForm);
  }

  async updateByContractId(
    id: number,
    costForm: ProductionCostForm,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;
    return await manager
      .getRepository(ProductionCostForm)
      .update({ contractId: id }, costForm);
  }

  async updateWithProspect(costForm: ProductionCostForm, prospectId: number) {
    costForm.prospectProjectId = prospectId;
    return await this.update(costForm);
  }

  async delete(id: number) {
    return await this.datasource.manager.delete(ProductionCostForm, id);
  }

  async deleteByProspectId(prospectProjectId: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    await manager.transaction(async (manager) => {
      await this.departmentService.deleteByCostFormId(
        prospectProjectId,
        manager,
      );
      await this.companyService.deleteByCostFormId(prospectProjectId, manager);
      await manager.delete(ProductionCostForm, { prospectProjectId });
    });
  }
}
