import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ContractInvoiceRecord } from '../entities/invoice-record.entity';

@Injectable()
export class InvoiceRecordService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async addInvoiceRecordWithPerformanceId(
    id: number,
    invoiceRecord?: ContractInvoiceRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!invoiceRecord) invoiceRecord = new ContractInvoiceRecord();

    invoiceRecord.contractPerformanceId = id;
    return await manager
      .getRepository(ContractInvoiceRecord)
      .insert(invoiceRecord);
  }

  async getInvoiceRecordByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractInvoiceRecord).find({
      where: { contractPerformanceId: id },
    });
  }

  async updateInvoiceRecord(
    id: number,
    invoiceRecord: ContractInvoiceRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractInvoiceRecord)
      .update(id, invoiceRecord);
  }

  async deleteInvoiceRecord(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractInvoiceRecord).delete(id);
  }
}
