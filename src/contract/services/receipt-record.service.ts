import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractReceiptRecord } from '../entities/receipt-record.entity';
import { PerformanceService } from './performance.service';
import Decimal from 'decimal.js';

@Injectable()
export class ReceiptRecordService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(forwardRef(() => PerformanceService))
    private performanceService: PerformanceService,
  ) {}

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
    await manager.transaction(async (manager) => {
      await manager.getRepository(ContractReceiptRecord).insert(receiptRecord);
      const amount = receiptRecord.receiptAmount;
      await this.performanceService.incrementReceipt(id, amount!, manager);
    });
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
    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractReceiptRecord);
      const oldReceipt = await repository.findOneBy({ id });
      if (!oldReceipt) return;

      const pId = oldReceipt.contractPerformanceId;
      const newAmount = Decimal(receiptRecord.receiptAmount!);
      const oldAmount = Decimal(oldReceipt.receiptAmount!);
      const delta = newAmount.sub(oldAmount).toString();

      await repository.update(id, receiptRecord);
      await this.performanceService.incrementReceipt(pId!, delta, manager);
    });
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractReceiptRecord);
      const receipt = await repository.findOneBy({ id });
      if (!receipt) return;

      const pId = receipt.contractPerformanceId;
      const amount = receipt.receiptAmount;
      await repository.delete(id);
      await this.performanceService.decrementReceipt(pId!, amount!, manager);
    });
  }

  async deleteByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractReceiptRecord)
      .delete({ contractPerformanceId: id });
  }
}
