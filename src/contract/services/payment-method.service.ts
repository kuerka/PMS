import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { ContractPaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  create(payment: DeepPartial<ContractPaymentMethod>) {
    return this.dataSource.manager.create(ContractPaymentMethod, payment);
  }

  async addPaymentMethod(
    paymentMethod: ContractPaymentMethod,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(ContractPaymentMethod)
      .insert(paymentMethod);
  }

  async getPaymentMethodByContractId(
    contractId: number,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager.getRepository(ContractPaymentMethod).findOne({
      where: { contractId },
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
