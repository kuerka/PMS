import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractInvoiceRecord } from '../entities/invoice-record.entity';
import { AccumulateService } from './contract-accumulated.service';

@Injectable()
export class InvoiceRecordService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private accumulateService: AccumulateService,
  ) {}

  create(invoiceRecord: DeepPartial<ContractInvoiceRecord>) {
    return this.dataSource.manager.create(ContractInvoiceRecord, invoiceRecord);
  }

  async addWithContractId(
    id: number,
    invoiceRecord?: ContractInvoiceRecord,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!invoiceRecord) invoiceRecord = new ContractInvoiceRecord();

    invoiceRecord.contractId = id;
    await manager.transaction(async (manager) => {
      await manager.getRepository(ContractInvoiceRecord).insert(invoiceRecord);
      await this.accumulateService.updateAccumulateInvoice(id, manager);
    });
  }

  async getByContractId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractInvoiceRecord)
      .findBy({ contractId: id });
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

      const cId = oldInvoiceRecord.contractId;

      await repository.update(id, invoiceRecord);
      await this.accumulateService.updateAccumulateInvoice(cId!, manager);
    });
  }

  async delete(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    await manager.transaction(async (manager) => {
      const repository = manager.getRepository(ContractInvoiceRecord);
      const oldInvoiceRecord = await repository.findOne({ where: { id } });
      if (!oldInvoiceRecord) return;
      const cId = oldInvoiceRecord.contractId;

      await repository.delete(id);
      await this.accumulateService.updateAccumulateInvoice(cId!, manager);
    });
  }

  async deleteByContractId(contractId: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractInvoiceRecord)
      .delete({ contractId });
  }
}
