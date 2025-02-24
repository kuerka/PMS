import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { CollaborationDepartment } from '../entities/collaboration-department.entity';

@Injectable()
export class CollaborationDepartmentService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getDepartmentByCostFormId(id: number) {
    return await this.dataSource.manager
      .getRepository(CollaborationDepartment)
      .find({ where: { productionCostForm: { id } } });
  }

  async addDepartmentByCostFormId(
    id: number,
    department?: CollaborationDepartment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    if (!department) department = new CollaborationDepartment();
    department.productionCostFormId = id;

    return await manager
      .getRepository(CollaborationDepartment)
      .insert(department);
  }
  async updateDepartment(
    department: CollaborationDepartment,
    manager?: EntityManager,
  ) {
    if (!manager) manager = this.dataSource.manager;

    return await manager
      .getRepository(CollaborationDepartment)
      .update(department.id, department);
  }
  async deleteDepartment(id: number, manager?: EntityManager) {
    if (!manager) manager = this.dataSource.manager;
    return await this.dataSource.manager.delete(CollaborationDepartment, id);
  }
}
