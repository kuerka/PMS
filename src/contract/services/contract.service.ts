import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { PaginationDto } from '@/pagination/pagination.dto';
import { CostFormService } from '@/cost-form/cost-form.service';
import { PerformanceService } from './performance.service';
import { PaymentMethodService } from './payment-method.service';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { CollaborationCompany } from '@/cost-form/entities/collaboration-company.entity';
import { CollaborationCompanyInvoice } from '@/cost-form/entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '@/cost-form/entities/collaboration-company-payment.entity';

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
    const contractQuery = this.dataSource
      .createQueryBuilder()
      .select()
      .from(Contract, 'c')
      .skip(offset)
      .take(limit);

    const companyQuery = this.dataSource
      .createQueryBuilder()
      .select('cct_c.id', 'cId')
      .from('cct_c', 'cct_c')
      .leftJoin(ProductionCostForm, 'pcf', 'pcf.contract_id = cct_c.id')
      .leftJoin(
        CollaborationCompany,
        'cc',
        'cc.production_cost_form_id = pcf.id',
      );

    const InvoiceQuery = this.dataSource
      .createQueryBuilder()
      .subQuery()
      .select('cte_cc.cId', 'cId')
      .addSelect('SUM(cci.invoice_amount)', 'ia')
      .from('cte_cc', 'cte_cc')
      .leftJoin(CollaborationCompanyInvoice, 'cci', 'cci.company_id=cte_cc.cId')
      .groupBy('cte_cc.cId');

    const PaymentQuery = this.dataSource
      .createQueryBuilder()
      .subQuery()
      .select('cte_cc.cId', 'cId')
      .addSelect('SUM(ccp.payment_amount)', 'pa')
      .from('cte_cc', 'cte_cc')
      .leftJoin(CollaborationCompanyPayment, 'ccp', 'ccp.company_id=cte_cc.cId')
      .groupBy('cte_cc.cId');

    const resultQuery = this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(contractQuery, 'cct_c')
      .addCommonTableExpression(companyQuery, 'cte_cc')
      .select('A.cId', 'cId')
      .addSelect('A.ia', 'ia')
      .addSelect('B.pa', 'pa')
      .from(InvoiceQuery.getQuery(), 'A')
      .leftJoin(PaymentQuery.getQuery(), 'B', 'A.cId=B.cId');

    console.log(resultQuery.getQuery());

    const list: object[] = await resultQuery.getRawMany();

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
