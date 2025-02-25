import { Injectable } from '@nestjs/common';
import { ProspectProject } from './prospect.entity';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { ProspectQueryDto, ProspectUpdateDto } from './prospect.dto';
import { plainToClass } from 'class-transformer';
import { CostFormDto } from '@/cost-form/dto/cost-form.dto';
import { CostFormService } from '@/cost-form/cost-form.service';

@Injectable()
export class ProspectService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private costFormService: CostFormService,
  ) {}

  async createTransaction(prospect: ProspectProject) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await this.create(manager, prospect);
      if (prospect.isPriorWorkStarted) {
        const form = new CostFormDto();
        form.prospectProject = prospect;
        await this.costFormService.add(form, manager);
      }
    });
  }

  async create(manager: EntityManager, prospect: ProspectProject) {
    const prospectRepository = manager.getRepository(ProspectProject);
    return await prospectRepository.save(prospect);
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
    const [prospects, total] = await this.dataSource.manager.findAndCount(
      ProspectProject,
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

  async update(id: number, prospect: ProspectProject) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const prospectRepository = manager.getRepository(ProspectProject);
      const costFormRepository = manager.getRepository(ProductionCostForm);

      const updateProspect = plainToClass(ProspectUpdateDto, prospect);
      await prospectRepository.update(id, updateProspect);

      if (!prospect.isPriorWorkStarted) {
        await manager.delete(ProductionCostForm, { prospectProject: { id } });
        return;
      }

      const form = await costFormRepository.findOneBy({
        prospectProject: { id },
      });
      const updateForm = prospect.productionCostForm;
      if (form) {
        if (!updateForm) return;
        updateForm.id = form.id;
        await this.costFormService.updateWithProspect(updateForm, prospect.id);
      } else {
        const costForm = plainToClass(CostFormDto, updateForm ?? {});
        costForm.prospectProject = prospect;
        await costFormRepository.save(costForm);
      }
    });
  }

  async delete(id: number) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await manager.delete(ProductionCostForm, { prospectProject: { id } });
      await manager.delete(ProspectProject, id);
    });
  }
}
