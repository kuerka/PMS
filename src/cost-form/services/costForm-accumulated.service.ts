import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class CostFormAccumulatedService {
  constructor(@InjectDataSource() private datasource: DataSource) {}
  async updateAccumulatedInvoice(id: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    await manager.query('CALL sum_collaboration_invoice(?)', [id]);
  }

  async updateAccumulatedReceipt(id: number, manager: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    await manager.query('CALL sum_collaboration_payment(?)', [id]);
  }
}
