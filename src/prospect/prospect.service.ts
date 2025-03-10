import { Injectable } from '@nestjs/common';
import { ProspectProject } from './prospect.entity';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProspectQueryDto } from './prospect.dto';
import { CostFormService } from '@/cost-form/cost-form.service';
import { DepartmentCodeToName } from '@/config/const';
import * as exceljs from 'exceljs';

@Injectable()
export class ProspectService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private costFormService: CostFormService,
  ) {}

  create(prospect: DeepPartial<ProspectProject>) {
    return this.dataSource.manager.create(ProspectProject, prospect);
  }

  async addTransaction(prospect: ProspectProject) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await this.add(prospect, manager);
      if (prospect.isPriorWorkStarted) {
        const form = this.costFormService.create(prospect.productionCostForm);
        form.prospectProject = prospect;
        await this.costFormService.add(form, manager);
      }
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

    if (query.searchValues) {
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

    console.log('projectDockingStage:', query.projectDockingStage, query);

    if (query.projectDockingStage && query.projectDockingStage.length > 0) {
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
    if (query.assistingBusinessDepartment) {
      queryBuilder.andWhere(
        'JSON_CONTAINS(p.assistingBusinessDepartment, :assistingBusinessDepartment)',
        {
          assistingBusinessDepartment: JSON.stringify(
            query.assistingBusinessDepartment,
          ),
        },
      );
    }

    if (
      query.estimatedContractAmount &&
      Array.isArray(query.estimatedContractAmount)
    ) {
      if (query.estimatedContractAmount[0] != undefined) {
        queryBuilder.andWhere('p.estimatedContractAmount >= :minAmount', {
          minAmount: query.estimatedContractAmount[0],
        });
      }
      if (query.estimatedContractAmount[1] != undefined) {
        queryBuilder.andWhere('p.estimatedContractAmount <= :maxAmount', {
          maxAmount: query.estimatedContractAmount[1],
        });
      }
    }

    if (query.createdAt && Array.isArray(query.createdAt)) {
      if (query.createdAt[0] != undefined) {
        queryBuilder.andWhere('p.createdAt >= :startDate', {
          startDate: query.createdAt[0],
        });
      }
      if (query.createdAt[1] != undefined) {
        queryBuilder.andWhere('p.createdAt <= :endDate', {
          endDate: query.createdAt[1],
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
    const totalCost: object[] | undefined = await queryBuilder
      .select(
        'SUM(p.estimated_contract_amount)',
        'totalEstimatedContractAmount',
      )
      .getRawOne();
    return totalCost;
  }

  async getFilterExcel(prospectQueryDto: ProspectQueryDto) {
    const queryBuilder = this.getProspectQuery(prospectQueryDto);
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
      { header: '创建时间', key: 'createdAt' },
      { header: '更新时间', key: 'updatedAt' },
      { header: '备注', key: 'remark' },
    ];

    for (const row of rows) {
      const assisting: string[] =
        (row.assistingBusinessDepartment as string[]) ?? [];
      console.log('assisting:', assisting);
      const assistingBusinessDepartment = assisting
        .map((id) => DepartmentCodeToName[id] ?? id)
        .join(',');

      worksheet.addRow({
        id: row.id,
        projectName: row.projectName,
        estimatedContractAmount: row.estimatedContractAmount,
        businessPersonnel: row.businessPersonnel,
        leadingBusinessDepartment: row.leadingBusinessDepartment,
        assistingBusinessDepartment: assistingBusinessDepartment,
        isPriorWorkStarted: row.isPriorWorkStarted ? '是' : '否',
        projectDockingStage: row.projectDockingStage,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        remark: row.remark,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
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
      await this.costFormService.deleteByProspectId(id, manager);
      await manager.delete(ProspectProject, id);
    });
  }
}
