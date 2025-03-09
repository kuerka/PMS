import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class AccumulateService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async updateAccumulateInvoice(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    await manager.query('CALL sum_contract_invoice(?)', [id]);
  }

  async updateAccumulateReceipt(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    await manager.query('CALL sum_contract_receipt(?)', [id]);
  }
}
