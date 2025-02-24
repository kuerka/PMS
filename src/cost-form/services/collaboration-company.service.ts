import { CollaborationCompany } from '../entities/collaboration-company.entity';
import {
  CompanyDto,
  CompanyInvoiceDto,
  CompanyPaymentDto,
} from '../dto/collaboration-company.dto';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CollaborationCompanyInvoice } from '../entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '../entities/collaboration-company-payment.entity';

@Injectable()
export class CollaborationCompanyService {
  constructor(@InjectDataSource() private datasource: DataSource) {}
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
    company?: CollaborationCompany,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    if (!company) company = new CompanyDto();
    company.productionCostFormId = id;

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
    return await manager.getRepository(CollaborationCompany).delete(id);
  }

  // Company Invoice
  async getCompanyInvoiceByCompanyId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .find({ where: { companyId: id } });
  }
  async addCompanyInvoiceByCompanyId(
    id: number,
    companyInvoice?: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    if (!companyInvoice) companyInvoice = new CompanyInvoiceDto();
    companyInvoice.companyId = id;

    return await manager
      .getRepository(CollaborationCompanyInvoice)
      .insert(companyInvoice);
  }
  async updateCompanyInvoice(
    companyInvoice: CollaborationCompanyInvoice,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompanyInvoice)
      .update(companyInvoice.id, companyInvoice);
  }

  async deleteCompanyInvoice(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.getRepository(CollaborationCompanyInvoice).delete(id);
  }
  // Company Payment
  async getCompanyPaymentByCompanyId(id: number) {
    return await this.datasource.manager
      .getRepository(CollaborationCompanyInvoice)
      .find({ where: { companyId: id } });
  }
  async addCompanyPaymentByCompanyId(
    id: number,
    companyPayment?: CollaborationCompanyPayment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    if (!companyPayment) companyPayment = new CompanyPaymentDto();
    companyPayment.companyId = id;

    return await manager
      .getRepository(CollaborationCompanyPayment)
      .insert(companyPayment);
  }
  async updateCompanyPayment(
    companyPayment: CollaborationCompanyPayment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.datasource.manager;

    return await manager
      .getRepository(CollaborationCompanyPayment)
      .update(companyPayment.id, companyPayment);
  }
  async deleteCompanyPayment(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    return await manager.getRepository(CollaborationCompanyPayment).delete(id);
  }
}
