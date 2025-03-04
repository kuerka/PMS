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
    invoiceHeader: InvoiceHeader,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    invoiceHeader.contractPerformanceId = id;
    return await manager.getRepository(InvoiceHeader).insert(invoiceHeader);
  }

  async getByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(InvoiceHeader)
      .findOneBy({ contractPerformanceId: id });
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

  async deleteByPerformanceId(performanceId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    await manager
      .getRepository(InvoiceHeader)
      .delete({ contractPerformanceId: performanceId });
  }
}
