import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { InvoiceHeader } from '../entities/invoice-header.entity';

@Injectable()
export class InvoiceHeaderService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  create(invoiceHeader: DeepPartial<InvoiceHeader>) {
    return this.dataSource.manager.create(InvoiceHeader, invoiceHeader);
  }

  async addWithPerformanceId(
    id: number,
    invoiceHeader?: InvoiceHeader,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!invoiceHeader) invoiceHeader = new InvoiceHeader();

    invoiceHeader.contractPerformanceId = id;
    return await manager.getRepository(InvoiceHeader).insert(invoiceHeader);
  }

  async getByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(InvoiceHeader).find({
      where: { contractPerformanceId: id },
    });
  }

  async update(
    id: number,
    invoiceHeader: InvoiceHeader,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(InvoiceHeader).update(id, invoiceHeader);
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(InvoiceHeader).delete(id);
  }
}
