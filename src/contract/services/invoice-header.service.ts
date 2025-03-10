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

  async addWithContractId(
    id: number,
    invoiceHeader: InvoiceHeader,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    invoiceHeader.contractId = id;
    return await manager.getRepository(InvoiceHeader).insert(invoiceHeader);
  }

  async getByContractId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(InvoiceHeader)
      .findOneBy({ contractId: id });
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

  async deleteByContractId(contractId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    await manager.getRepository(InvoiceHeader).delete({ contractId });
  }
}
