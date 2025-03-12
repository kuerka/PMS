import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class CostFormAccumulatedService {
  constructor(@InjectDataSource() private datasource: DataSource) {}
  async updateAccumulatedInvoice(costId: number, manager?: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    await manager.query('CALL sum_collaboration_invoice(?)', [costId]);
  }

  async updateAccumulatedReceipt(costId: number, manager: EntityManager) {
    if (!manager) manager = this.datasource.manager;
    await manager.query('CALL sum_collaboration_payment(?)', [costId]);
  }
}
