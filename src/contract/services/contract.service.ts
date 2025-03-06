import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { PaginationDto } from '@/pagination/pagination.dto';
import { CostFormService } from '@/cost-form/cost-form.service';
import { PerformanceService } from './performance.service';
import { PaymentMethodService } from './payment-method.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private costFormService: CostFormService,
    private paymentService: PaymentMethodService,
    private performanceService: PerformanceService,
  ) {}

  createContract(contract: DeepPartial<Contract>) {
    return this.dataSource.manager.create(Contract, contract);
  }

  async addContractTransition(contract: Contract) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const { productionCostForm, contractPerformance } = contract;
      const res = await this.addContract(contract, manager);
      const costForm = this.costFormService.create(productionCostForm);
      costForm.contract = res;
      await this.costFormService.add(costForm, manager);
      const performance = this.performanceService.create(contractPerformance);
      performance.contract = res;
      await this.performanceService.addWithContractId(
        res.id,
        performance,
        manager,
      );
    });
  }
  async addContract(contract: Contract, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).save(contract);
  }

  async getContractPage(queryDto: PaginationDto) {
    const { page, limit } = queryDto;
    const [prospects, total] = await this.dataSource.manager.findAndCount(
      Contract,
      {
        skip: (page - 1) * limit,
        take: limit,
      },
    );
    return {
      data: prospects,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async getContractSimpleById(id: number) {
    return await this.dataSource.manager.findOne(Contract, {
      where: {
        id,
      },
      relations: {
        prospectProject: true,
        productionCostForm: true,
        contractPerformance: true,
      },
    });
  }

  async getAccumulatedAmount(limit: number = 20, offset: number = 2000) {
    const LimitAndSkipQuery = this.dataSource.manager
      .createQueryBuilder()
      .subQuery()
      .select('id')
      .from(
        (qb) =>
          qb
            .subQuery()
            .select()
            .from(Contract, 'ccl')
            .limit(limit)
            .offset(offset),
        'ccl',
      );

    const cctSubQuery = this.dataSource.manager
      .createQueryBuilder()
      .subQuery()
      .select('c.id', 'cId')
      .addSelect('cc.id', 'ccId')
      .from(Contract, 'c')
      .leftJoin('production_cost_form', 'pcf', 'c.id = pcf.contract_id')
      .leftJoin(
        'collaboration_company',
        'cc',
        'pcf.id = cc.production_cost_form_id',
      )
      .where((qb) => {
        const subQUery = qb
          .subQuery()
          .select('id')
          .from(LimitAndSkipQuery.getQuery(), 't2');
        return `c.id IN ${subQUery.getQuery()}`;
      });

    const invoiceSubQuery = this.dataSource.manager
      .createQueryBuilder()
      .subQuery()
      .select('t.cId', 'cId')
      .addSelect('SUM(cci.invoice_amount)', 'ia')
      .from(cctSubQuery.getQuery(), 't')
      .leftJoin(
        'collaboration_company_invoice',
        'cci',
        'cci.company_id = t.ccId',
      )
      .groupBy('t.cId');
    const paymentSubQuery = this.dataSource.manager
      .createQueryBuilder()
      .subQuery()
      .select('t.cId', 'cId')
      .addSelect('SUM(ccp.payment_amount)', 'pa')
      .from(cctSubQuery.getQuery(), 't')
      .leftJoin(
        'collaboration_company_payment',
        'ccp',
        'ccp.company_id = t.ccId',
      )
      .groupBy('t.cId');

    const result = this.dataSource.manager
      .createQueryBuilder()
      .select('A.cId', 'cId')
      .addSelect('A.ia', 'ia')
      .addSelect('B.pa', 'pa')
      .from(invoiceSubQuery.getQuery(), 'A')
      .leftJoin(paymentSubQuery.getQuery(), 'B', 'A.cId = B.cId');
    console.log(result.getQuery());

    const list: object[] = await result.getRawMany();

    return list;
  }

  async getContractDetailsById(id: number) {
    return await this.dataSource.manager.findOne(Contract, {
      where: {
        id,
      },
      relations: {
        prospectProject: true,
        productionCostForm: true,
        contractPerformance: {
          invoiceHeader: true,
          contractInvoiceRecords: true,
          contractReceiptRecords: true,
        },
      },
    });
  }

  async updateContractTransition(contract: Contract) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await this.updateContract(contract, manager);
      const costForm = contract.productionCostForm;
      await this.costFormService.updateByContractId(
        contract.id,
        costForm,
        manager,
      );
    });
  }
  async updateContract(contract: Contract, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).save(contract);
  }

  async deleteContractTransition(id: number) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const form = this.costFormService.deleteByContractId(id, manager);
      const payment = this.paymentService.deleteByContractId(id, manager);
      const perform = this.performanceService.deleteByContractId(id, manager);
      await Promise.all([form, payment, perform]);
      await this.deleteContract(id, manager);
    });
  }
  async deleteContract(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).delete(id);
  }
}
