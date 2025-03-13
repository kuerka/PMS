import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { CollaborationCompanyInvoice } from '../entities/collaboration-company-invoice.entity';
import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CostFormAccumulatedService } from './costForm-accumulated.service';

@Injectable()
export class CollaborationCompanyInvoiceService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private accumulatedService: CostFormAccumulatedService,
  ) {}

  // Company Invoice
  createInvoice(invoice: DeepPartial<CollaborationCompanyInvoice>) {
    return this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .create(invoice);
  }

  async getCompanyById(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .findOneBy({ id });
  }

  async getCompanyInvoiceByCompanyId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .findBy({ companyId: id });
  }

  async getCompanyByInvoiceId(id: number) {
    return await this.datasource
      .createQueryBuilder(CollaborationCompany, 'cc')
      .select()
      .leftJoin(CollaborationCompanyInvoice, 'cci', 'cci.companyId = cc.id')
      .where('cci.id = :id', { id })
      .getOne();
  }
  async addCompanyInvoiceByCompanyId(
    companyId: number,
    invoice: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getCompanyById(companyId);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      const saved = await manager.save(CollaborationCompanyInvoice, invoice);
      await this.accumulatedService.updateAccumulatedInvoice(cId!, manager);
      return saved;
    });
  }
  async updateCompanyInvoice(
    companyInvoice: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;
    const { id } = companyInvoice;

    const company = await this.getCompanyByInvoiceId(id);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.update(CollaborationCompanyInvoice, id, companyInvoice);
      await this.accumulatedService.updateAccumulatedInvoice(cId!, manager);
    });
  }

  async deleteCompanyInvoice(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getCompanyByInvoiceId(id);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.getRepository(CollaborationCompanyInvoice).delete(id);
      await this.accumulatedService.updateAccumulatedInvoice(cId!, manager);
    });
  }

  async deleteInvoiceByCompanyId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager
      .getRepository(CollaborationCompanyInvoice)
      .delete({ companyId: id });
  }
}
