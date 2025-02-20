import { Injectable } from '@nestjs/common';
import { ProspectProject } from './prospect.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';

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
      relations: {
        productionCostForm: true,
      },
    });
  }
}
