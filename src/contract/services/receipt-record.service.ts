import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractReceiptRecord } from '../entities/receipt-record.entity';
import { AccumulateService } from './contract-accumulated.service';

@Injectable()
export class ReceiptRecordService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private accumulateService: AccumulateService,
  ) {}

  create(receiptRecord: DeepPartial<ContractReceiptRecord>) {
    return this.dataSource.manager.create(ContractReceiptRecord, receiptRecord);
  }

  async addWithContractId(
    id: number,
    receiptRecord?: ContractReceiptRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!receiptRecord) receiptRecord = new ContractReceiptRecord();

    receiptRecord.contractId = id;
    await manager.transaction(async (manager) => {
      await manager.getRepository(ContractReceiptRecord).insert(receiptRecord);
      await this.accumulateService.updateAccumulateReceipt(id, manager);
    });
  }

  async getByContractId(contractId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractReceiptRecord).find({
      where: { contractId },
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
      const cId = oldReceipt.contractId;

      await repository.update(id, receiptRecord);
      await this.accumulateService.updateAccumulateReceipt(cId!, manager);
    });
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractReceiptRecord);
      const receipt = await repository.findOneBy({ id });
      if (!receipt) return;
      const cId = receipt.contractId;

      await repository.delete(id);
      await this.accumulateService.updateAccumulateReceipt(cId!, manager);
    });
  }

  async deleteByContractId(contractId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractReceiptRecord)
      .delete({ contractId });
  }
}
