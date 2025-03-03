import { Injectable } from '@nestjs/common';
import { ProspectProject } from './prospect.entity';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProspectQueryDto } from './prospect.dto';
import { CostFormService } from '@/cost-form/cost-form.service';

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
      relations: { productionCostForm: true },
    });
  }

  async getProspectPage(prospectQueryDto: ProspectQueryDto) {
    const page = prospectQueryDto.page || 1;
    const limit = prospectQueryDto.limit || 10;
    const query = prospectQueryDto.query || {};
    const queryBuilder = this.dataSource.manager
      .getRepository(ProspectProject)
      .createQueryBuilder('prospect')
      .leftJoinAndSelect('prospect.productionCostForm', 'costForm');

    if (query.id) {
      queryBuilder.andWhere('prospect.id = :id', { id: query.id });
    }
    if (query.projectName) {
      queryBuilder.andWhere('prospect.projectName LIKE :projectName', {
        projectName: `%${query.projectName}%`,
      });
    }
    if (query.businessPersonnel) {
      queryBuilder.andWhere(
        'prospect.businessPersonnel LIKE :businessPersonnel',
        {
          businessPersonnel: `%${query.businessPersonnel}%`,
        },
      );
    }
    if (query.leadingBusinessDepartment) {
      queryBuilder.andWhere(
        'prospect.leadingBusinessDepartment LIKE :leadingBusinessDepartment',
        {
          leadingBusinessDepartment: `%${query.leadingBusinessDepartment}%`,
        },
      );
    }
    if (query.assistingBusinessDepartment) {
      queryBuilder.andWhere(
        'JSON_CONTAINS(prospect.assistingBusinessDepartment, :assistingBusinessDepartment)',
        {
          assistingBusinessDepartment: JSON.stringify(
            query.assistingBusinessDepartment,
          ),
        },
      );
    }
    if (query.isPriorWorkStarted !== undefined) {
      queryBuilder.andWhere(
        'prospect.isPriorWorkStarted = :isPriorWorkStarted',
        {
          isPriorWorkStarted: query.isPriorWorkStarted,
        },
      );
    }
    if (query.projectDockingStage) {
      queryBuilder.andWhere(
        'prospect.projectDockingStage = :projectDockingStage',
        {
          projectDockingStage: query.projectDockingStage,
        },
      );
    }
    if (query.estimatedContractAmount) {
      queryBuilder.andWhere(
        'prospect.estimatedContractAmount LIKE :estimatedContractAmount',
        {
          estimatedContractAmount: `%${query.estimatedContractAmount}%`,
        },
      );
    }
    if (query.remark) {
      queryBuilder.andWhere('prospect.remark LIKE :remark', {
        remark: `%${query.remark}%`,
      });
    }
    if (query.createdAt) {
      queryBuilder.andWhere('prospect.createdAt = :createdAt', {
        createdAt: query.createdAt,
      });
    }
    if (query.updatedAt) {
      queryBuilder.andWhere('prospect.updatedAt = :updatedAt', {
        updatedAt: query.updatedAt,
      });
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
