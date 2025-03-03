import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CollaborationCompany } from './collaboration-company.entity';
import { CollaborationDepartment } from './collaboration-department.entity';
import { ProspectProject } from '@/prospect/prospect.entity';
import { Contract } from '@/contract/entities/contract.entity';

@Index('contract_id', ['contractId'], {})
@Index('id', ['id'], { unique: true })
@Index('prospect_project_id', ['prospectProjectId'], {})
@Entity('production_cost_form', { schema: 'pms' })
export class ProductionCostForm {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'leading_department',
    nullable: true,
    length: 100,
  })
  leadingDepartment: string | null;

  @Column('decimal', {
    name: 'project_completion_progress',
    nullable: true,
    comment: '项目完成进度，范围 0.00 - 100.00，表示 0 - 100%',
    precision: 10,
    scale: 0,
    default: () => "'0'",
  })
  projectCompletionProgress: string | null;

  @Column('decimal', {
    name: 'total_budget_amount',
    nullable: true,
    comment: '预算总金额',
    precision: 10,
    scale: 0,
  })
  totalBudgetAmount: string | null;

  @Column('decimal', {
    name: 'total_budget_execution_amount',
    nullable: true,
    comment: '预算执行总金额',
    precision: 10,
    scale: 0,
  })
  totalBudgetExecutionAmount: string | null;

  @Column('decimal', {
    name: 'total_settlement_amount',
    nullable: true,
    comment: '结算总金额',
    precision: 10,
    scale: 0,
  })
  totalSettlementAmount: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @Column('mediumtext', {
    name: 'remark',
    nullable: true,
    comment: '备注信息，可用于记录项目的额外说明、特殊情况等',
  })
  remark: string | null;

  @Column('int', { name: 'prospect_project_id', nullable: true })
  prospectProjectId: number | null;

  @Column('int', { name: 'contract_id', nullable: true })
  contractId: number | null;

  @Column('mediumtext', {
    name: 'project_completion_description',
    nullable: true,
    comment:
      '进度进展描述，在填写百分比进度时填写，描述该项目的阶段进展与工作量',
  })
  projectCompletionDescription: string | null;

  @OneToMany(
    () => CollaborationCompany,
    (collaborationCompany) => collaborationCompany.productionCostForm,
  )
  collaborationCompanies: CollaborationCompany[];

  @OneToMany(
    () => CollaborationDepartment,
    (collaborationDepartment) => collaborationDepartment.productionCostForm,
  )
  collaborationDepartments: CollaborationDepartment[];

  @OneToOne(
    () => ProspectProject,
    (prospectProject) => prospectProject.productionCostForm,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'prospect_project_id', referencedColumnName: 'id' }])
  prospectProject: ProspectProject;

  @OneToOne(() => Contract, (contract) => contract.productionCostForm, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_id', referencedColumnName: 'id' }])
  contract: Contract;
}
