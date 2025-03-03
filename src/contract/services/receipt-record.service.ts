import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractReceiptRecord } from '../entities/receipt-record.entity';

@Injectable()
export class ReceiptRecordService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  create(receiptRecord: DeepPartial<ContractReceiptRecord>) {
    return this.dataSource.manager.create(ContractReceiptRecord, receiptRecord);
  }

  async addWithPerformanceId(
    id: number,
    receiptRecord?: ContractReceiptRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!receiptRecord) receiptRecord = new ContractReceiptRecord();

    receiptRecord.contractPerformanceId = id;
    return await manager
      .getRepository(ContractReceiptRecord)
      .insert(receiptRecord);
  }

  async getByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractReceiptRecord).find({
      where: { contractPerformanceId: id },
    });
  }

  async update(
    id: number,
    receiptRecord: ContractReceiptRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractReceiptRecord)
      .update(id, receiptRecord);
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractReceiptRecord).delete(id);
  }

  async deleteByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractReceiptRecord)
      .delete({ contractPerformanceId: id });
  }
}
