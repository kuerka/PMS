import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  SelectQueryBuilder,
} from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { CostFormService } from '@/cost-form/cost-form.service';
import { PerformanceService } from './performance.service';
import { PaymentMethodService } from './payment-method.service';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { CollaborationCompany } from '@/cost-form/entities/collaboration-company.entity';
import { CollaborationCompanyInvoice } from '@/cost-form/entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '@/cost-form/entities/collaboration-company-payment.entity';
import { QueryContractDto } from '../dto/contract.dto';
import { keysToCamel } from '@/utils/convert';

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

  async getContractPage(queryDto: QueryContractDto) {
    return await this.getContractPageQuery(queryDto);
  }

  async getContractPageQuery(queryDto: QueryContractDto) {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const query = queryDto.query || {};

    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select()
      .from(Contract, 'contract');

    if (query.contractNumber) {
      queryBuilder.andWhere('contract.contractNumber = :contractNumber', {
        contractNumber: query.contractNumber,
      });
    }
    if (query.projectName) {
      queryBuilder.andWhere('contract.projectName LIKE :projectName', {
        projectName: `%${query.projectName}%`,
      });
    }
    if (query.projectType) {
      queryBuilder.andWhere('contract.projectType = :projectType', {
        projectType: query.projectType,
      });
    }
    if (query.projectLocation) {
      queryBuilder.andWhere('contract.projectLocation = :projectLocation', {
        projectLocation: query.projectLocation,
      });
    }
    if (query.owner) {
      queryBuilder.andWhere('contract.owner LIKE :owner', {
        owner: `%${query.owner}%`,
      });
    }
    if (query.isPreliminaryNumber) {
      queryBuilder.andWhere(
        'contract.isPreliminaryNumber = :isPreliminaryNumber',
        {
          isPreliminaryNumber: query.isPreliminaryNumber,
        },
      );
    }
    if (query.amountType) {
      queryBuilder.andWhere('contract.amountType = :amountType', {
        amountType: query.amountType,
      });
    }
    if (query.remark) {
      queryBuilder.andWhere('contract.remark LIKE :remark', {
        remark: `%${query.remark}%`,
      });
    }
    if (query.projectStartDate) {
      queryBuilder.andWhere('contract.projectStartDate >= :projectStartDate', {
        projectStartDate: query.projectStartDate,
      });
    }
    if (query.projectEndDate) {
      queryBuilder.andWhere('contract.projectEndDate <= :projectEndDate', {
        projectEndDate: query.projectEndDate,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);
    const total = await queryBuilder.getCount();

    const raws = await this.getAccumulatedAmount(queryBuilder);
    const data = raws.map(keysToCamel);
    return {
      data,
      total,
      limit,
      page,
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

  async getAccumulatedAmount(contractQuery: SelectQueryBuilder<Contract>) {
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
      .select('cc.*')
      .addSelect('A.ia', 'accumulated_invoice_amount')
      .addSelect('B.pa', 'accumulated_receipt_amount')
      .from('cct_c', 'cc')
      .leftJoin(InvoiceQuery.getQuery(), 'A', 'A.cId=cc.id')
      .leftJoin(PaymentQuery.getQuery(), 'B', 'B.cId=cc.id')
      .setParameters(contractQuery.getParameters());

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
