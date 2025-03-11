import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { CollaborationCompanyPayment } from '../entities/collaboration-company-payment.entity';
import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { CostFormAccumulatedService } from './costForm-accumulated.service';

@Injectable()
export class CollaborationCompanyPaymentService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private accumulatedService: CostFormAccumulatedService,
  ) {}

  async getCompanyById(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .findOneBy({ id });
  }

  createPayment(payment: DeepPartial<CollaborationCompanyPayment>) {
    return this.datasource.manager
      .getRepository(CollaborationCompanyPayment)
      .create(payment);
  }
  async getCompanyPaymentByCompanyId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompanyPayment)
      .find({ where: { companyId: id } });
  }
  async getCompanyByPaymentId(id: number) {
    return await this.datasource
      .createQueryBuilder(CollaborationCompany, 'cc')
      .select()
      .leftJoin(CollaborationCompanyPayment, 'cp', 'cp.companyId = cc.id')
      .where('cp.id = :id', { id })
      .getOne();
  }
  async addCompanyPaymentByCompanyId(
    companyId: number,
    companyPayment: CollaborationCompanyPayment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getCompanyById(companyId);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.insert(CollaborationCompanyPayment, companyPayment);
      await this.accumulatedService.updateAccumulatedReceipt(cId!, manager);
    });
  }
  async updateCompanyPayment(
    companyPayment: CollaborationCompanyPayment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;
    const { id } = companyPayment;
    const company = await this.getCompanyByPaymentId(id);
    if (!company) return;
    const cId = company.productionCostFormId;
    return await manager.transaction(async (manager) => {
      await manager.update(CollaborationCompanyPayment, id, companyPayment);
      await this.accumulatedService.updateAccumulatedReceipt(cId!, manager);
    });
  }
  async deleteCompanyPayment(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getCompanyByPaymentId(id);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.getRepository(CollaborationCompanyPayment).delete(id);
      await this.accumulatedService.updateAccumulatedReceipt(cId!, manager);
    });
  }

  async deletePaymentByCompanyId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager
      .getRepository(CollaborationCompanyPayment)
      .delete({ companyId: id });
  }
}
