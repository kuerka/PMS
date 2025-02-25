import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Contract } from '../entities/contract.entity.entity';
import { PaginationDto } from '@/pagination/pagination.dto';

@Injectable()
export class ContractService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async addContract(manager: EntityManager, contract: Contract) {
    return await manager.getRepository(Contract).insert(contract);
  }

  async getContractList(queryDto: PaginationDto) {
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
      },
    });
  }
  async updateContract(manager: EntityManager, contract: Contract) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).update(contract.id, contract);
  }
  async deleteContract(manager: EntityManager, id: number) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.getRepository(Contract).delete(id);
  }
}
