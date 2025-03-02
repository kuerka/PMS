import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CollaborationCompanyInvoice } from '../entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '../entities/collaboration-company-payment.entity';

@Injectable()
export class CollaborationCompanyService {
  constructor(@InjectDataSource() private datasource: DataSource) {}

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

    return await manager.getRepository(CollaborationCompany).save(company);
  }

  async updateCompany(company: CollaborationCompany, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;

    return await manager.getRepository(CollaborationCompany).save(company);
  }

  async deleteCompany(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.getRepository(CollaborationCompany).delete(id);
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

  // Company Invoice
  createInvoice(invoice: DeepPartial<CollaborationCompanyInvoice>) {
    return this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .create(invoice);
  }

  async getCompanyInvoiceByCompanyId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .find({ where: { companyId: id } });
  }
  async addCompanyInvoiceByCompanyId(
    id: number,
    companyInvoice: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompanyInvoice)
      .save(companyInvoice);
  }
  async updateCompanyInvoice(
    companyInvoice: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompanyInvoice)
      .save(companyInvoice);
  }

  async deleteCompanyInvoice(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.getRepository(CollaborationCompanyInvoice).delete(id);
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
  async addCompanyPaymentByCompanyId(
    id: number,
    companyPayment: CollaborationCompanyPayment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompanyPayment)
      .save(companyPayment);
  }
  async updateCompanyPayment(
    companyPayment: CollaborationCompanyPayment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompanyPayment)
      .save(companyPayment);
  }
  async deleteCompanyPayment(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.getRepository(CollaborationCompanyPayment).delete(id);
  }

  async deletePaymentByCompanyId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager
      .getRepository(CollaborationCompanyPayment)
      .delete({ companyId: id });
  }
}
