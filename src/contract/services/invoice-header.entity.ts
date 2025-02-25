import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { InvoiceHeader } from '../entities/invoice-header.entity';

@Injectable()
export class InvoiceHeaderService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async addInvoiceHeaderWithPerformanceId(
    id: number,
    invoiceHeader?: InvoiceHeader,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!invoiceHeader) invoiceHeader = new InvoiceHeader();

    invoiceHeader.contractPerformanceId = id;
    return await manager.getRepository(InvoiceHeader).insert(invoiceHeader);
  }

  async getInvoiceHeaderByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(InvoiceHeader).find({
      where: { contractPerformanceId: id },
    });
  }

  async updateInvoiceHeader(
    id: number,
    invoiceHeader: InvoiceHeader,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(InvoiceHeader).update(id, invoiceHeader);
  }

  async deleteInvoiceHeader(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(InvoiceHeader).delete(id);
  }
}
