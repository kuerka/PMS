import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractPerformance } from '../entities/performance.entity';

@Injectable()
export class PerformanceService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  create(performance?: DeepPartial<ContractPerformance>) {
    return this.dataSource.manager.create(ContractPerformance, performance);
  }

  async addWithContractId(
    id: number,
    performance?: ContractPerformance,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;
    if (!performance) performance = new ContractPerformance();

    performance.contractId = id;
    return await manager.getRepository(ContractPerformance).insert(performance);
  }

  async getByContractId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractPerformance).findOne({
      where: { id },
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
  async deleteByContractId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractPerformance)
      .delete({ contractId: id });
  }
}
