import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { CollaborationDepartment } from '../entities/collaboration-department.entity';

@Injectable()
export class CollaborationDepartmentService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  create(department: DeepPartial<CollaborationDepartment>) {
    return this.dataSource.manager
      .getRepository(CollaborationDepartment)
      .create(department);
  }

  async getDepartmentByCostFormId(id: number) {
    return await this.dataSource.manager
      .getRepository(CollaborationDepartment)
      .find({ where: { productionCostForm: { id } } });
  }

  async addDepartmentByCostFormId(
    id: number,
    department: CollaborationDepartment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(CollaborationDepartment)
      .save(department);
  }
  async updateDepartment(
    department: CollaborationDepartment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(CollaborationDepartment)
      .save(department);
  }
  async deleteDepartment(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await this.dataSource.manager.delete(CollaborationDepartment, id);
  }
  async deleteByCostFormId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await manager.delete(CollaborationDepartment, {
      productionCostFormId: id,
    });
  }
}
