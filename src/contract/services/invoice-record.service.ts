import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractInvoiceRecord } from '../entities/invoice-record.entity';
import { PerformanceService } from './performance.service';

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
      await this.performanceService.updateAccumulateInvoice(id, manager);
    });
  }

  async getByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractInvoiceRecord)
      .findBy({ contractPerformanceId: id });
  }

  async update(
    id: number,
    invoiceRecord: ContractInvoiceRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractInvoiceRecord);
      const oldInvoiceRecord = await repository.findOneBy({ id });
      if (!oldInvoiceRecord) return;

      const pId = oldInvoiceRecord.contractPerformanceId;

      await repository.update(id, invoiceRecord);
      await this.performanceService.updateAccumulateInvoice(pId!, manager);
    });
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractInvoiceRecord);
      const oldInvoiceRecord = await repository.findOne({ where: { id } });
      if (!oldInvoiceRecord) return;
      const pid = oldInvoiceRecord.contractPerformanceId;

      await repository.delete(id);
      await this.performanceService.updateAccumulateInvoice(pid!, manager);
    });
  }

  async deleteByPerformanceId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractInvoiceRecord)
      .delete({ contractPerformanceId: id });
  }
}
