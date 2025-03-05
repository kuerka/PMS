import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractPerformance } from '../entities/performance.entity';
import { InvoiceHeaderService } from './invoice-header.service';
import { InvoiceRecordService } from './invoice-record.service';
import { ReceiptRecordService } from './receipt-record.service';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private invoiceHeaderService: InvoiceHeaderService,
    private invoiceRecordService: InvoiceRecordService,
    private receiptService: ReceiptRecordService,
  ) {}

  create(performance?: DeepPartial<ContractPerformance>) {
    return this.dataSource.manager.create(ContractPerformance, performance);
  }

  async addWithContractId(
    id: number,
    performance: ContractPerformance,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    performance.contractId = id;
    return await manager.getRepository(ContractPerformance).insert(performance);
  }

  async getSingleByContractId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager
      .getRepository(ContractPerformance)
      .findOne({ where: { contractId: id } });
  }
  async getByContractId(contractId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractPerformance).findOne({
      where: { contractId },
      relations: {
        invoiceHeader: true,
        contractReceiptRecords: true,
        contractInvoiceRecords: true,
      },
    });
  }

  async updateById(
    id: number,
    performance: ContractPerformance,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractPerformance)
      .update({ id }, performance);
  }

  async deleteByContractId(contractId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    await manager.transaction(async (manager) => {
      const performance = await this.getSingleByContractId(contractId, manager);
      if (!performance) return;
      const { id } = performance;

      const header = this.invoiceHeaderService.deleteByPerformanceId(
        id,
        manager,
      );
      const record = this.invoiceRecordService.deleteByPerformanceId(
        id,
        manager,
      );
      const receipt = this.receiptService.deleteByPerformanceId(id, manager);
      await Promise.all([header, record, receipt]);

      await manager.getRepository(ContractPerformance).delete({ contractId });
    });
  }
}
