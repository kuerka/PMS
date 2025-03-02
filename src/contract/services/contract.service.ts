import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { PaginationDto } from '@/pagination/pagination.dto';
import { CostFormService } from '@/cost-form/cost-form.service';
import { PerformanceService } from './performance.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private costFormService: CostFormService,
    private performanceService: PerformanceService,
  ) {}

  createContract(contract: DeepPartial<Contract>) {
    return this.dataSource.manager.create(Contract, contract);
  }

  async addContractTransition(contract: Contract) {
    return await this.dataSource.manager.transaction(async (manager) => {
      console.log(contract);
      const res = await this.addContract(contract, manager);
      const costForm = this.costFormService.create(contract.productionCostForm);
      costForm.contract = res;
      await this.costFormService.add(costForm, manager);
      const performance = this.performanceService.create();
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

  async getContractPage(queryDto: PaginationDto) {
    const { page, limit } = queryDto;
    const [prospects, total] = await this.dataSource.manager.findAndCount(
      Contract,
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

  async getContractDetailsById(id: number) {
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
  async deleteContract(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).delete(id);
  }
}
