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

  getContractQueryBuilder(queryDto: QueryContractDto) {
    const query = queryDto || {};
    const queryBuilder = this.dataSource.manager
      .getRepository(Contract)
      .createQueryBuilder('c');

    if (query.searchValues) {
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

    if (query.projectType && query.projectType.length > 0) {
      queryBuilder.andWhere('c.projectType IN (:...projectType)', {
        projectType: query.projectType,
      });
    }
    if (query.projectLocation) {
      queryBuilder.andWhere('c.projectLocation = :projectLocation', {
        projectLocation: query.projectLocation,
      });
    }
    if (query.owner) {
      queryBuilder.andWhere('c.owner LIKE :owner', {
        owner: `%${query.owner}%`,
      });
    }
    if (query.amountType) {
      queryBuilder.andWhere('c.amountType = :amountType', {
        amountType: query.amountType,
      });
    }
    if (query.projectDate && Array.isArray(query.projectDate)) {
      if (query.projectDate[0] != undefined) {
        queryBuilder.andWhere('c.projectStartDate >= :startDate', {
          startDate: query.projectDate[0],
        });
      }
      if (query.projectDate[1] != undefined) {
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
    if (query.cashBondAmount && Array.isArray(query.cashBondAmount)) {
      if (query.cashBondAmount[0] != undefined) {
        queryBuilder.andWhere('c.cashBondAmount >= :minCashBondAmount', {
          minCashBondAmount: query.cashBondAmount[0],
        });
      }
      if (query.cashBondAmount[1] != undefined) {
        queryBuilder.andWhere('c.cashBondAmount <= :maxCashBondAmount', {
          maxCashBondAmount: query.cashBondAmount[1],
        });
      }
    }
    if (query.bondExpiryDate && Array.isArray(query.bondExpiryDate)) {
      if (query.bondExpiryDate[0] != undefined) {
        queryBuilder.andWhere('c.bondExpiryDate >= :minBondExpiryDate', {
          minBondExpiryDate: query.bondExpiryDate[0],
        });
      }
      if (query.bondExpiryDate[1] != undefined) {
        queryBuilder.andWhere('c.bondExpiryDate <= :maxBondExpiryDate', {
          maxBondExpiryDate: query.bondExpiryDate[1],
        });
      }
    }
    if (
      query.contractSettlementAmount &&
      Array.isArray(query.contractSettlementAmount)
    ) {
      if (query.contractSettlementAmount[0] != undefined) {
        queryBuilder.andWhere(
          'c.contractSettlementAmount >= :minSettlementAmount',
          {
            minSettlementAmount: query.contractSettlementAmount[0],
          },
        );
      }
      if (query.contractSettlementAmount[1] != undefined) {
        queryBuilder.andWhere(
          'c.contractSettlementAmount <= :maxSettlementAmount',
          {
            maxSettlementAmount: query.contractSettlementAmount[1],
          },
        );
      }
    }
    if (query.accountsReceivable && Array.isArray(query.accountsReceivable)) {
      if (query.accountsReceivable[0] != undefined) {
        queryBuilder.andWhere(
          'c.accountsReceivable >= :minAccountsReceivable',
          {
            minAccountsReceivable: query.accountsReceivable[0],
          },
        );
      }
      if (query.accountsReceivable[1] != undefined) {
        queryBuilder.andWhere(
          'c.accountsReceivable <= :maxAccountsReceivable',
          {
            maxAccountsReceivable: query.accountsReceivable[1],
          },
        );
      }
    }
    if (
      query.contractExecutionStatus &&
      query.contractExecutionStatus.length > 0
    ) {
      queryBuilder.andWhere(
        'c.contractExecutionStatus IN (:...contractExecutionStatus)',
        {
          contractExecutionStatus: query.contractExecutionStatus,
        },
      );
    }

    return queryBuilder;
  }
  // TODO 后续添加筛选条件
  async getContractPageQuery(queryDto: QueryContractDto) {
    const page = queryDto.pageParams?.currentPage || 1;
    const limit = queryDto.pageParams?.pageSize || 10;
    const { prop, order } = queryDto.sort || {};

    const queryBuilder = this.getContractQueryBuilder(queryDto);

    queryBuilder.leftJoinAndSelect('c.productionCostForm', 'costForm');

    if (prop && order) {
      const _order = order === 'ASC' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`c.${prop}`, _order);
    }
    queryBuilder.skip((page - 1) * limit).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();
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
