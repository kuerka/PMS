import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ContractPaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async addPaymentMethod(
    paymentMethod: ContractPaymentMethod,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractPaymentMethod)
      .insert(paymentMethod);
  }

  async getPaymentMethodById(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractPaymentMethod).findOne({
      where: { id },
    });
  }

  async updatePaymentMethod(
    id: number,
    paymentMethod: ContractPaymentMethod,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractPaymentMethod)
      .update(id, paymentMethod);
  }

  async deletePaymentMethod(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractPaymentMethod).delete(id);
  }
}
