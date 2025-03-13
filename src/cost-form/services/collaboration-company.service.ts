import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CollaborationCompanyInvoiceService } from './collaboration-company-invoice.service';
import { CollaborationCompanyPaymentService } from './collaboration-company-payment.service';
import { CostFormAccumulatedService } from './costForm-accumulated.service';

@Injectable()
export class CollaborationCompanyService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private invoiceService: CollaborationCompanyInvoiceService,
    private paymentService: CollaborationCompanyPaymentService,
    private accumulatedService: CostFormAccumulatedService,
  ) {}

  // Company
  createCompany(company: DeepPartial<CollaborationCompany>) {
    return this.datasource.manager
      .getRepository(CollaborationCompany)
      .create(company);
  }
  async getCompanyByCostFormId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .find({ where: { productionCostFormId: id } });
  }

  async getCompanyDetail(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .findOne({
        where: { id },
        relations: {
          collaborationCompanyInvoices: true,
          collaborationCompanyPayments: true,
        },
      });
  }

  async addCompanyByCostFormId(
    id: number,
    company: CollaborationCompany,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager.getRepository(CollaborationCompany).save(company);
  }

  async updateCompany(company: CollaborationCompany, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    await manager
      .getRepository(CollaborationCompany)
      .update(company.id, company);
  }

  async deleteCompany(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    const company = await manager
      .getRepository(CollaborationCompany)
      .findOneBy({ id });
    if (!company) return;
    const costId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await Promise.all([
        this.invoiceService.deleteInvoiceByCompanyId(id, manager),
        this.paymentService.deletePaymentByCompanyId(id, manager),
      ]);
      await manager.delete(CollaborationCompany, id);
      await Promise.all([
        this.accumulatedService.updateAccumulatedInvoice(costId!, manager),
        this.accumulatedService.updateAccumulatedReceipt(costId!, manager),
      ]);
    });
  }

  async deleteByCostFormId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.transaction(async (manager) => {
      const companies = await this.getCompanyByCostFormId(id);
      for (const company of companies) {
        await this.invoiceService.deleteInvoiceByCompanyId(company.id, manager);
        await this.paymentService.deletePaymentByCompanyId(company.id, manager);
      }
      await manager.delete(CollaborationCompany, { productionCostFormId: id });
    });
  }

  async getById(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .findOneBy({ id });
  }
}
