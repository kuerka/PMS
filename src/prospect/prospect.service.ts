import { Injectable, Logger } from '@nestjs/common';
import { ProspectProject } from './prospect.entity';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProspectQueryDto } from './prospect.dto';
import { CostFormService } from '@/cost-form/cost-form.service';
import { DepartmentCodeToName } from '@/config/const';
import * as exceljs from 'exceljs';
import { arrayNotEmpty, isNotEmpty } from 'class-validator';
import { Request } from 'express';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { FileService } from '@/file/file.service';

@Injectable()
export class ProspectService {
  logger = new Logger();
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private costFormService: CostFormService,
    private fileService: FileService,
  ) {}

  create(prospect: DeepPartial<ProspectProject>) {
    return this.dataSource.manager.create(ProspectProject, prospect);
  }

  async addTransaction(prospect: ProspectProject) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const saved = await this.add(prospect, manager);
      let savedForm: ProductionCostForm | null = null;
      if (prospect.isPriorWorkStarted) {
        const form = this.costFormService.create(prospect.productionCostForm);
        form.prospectProject = prospect;
        savedForm = await this.costFormService.add(form, manager);
      }
      if (savedForm) saved.productionCostForm.id = savedForm.id;
      return saved;
    });
  }

  async add(prospect: ProspectProject, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(ProspectProject).save(prospect);
  }

  async findById(id: number) {
    return await this.dataSource.manager.findOneBy(ProspectProject, { id });
  }

  async findAll() {
    return await this.dataSource.manager.find(ProspectProject);
  }

  async findAllWithCostForm() {
    return await this.dataSource.manager.find(ProspectProject, {
      relations: { productionCostForm: true },
    });
  }

  async findOneWithCostForm(id: number) {
    return await this.dataSource.manager.findOne(ProspectProject, {
      where: { id },
      relations: {
        productionCostForm: {
          collaborationDepartments: true,
          collaborationCompanies: {
            collaborationCompanyInvoices: true,
            collaborationCompanyPayments: true,
          },
        },
      },
    });
  }

  getProspectQuery(
    prospectQueryDto: ProspectQueryDto,
    hasCostForm: boolean = false,
  ) {
    const query = prospectQueryDto || {};
    const queryBuilder = this.dataSource.manager
      .getRepository(ProspectProject)
      .createQueryBuilder('p');

    if (hasCostForm)
      queryBuilder.leftJoinAndSelect('p.productionCostForm', 'costForm');

    if (arrayNotEmpty(query.searchValues)) {
      const queryStr = query.searchValues
        .filter((val) => val.trim() !== '')
        .map((val) => `(?=.*${val})`)
        .join('');
      if (queryStr) {
        queryBuilder.andWhere('p.projectName REGEXP :projectName', {
          projectName: queryStr,
        });
      }
    }
    if (arrayNotEmpty(query.projectDockingStage)) {
      queryBuilder.andWhere(
        'p.projectDockingStage IN (:...projectDockingStage)',
        {
          projectDockingStage: query.projectDockingStage,
        },
      );
    }
    if (query.businessPersonnel) {
      queryBuilder.andWhere('p.businessPersonnel = :businessPersonnel', {
        businessPersonnel: `${query.businessPersonnel}`,
      });
    }
    if (query.leadingBusinessDepartment) {
      queryBuilder.andWhere(
        'p.leadingBusinessDepartment = :leadingBusinessDepartment',
        {
          leadingBusinessDepartment: `${query.leadingBusinessDepartment}`,
        },
      );
    }

    const assistant = query.assistingBusinessDepartment as string[] | undefined;
    if (arrayNotEmpty(assistant)) {
      queryBuilder.andWhere(
        'JSON_CONTAINS(p.assistingBusinessDepartment, :assistingBusinessDepartment)',
        {
          assistingBusinessDepartment: JSON.stringify(assistant),
        },
      );
    }
    if (isNotEmpty(query.isPriorWorkStarted)) {
      queryBuilder.andWhere('p.isPriorWorkStarted = :isPriorWorkStarted', {
        isPriorWorkStarted: query.isPriorWorkStarted,
      });
    }
    if (arrayNotEmpty(query.estimatedContractAmount)) {
      if (isNotEmpty(query.estimatedContractAmount[0])) {
        queryBuilder.andWhere('p.estimatedContractAmount >= :minAmount', {
          minAmount: query.estimatedContractAmount[0],
        });
      }
      if (isNotEmpty(query.estimatedContractAmount[1])) {
        queryBuilder.andWhere('p.estimatedContractAmount <= :maxAmount', {
          maxAmount: query.estimatedContractAmount[1],
        });
      }
    }

    if (arrayNotEmpty(query.createdAt)) {
      if (isNotEmpty(query.createdAt?.[0])) {
        queryBuilder.andWhere('p.createdAt >= :startDate', {
          startDate: query.createdAt?.[0],
        });
      }
      if (isNotEmpty(query.createdAt?.[1])) {
        queryBuilder.andWhere('p.createdAt <= :endDate', {
          endDate: query.createdAt?.[1],
        });
      }
    }

    return queryBuilder;
  }

  async getProspectPage(prospectQueryDto: ProspectQueryDto) {
    const page = prospectQueryDto.pageParams?.currentPage || 1;
    const limit = prospectQueryDto.pageParams?.pageSize || 10;
    const { prop, order } = prospectQueryDto.sort || {};
    const queryBuilder = this.getProspectQuery(prospectQueryDto, true);

    if (prop && order) {
      const _order = order === 'ASC' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`p.${prop}`, _order);
    }
    queryBuilder.skip((page - 1) * limit).take(limit);

    const prospects: ProspectProject[] = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();
    return {
      data: prospects,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async getTotalAccumulated(prospectQueryDto: ProspectQueryDto) {
    const queryBuilder = this.getProspectQuery(prospectQueryDto);
    return await queryBuilder
      .select(
        'SUM(p.estimated_contract_amount)',
        'totalEstimatedContractAmount',
      )
      .getRawOne<object>();
  }

  async getFilterExcel(prospectQueryDto: ProspectQueryDto) {
    const queryBuilder = this.getProspectQuery(prospectQueryDto);
    queryBuilder.leftJoinAndSelect('p.productionCostForm', 'costForm');
    const rows = await queryBuilder.getMany();
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet();
    worksheet.columns = [
      { header: '项目ID', key: 'id' },
      { header: '项目名称', key: 'projectName' },
      { header: '预估合同金额', key: 'estimatedContractAmount' },
      { header: '业务人员', key: 'businessPersonnel' },
      { header: '主导业务部门', key: 'leadingBusinessDepartment' },
      { header: '辅助业务部门', key: 'assistingBusinessDepartment' },
      { header: '是否已开始前期工作', key: 'isPriorWorkStarted' },
      { header: '项目对接阶段', key: 'projectDockingStage' },
      { header: '牵头部门', key: 'leadingDepartment' },
      { header: '项目完成进度', key: 'projectCompletionProgress' },
      { header: '预算总金额', key: 'totalBudgetAmount' },
      { header: '预算执行总金额', key: 'totalBudgetExecutionAmount' },
      { header: '结算总金额', key: 'totalSettlementAmount' },
      { header: '累计收票金额', key: 'accumulatedInvoiceAmount' },
      { header: '累计支付金额', key: 'accumulatedPaymentAmount' },
      { header: '创建时间', key: 'createdAt' },
      { header: '更新时间', key: 'updatedAt' },
      { header: '备注', key: 'remark' },
    ];

    for (const row of rows) {
      const costForm = row.productionCostForm;

      let leadingName = row.leadingBusinessDepartment;
      if (row.leadingBusinessDepartment)
        leadingName = DepartmentCodeToName[row.leadingBusinessDepartment];

      const assisting: string[] =
        (row.assistingBusinessDepartment as string[]) ?? [];
      const assistingBusinessDepartment = assisting
        .map((id) => DepartmentCodeToName[id] ?? id)
        .join(',');

      const prospect = {
        id: row.id,
        projectName: row.projectName,
        estimatedContractAmount: row.estimatedContractAmount,
        businessPersonnel: row.businessPersonnel,
        leadingBusinessDepartment: leadingName,
        assistingBusinessDepartment: assistingBusinessDepartment,
        isPriorWorkStarted: row.isPriorWorkStarted ? '是' : '否',
        projectDockingStage: row.projectDockingStage,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        remark: row.remark,
      };

      let cost = {};
      if (costForm) {
        let leading = costForm.leadingDepartment;
        if (costForm.leadingDepartment)
          leading = DepartmentCodeToName[costForm.leadingDepartment];
        cost = {
          leadingDepartment: leading,
          totalBudgetAmount: costForm.totalBudgetAmount,
          totalBudgetExecutionAmount: costForm.totalBudgetExecutionAmount,
          totalSettlementAmount: costForm.totalSettlementAmount,
          accumulatedInvoiceAmount: costForm.accumulatedInvoiceAmount,
          accumulatedPaymentAmount: costForm.accumulatedPaymentAmount,
          projectCompletionProgress: costForm.projectCompletionProgress,
        };
      }

      worksheet.addRow({ ...prospect, ...cost });
    }

    return await workbook.xlsx.writeBuffer();
  }

  async updateTransaction(id: number, prospect: ProspectProject) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await this.update(prospect, manager);

      if (!prospect.isPriorWorkStarted) {
        await this.costFormService.deleteByProspectId(id, manager);
        return;
      }

      const updateForm = prospect.productionCostForm;
      if (!updateForm) return;

      const form = await this.costFormService.findByProspectId(id);
      if (form) {
        updateForm.id = form.id;
        await this.costFormService.update(updateForm, manager);
      } else {
        updateForm.prospectProjectId = id;
        await this.costFormService.add(updateForm, manager);
      }
    });
  }

  async update(prospect: ProspectProject, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(ProspectProject).save(prospect);
  }

  async delete(id: number) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await Promise.all([
        this.costFormService.deleteByProspectId(id, manager),
        this.fileService.deleteByProspectId(id, manager),
      ]);
      await manager.delete(ProspectProject, id);
    });
  }

  async logHandleProspect(req: Request, id: number, type: string) {
    const prospect = await this.findById(id);
    if (!prospect) return;

    const log = `意向合同 [${id}]:"${prospect.projectName}" 将被处理 操作类型: ${type} 请求来源: ${req.ip} 用户: ${JSON.stringify(req['user'])} 项目详情: ${JSON.stringify(prospect)}`;
    this.logger.log(log);
  }
}
