import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CollaborationCompanyInvoice } from '../entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '../entities/collaboration-company-payment.entity';
import { CostFormService } from '../cost-form.service';

@Injectable()
export class CollaborationCompanyService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    @Inject(forwardRef(() => CostFormService))
    private costFormService: CostFormService,
  ) {}

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
  // Company
  async getCompanyByCostForm(costFormId: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .findOneBy({ productionCostFormId: costFormId });
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

    return await manager.getRepository(CollaborationCompany).insert(company);
  }

  async updateCompany(company: CollaborationCompany, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompany)
      .update(company.id, company);
  }

  async deleteCompany(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.transaction(async (manager) => {
      await this.deleteInvoiceByCompanyId(id, manager);
      await this.deletePaymentByCompanyId(id, manager);
      await manager.delete(CollaborationCompany, id);
    });
  }

  async deleteByCostFormId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.transaction(async (manager) => {
      const companies = await this.getCompanyByCostFormId(id);
      for (const company of companies) {
        await this.deleteInvoiceByCompanyId(company.id, manager);
        await this.deletePaymentByCompanyId(company.id, manager);
      }
      await manager.delete(CollaborationCompany, { productionCostFormId: id });
    });
  }

  async getById(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompany)
      .findOneBy({ id });
  }

  // Company Invoice
  createInvoice(invoice: DeepPartial<CollaborationCompanyInvoice>) {
    return this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .create(invoice);
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
    companyInvoice: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getById(companyId);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.insert(CollaborationCompanyInvoice, companyInvoice);
      await this.costFormService.updateAccumulatedInvoice(cId!, manager);
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
      await this.costFormService.updateAccumulatedInvoice(cId!, manager);
    });
  }

  async deleteCompanyInvoice(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getCompanyByInvoiceId(id);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.getRepository(CollaborationCompanyInvoice).delete(id);
      await this.costFormService.updateAccumulatedInvoice(cId!, manager);
    });
  }

  async deleteInvoiceByCompanyId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager
      .getRepository(CollaborationCompanyInvoice)
      .delete({ companyId: id });
  }
  // Company Payment
  createPayment(payment: DeepPartial<CollaborationCompanyPayment>) {
    return this.datasource.manager
      .getRepository(CollaborationCompanyPayment)
      .create(payment);
  }
  async getCompanyPaymentByCompanyId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
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

    const company = await this.getById(companyId);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.insert(CollaborationCompanyPayment, companyPayment);
      await this.costFormService.updateAccumulatedReceipt(cId!, manager);
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
      await this.costFormService.updateAccumulatedReceipt(cId!, manager);
    });
  }
  async deleteCompanyPayment(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    const company = await this.getCompanyByPaymentId(id);
    if (!company) return;
    const cId = company.productionCostFormId;

    return await manager.transaction(async (manager) => {
      await manager.getRepository(CollaborationCompanyPayment).delete(id);
      await this.costFormService.updateAccumulatedReceipt(cId!, manager);
    });
  }

  async deletePaymentByCompanyId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager
      .getRepository(CollaborationCompanyPayment)
      .delete({ companyId: id });
  }
}
