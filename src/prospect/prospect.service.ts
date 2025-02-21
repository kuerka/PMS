import { Injectable } from '@nestjs/common';
import { ProspectProject } from './prospect.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { ProspectQueryDto } from './prospect.dto';

@Injectable()
export class ProspectService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(prospect: ProspectProject) {
    return await this.dataSource.manager.transaction(async (manager) => {
      if (prospect.isPriorWorkStarted) {
        const costForm = new ProductionCostForm();
        costForm.createdAt = new Date();
        await manager.save(costForm);
        prospect.productionCostForm = costForm;
      }
      const result = await manager.save(prospect);
      return result;
    });
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
      const result = await manager.update(ProspectProject, id, prospect);
      return result;
    });
  }

  async delete(id: number) {
    return await this.dataSource.manager.transaction(async (manager) => {
      await manager.delete(ProductionCostForm, { prospectProject: { id } });
      const result = await manager.delete(ProspectProject, id);
      return result;
    });
  }
}
