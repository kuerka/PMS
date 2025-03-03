import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductionCostForm } from './cost-form.entity';

@Index('id', ['id'], { unique: true })
@Index('production_cost_form_id', ['productionCostFormId'], {})
@Entity('collaboration_department', { schema: 'pms' })
export class CollaborationDepartment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'production_cost_form_id',
    nullable: true,
    comment: '外键，关联 t_production_cost_form 表的 id 字段',
  })
  productionCostFormId: number | null;

  @Column('varchar', {
    name: 'department_name',
    nullable: true,
    comment: '协作部门名称',
    length: 100,
  })
  departmentName: string | null;

  @Column('decimal', {
    name: 'budget_amount',
    nullable: true,
    comment: '协作部门预算金额',
    precision: 10,
    scale: 0,
  })
  budgetAmount: string | null;

  @Column('decimal', {
    name: 'budget_execution_amount',
    nullable: true,
    comment: '协作部门预算执行金额',
    precision: 10,
    scale: 0,
  })
  budgetExecutionAmount: string | null;

  @Column('decimal', {
    name: 'settlement_amount',
    nullable: true,
    comment: '协作部门结算金额',
    precision: 10,
    scale: 0,
  })
  settlementAmount: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(
    () => ProductionCostForm,
    (productionCostForm) => productionCostForm.collaborationDepartments,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'production_cost_form_id', referencedColumnName: 'id' }])
  productionCostForm: ProductionCostForm;
}
