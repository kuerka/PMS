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
import { PaymentMethodService } from './payment-method.service';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { CollaborationCompany } from '@/cost-form/entities/collaboration-company.entity';
import { CollaborationCompanyInvoice } from '@/cost-form/entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '@/cost-form/entities/collaboration-company-payment.entity';
import { QueryContractDto } from '../dto/contract.dto';
import { InvoiceHeaderService } from './invoice-header.service';
import { InvoiceRecordService } from './invoice-record.service';
import { ReceiptRecordService } from './receipt-record.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private costFormService: CostFormService,
    private paymentService: PaymentMethodService,
    private invoiceHeaderService: InvoiceHeaderService,
    private invoiceRecordService: InvoiceRecordService,
    private receiptService: ReceiptRecordService,
  ) {}

  createContract(contract: DeepPartial<Contract>) {
    return this.dataSource.manager.create(Contract, contract);
  }

  async addContractTransition(contract: Contract) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const { productionCostForm } = contract;
      const res = await this.addContract(contract, manager);
      const costForm = this.costFormService.create(productionCostForm);
      costForm.contract = res;
      await this.costFormService.add(costForm, manager);
    });
  }
  async addContract(contract: Contract, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).save(contract);
  }

  async getContractPage(queryDto: QueryContractDto) {
    return await this.getContractPageQuery(queryDto);
  }

  // TODO 后续添加筛选条件
  async getContractPageQuery(queryDto: QueryContractDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query = queryDto || {};
    const page = queryDto.pageParams?.currentPage || 1;
    const limit = queryDto.pageParams?.pageSize || 10;

    const queryBuilder = this.dataSource
      .createQueryBuilder(Contract, 'c')
      .select()
      .leftJoinAndSelect('c.productionCostForm', 'costForm');

    // if (query.contractNumber) {
    //   queryBuilder.andWhere('c.contractNumber = :contractNumber', {
    //     contractNumber: query.contractNumber,
    //   });
    // }
    // if (query.projectName) {
    //   queryBuilder.andWhere('c.projectName LIKE :projectName', {
    //     projectName: `%${query.projectName}%`,
    //   });
    // }
    // if (query.projectType) {
    //   queryBuilder.andWhere('c.projectType = :projectType', {
    //     projectType: query.projectType,
    //   });
    // }
    // if (query.projectLocation) {
    //   queryBuilder.andWhere('c.projectLocation = :projectLocation', {
    //     projectLocation: query.projectLocation,
    //   });
    // }
    // if (query.owner) {
    //   queryBuilder.andWhere('c.owner LIKE :owner', {
    //     owner: `%${query.owner}%`,
    //   });
    // }
    // if (query.isPreliminaryNumber) {
    //   queryBuilder.andWhere('c.isPreliminaryNumber = :isPreliminaryNumber', {
    //     isPreliminaryNumber: query.isPreliminaryNumber,
    //   });
    // }
    // if (query.amountType) {
    //   queryBuilder.andWhere('c.amountType = :amountType', {
    //     amountType: query.amountType,
    //   });
    // }
    // if (query.remark) {
    //   queryBuilder.andWhere('c.remark LIKE :remark', {
    //     remark: `%${query.remark}%`,
    //   });
    // }
    // if (query.projectStartDate) {
    //   queryBuilder.andWhere('c.projectStartDate >= :projectStartDate', {
    //     projectStartDate: query.projectStartDate,
    //   });
    // }
    // if (query.projectEndDate) {
    //   queryBuilder.andWhere('c.projectEndDate <= :projectEndDate', {
    //     projectEndDate: query.projectEndDate,
    //   });
    // }

    queryBuilder.skip((page - 1) * limit).take(limit);
    const total = await queryBuilder.getCount();

    // const raws = await this.getAccumulatedAmount(queryBuilder);
    // const data = raws.map(keysToCamel);
    // const data = await queryBuilder.getRawMany();
    const data = await queryBuilder.getMany();
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
        invoiceHeader: true,
        contractInvoiceRecords: true,
        contractReceiptRecords: true,
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
      const header = this.invoiceHeaderService.deleteByContractId(id, manager);
      const record = this.invoiceRecordService.deleteByContractId(id, manager);
      const receipt = this.receiptService.deleteByContractId(id, manager);
      await Promise.all([form, payment, header, record, receipt]);
      await this.deleteContract(id, manager);
    });
  }
  async deleteContract(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).delete(id);
  }
}
