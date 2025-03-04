import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractInvoiceRecord } from '../entities/invoice-record.entity';
import { PerformanceService } from './performance.service';
import Decimal from 'decimal.js';

@Injectable()
export class InvoiceRecordService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(forwardRef(() => PerformanceService))
    private performanceService: PerformanceService,
  ) {}

  create(invoiceRecord: DeepPartial<ContractInvoiceRecord>) {
    return this.dataSource.manager.create(ContractInvoiceRecord, invoiceRecord);
  }

  async addWithPerformanceId(
    id: number,
    invoiceRecord?: ContractInvoiceRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!invoiceRecord) invoiceRecord = new ContractInvoiceRecord();

    invoiceRecord.contractPerformanceId = id;
    await manager.transaction(async (manager) => {
      await manager.getRepository(ContractInvoiceRecord).insert(invoiceRecord);
      const amount = invoiceRecord.invoiceAmount!;
      await this.performanceService.incrementInvoice(id, amount, manager);
    });
  }

  async getByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractInvoiceRecord).find({
      where: { contractPerformanceId: id },
    });
  }

  async update(
    id: number,
    invoiceRecord: ContractInvoiceRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractInvoiceRecord);
      const oldInvoiceRecord = await repository.findOne({ where: { id } });
      if (!oldInvoiceRecord) return;

      const pId = oldInvoiceRecord.contractPerformanceId;
      const newAmount = Decimal(invoiceRecord.invoiceAmount!);
      const oldAmount = Decimal(oldInvoiceRecord.invoiceAmount!);
      const delta = newAmount.sub(oldAmount).toString();

      await repository.update(id, invoiceRecord);
      await this.performanceService.incrementInvoice(pId!, delta, manager);
    });
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractInvoiceRecord);
      const oldInvoiceRecord = await repository.findOne({ where: { id } });
      if (!oldInvoiceRecord) return;
      const pid = oldInvoiceRecord.contractPerformanceId;
      const amount = oldInvoiceRecord.invoiceAmount;

      await repository.delete(id);
      await this.performanceService.decrementInvoice(pid!, amount!, manager);
    });
  }

  async deleteByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractInvoiceRecord)
      .delete({ contractPerformanceId: id });
  }
}
