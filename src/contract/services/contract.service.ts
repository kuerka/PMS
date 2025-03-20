import { Injectable, Logger } from '@nestjs/common';
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
import { CollaborationDepartment } from '@/cost-form/entities/collaboration-department.entity';
import {
  transDto,
  TransitionCompanyDto,
  TransitionCostDto,
  TransitionDepartmentDto,
  TransitionInvoiceDto,
  TransitionPaymentDto,
} from '../dto/transition.dto';
import { arrayNotEmpty, isNotEmpty } from 'class-validator';
import { Request } from 'express';

type CompanyCount = {
  id: number;
  count: number;
};

@Injectable()
export class ContractService {
  private readonly logger = new Logger();
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
      const saved = await this.addContract(contract, manager);
      const costForm = this.costFormService.create(productionCostForm);
      costForm.contract = contract;
      const savedForm = await this.costFormService.add(costForm, manager);
      if (savedForm) saved.productionCostForm.id = savedForm.id;
      return saved;
    });
  }
  async addContract(contract: Contract, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).save(contract);
  }

  async getById(id: number) {
    return await this.dataSource.manager
      .getRepository(Contract)
      .findOneBy({ id });
  }

  async getContractPage(queryDto: QueryContractDto) {
    return await this.getContractPageQuery(queryDto);
  }

  getContractQueryBuilder(queryDto: QueryContractDto) {
    const query = queryDto || {};
    const queryBuilder = this.dataSource.manager
      .getRepository(Contract)
      .createQueryBuilder('c');

    if (arrayNotEmpty(query.searchValues)) {
      const queryStr = query.searchValues
        .filter((val) => val.trim() !== '')
        .map((val) => `(?=.*${val})`)
        .join('');
      if (queryStr) {
        queryBuilder.andWhere('c.projectName REGEXP :projectName', {
          projectName: queryStr,
        });
      }
    }
    if (isNotEmpty(query.contractNumber)) {
      queryBuilder.andWhere('c.contractNumber LIKE :contractNumber', {
        contractNumber: `%${query.contractNumber}%`,
      });
    }
    if (isNotEmpty(query.projectType)) {
      queryBuilder.andWhere('c.projectType LIKE :projectType', {
        projectType: `${query.projectType}%`,
      });
    }
    if (isNotEmpty(query.projectLocation)) {
      queryBuilder.andWhere('c.projectLocation LIKE :projectLocation', {
        projectLocation: `${query.projectLocation}%`,
      });
    }
    if (isNotEmpty(query.owner)) {
      queryBuilder.andWhere('c.owner LIKE :owner', {
        owner: `%${query.owner}%`,
      });
    }
    if (query.amountType) {
      queryBuilder.andWhere('c.amountType = :amountType', {
        amountType: query.amountType,
      });
    }
    if (arrayNotEmpty(query.projectDate)) {
      if (isNotEmpty(query.projectDate[0])) {
        queryBuilder.andWhere('c.projectStartDate >= :startDate', {
          startDate: query.projectDate[0],
        });
      }
      if (isNotEmpty(query.projectDate[1])) {
        queryBuilder.andWhere('c.projectEndDate <= :endDate', {
          endDate: query.projectDate[1],
        });
      }
    }
    if (query.bondType) {
      queryBuilder.andWhere('c.bondType = :bondType', {
        bondType: query.bondType,
      });
    }
    if (arrayNotEmpty(query.contractAmount)) {
      if (isNotEmpty(query.contractAmount[0])) {
        queryBuilder.andWhere('c.contractAmount >= :minContractAmount', {
          minContractAmount: query.contractAmount[0],
        });
      }
      if (isNotEmpty(query.contractAmount[1])) {
        queryBuilder.andWhere('c.contractAmount <= :maxContractAmount', {
          maxContractAmount: query.contractAmount[1],
        });
      }
    }
    if (arrayNotEmpty(query.cashBondAmount)) {
      if (isNotEmpty(query.cashBondAmount[0])) {
        queryBuilder.andWhere('c.cashBondAmount >= :minCashBondAmount', {
          minCashBondAmount: query.cashBondAmount[0],
        });
      }
      if (arrayNotEmpty(query.cashBondAmount[1])) {
        queryBuilder.andWhere('c.cashBondAmount <= :maxCashBondAmount', {
          maxCashBondAmount: query.cashBondAmount[1],
        });
      }
    }
    if (arrayNotEmpty(query.bondExpiryDate)) {
      if (isNotEmpty(query.bondExpiryDate[0])) {
        queryBuilder.andWhere('c.bondExpiryDate >= :minBondExpiryDate', {
          minBondExpiryDate: query.bondExpiryDate[0],
        });
      }
      if (isNotEmpty(query.bondExpiryDate[1])) {
        queryBuilder.andWhere('c.bondExpiryDate <= :maxBondExpiryDate', {
          maxBondExpiryDate: query.bondExpiryDate[1],
        });
      }
    }
    if (arrayNotEmpty(query.contractSettlementAmount)) {
      if (isNotEmpty(query.contractSettlementAmount[0])) {
        queryBuilder.andWhere(
          'c.contractSettlementAmount >= :minSettlementAmount',
          {
            minSettlementAmount: query.contractSettlementAmount[0],
          },
        );
      }
      if (isNotEmpty(query.contractSettlementAmount[1])) {
        queryBuilder.andWhere(
          'c.contractSettlementAmount <= :maxSettlementAmount',
          {
            maxSettlementAmount: query.contractSettlementAmount[1],
          },
        );
      }
    }
    if (arrayNotEmpty(query.accountsReceivable)) {
      if (isNotEmpty(query.accountsReceivable[0])) {
        queryBuilder.andWhere(
          'c.accountsReceivable >= :minAccountsReceivable',
          {
            minAccountsReceivable: query.accountsReceivable[0],
          },
        );
      }
      if (isNotEmpty(query.accountsReceivable[1])) {
        queryBuilder.andWhere(
          'c.accountsReceivable <= :maxAccountsReceivable',
          {
            maxAccountsReceivable: query.accountsReceivable[1],
          },
        );
      }
    }
    if (arrayNotEmpty(query.contractExecutionStatus)) {
      queryBuilder.andWhere(
        'c.contractExecutionStatus IN (:...contractExecutionStatus)',
        {
          contractExecutionStatus: query.contractExecutionStatus,
        },
      );
    }

    return queryBuilder;
  }

  handleFilterCost(
    queryBuilder: SelectQueryBuilder<Contract>,
    queryDto: QueryContractDto,
  ) {
    queryBuilder.leftJoinAndSelect('c.productionCostForm', 'costForm');
    if (isNotEmpty(queryDto.leadingDepartment)) {
      queryBuilder.andWhere('costForm.leadingDepartment = :leadingDepartment', {
        leadingDepartment: queryDto.leadingDepartment,
      });
    }
    return queryBuilder;
  }

  // TODO 后续添加筛选条件
  async getContractPageQuery(queryDto: QueryContractDto) {
    const page = queryDto.pageParams?.currentPage || 1;
    const limit = queryDto.pageParams?.pageSize || 10;
    const { prop, order } = queryDto.sort || {};

    let queryBuilder = this.getContractQueryBuilder(queryDto);
    queryBuilder = this.handleFilterCost(queryBuilder, queryDto);
    queryBuilder
      .leftJoinAndSelect('costForm.collaborationDepartments', 'departments')
      .leftJoinAndSelect('costForm.collaborationCompanies', 'companies');

    if (prop && order) {
      const _order = order === 'ASC' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`c.${prop}`, _order);
    }
    queryBuilder.skip((page - 1) * limit).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();

    await this.combineCompanyCount(data);

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

  async getCompanyCount(costIds: number[]) {
    const queryInvoice = this.dataSource
      .createQueryBuilder()
      .select('cc.id', 'id')
      .addSelect('SUM(cci.invoiceAmount)', 'count')
      .from(CollaborationCompany, 'cc')
      .leftJoin(CollaborationCompanyInvoice, 'cci', 'cci.companyId=cc.id')
      .where('cc.productionCostFormId IN (:...costIds)', { costIds })
      .groupBy('cc.id')
      .getRawMany();
    const queryPayment = this.dataSource
      .createQueryBuilder()
      .select('cc.id', 'id')
      .addSelect('SUM(ccp.paymentAmount)', 'count')
      .from(CollaborationCompany, 'cc')
      .leftJoin(CollaborationCompanyPayment, 'ccp', 'ccp.companyId=cc.id')
      .where('cc.productionCostFormId IN (:...costIds)', { costIds })
      .groupBy('cc.id')
      .getRawMany();
    const res = await Promise.all([queryInvoice, queryPayment]);
    return {
      invoice: res[0] as CompanyCount[],
      payment: res[1] as CompanyCount[],
    };
  }

  async combineCompanyCount(data: Contract[]) {
    const costIds = data
      .map((item) => item.productionCostForm?.id)
      .filter((i) => i);

    if (costIds.length === 0) return;
    const { invoice, payment } = await this.getCompanyCount(costIds);
    const companyMap: Record<number, CollaborationCompany> = {};
    for (const contract of data) {
      if (!contract.productionCostForm) continue;
      const costForm = contract.productionCostForm;
      for (const company of costForm.collaborationCompanies) {
        if (!companyMap[company.id]) companyMap[company.id] = company;
      }
    }
    for (const { id, count } of invoice) {
      const company = companyMap[id];
      if (!company) continue;
      company.invoiceCount = count;
    }
    for (const { id, count } of payment) {
      const company = companyMap[id];
      if (!company) continue;
      company.paymentCount = count;
    }
  }

  async getContractDetailsById(id: number) {
    return await this.dataSource.manager.findOne(Contract, {
      where: {
        id,
      },
      relations: {
        prospectProject: true,
        productionCostForm: {
          collaborationDepartments: true,
          collaborationCompanies: {
            collaborationCompanyInvoices: true,
            collaborationCompanyPayments: true,
          },
        },
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

  // 通过意向合同迁移
  async createContractTransition(prospectId: number, contract: Contract) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const costForm = await manager.getRepository(ProductionCostForm).findOne({
        where: { prospectProjectId: prospectId },
        relations: {
          collaborationDepartments: true,
          collaborationCompanies: {
            collaborationCompanyInvoices: true,
            collaborationCompanyPayments: true,
          },
        },
      });
      if (!costForm) return;
      // contract
      const con = await manager.getRepository(Contract).save(contract);
      // cost
      const cost = transDto(TransitionCostDto, costForm);
      cost.contractId = con.id;
      const cf = await manager.getRepository(ProductionCostForm).save(cost);
      // department
      const departments = costForm.collaborationDepartments;
      const deps: TransitionDepartmentDto[] = [];
      for (const department of departments) {
        const dep = transDto(TransitionDepartmentDto, department);
        dep.productionCostFormId = cf.id;
        deps.push(dep);
      }
      await manager.getRepository(CollaborationDepartment).insert(deps);
      //company
      const companies = costForm.collaborationCompanies;
      for (const company of companies) {
        const cop = transDto(TransitionCompanyDto, company);
        cop.productionCostFormId = cf.id;
        const coped = await manager
          .getRepository(CollaborationCompany)
          .save(cop);

        const invoices = company.collaborationCompanyInvoices;
        const inv_s: TransitionInvoiceDto[] = [];
        for (const invoice of invoices) {
          const inv = transDto(TransitionInvoiceDto, invoice);
          inv.companyId = coped.id;
          inv_s.push(inv);
        }

        const payments = company.collaborationCompanyPayments;
        const pay_s: TransitionPaymentDto[] = [];
        for (const payment of payments) {
          const pay = transDto(TransitionPaymentDto, payment);
          pay.companyId = coped.id;
          pay_s.push(pay);
        }

        await Promise.all([
          manager.getRepository(CollaborationCompanyInvoice).insert(inv_s),
          manager.getRepository(CollaborationCompanyPayment).insert(pay_s),
        ]);
      }
    });
  }

  async logHandleCompany(req: Request, id: number, type: string) {
    const company = await this.getById(id);
    if (!company) return;

    const log = `意向合同 [${id}]:"${company.projectName}" 将被处理 操作类型: ${type} 请求来源: ${req.ip} 用户: ${JSON.stringify(req['user'])} 项目详情: ${JSON.stringify(company)}`;
    this.logger.log(log);
  }
}
