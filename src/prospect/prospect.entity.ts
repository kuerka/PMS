import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from '@/contract/entities/contract.entity.entity';
import { File } from '@/file/file.entity';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';

@Index('id', ['id'], { unique: true })
@Index('project_docking_stage', ['projectDockingStage'], { unique: true })
@Entity('prospect_project', { schema: 'pms' })
export class ProspectProject {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'project_name', length: 255 })
  projectName: string;

  @Column('decimal', {
    name: 'estimated_contract_amount',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  estimatedContractAmount: string | null;

  @Column('varchar', { name: 'business_personnel', length: 100 })
  businessPersonnel: string;

  @Column('varchar', {
    name: 'leading_business_department',
    nullable: true,
    length: 100,
  })
  leadingBusinessDepartment: string | null;

  @Column('varchar', {
    name: 'assisting_business_department',
    nullable: true,
    length: 100,
  })
  assistingBusinessDepartment: string | null;

  @Column('tinyint', {
    name: 'is_prior_work_started',
    nullable: true,
    comment: '如果选择“是”，自动扩展附件表单',
    width: 1,
  })
  isPriorWorkStarted: boolean | null;

  @Column('enum', {
    name: 'project_docking_stage',
    nullable: true,
    unique: true,
    enum: ['预算申请', '预算已落实', '意向公示', '招投标', '中标', '已签合同'],
  })
  projectDockingStage:
    | '预算申请'
    | '预算已落实'
    | '意向公示'
    | '招投标'
    | '中标'
    | '已签合同'
    | null;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('mediumtext', {
    name: 'remark',
    nullable: true,
    comment: '备注信息，可用于记录项目的额外说明、特殊情况等',
  })
  remark: string | null;

  @OneToOne(() => Contract, (contract) => contract.prospectProject)
  contract: Contract;

  @OneToMany(() => File, (file) => file.prospectProject)
  files: File[];

  @OneToOne(
    () => ProductionCostForm,
    (productionCostForm) => productionCostForm.prospectProject,
  )
  productionCostForm: ProductionCostForm;
}
