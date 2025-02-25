import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ContractReceiptRecord } from '../entities/receipt-record.entity';

@Injectable()
export class ReceiptRecordService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async addReceiptRecordWithPerformanceId(
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

  async getReceiptRecordByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractReceiptRecord).find({
      where: { contractPerformanceId: id },
    });
  }

  async updateReceiptRecord(
    id: number,
    receiptRecord: ContractReceiptRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractReceiptRecord)
      .update(id, receiptRecord);
  }

  async deleteReceiptRecord(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractReceiptRecord).delete(id);
  }
}
