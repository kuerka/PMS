import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProspectProject } from '@/prospect/prospect.entity';
import { ContractPaymentMethod } from './payment-method.entity';
import { ContractPerformance } from './performance.entity';
import { File } from '@/file/file.entity';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';

@Index('id', ['id'], { unique: true })
@Index('prospect_project_id', ['prospectProjectId'], {})
@Entity('contract', { schema: 'pms' })
export class Contract {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'prospect_project_id',
    nullable: true,
    comment: '外键，关联合同意向表的ID',
  })
  prospectProjectId: number | null;

  @Column('varchar', { name: 'contract_number', length: 50 })
  contractNumber: string;

  @Column('varchar', { name: 'project_name', nullable: true, length: 255 })
  projectName: string | null;

  @Column('varchar', { name: 'project_type', nullable: true, length: 255 })
  projectType: string | null;

  @Column('varchar', { name: 'project_location', nullable: true, length: 255 })
  projectLocation: string | null;

  @Column('varchar', { name: 'owner', nullable: true, length: 255 })
  owner: string | null;

  @Column('enum', {
    name: 'amount_type',
    nullable: true,
    comment: '合同金额类型：包干或单价',
    enum: ['包干总价', '固定单价'],
  })
  amountType: '包干总价' | '固定单价' | null;

  @Column('decimal', {
    name: 'contract_amount',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  contractAmount: string | null;

  @Column('date', { name: 'project_start_date', nullable: true })
  projectStartDate: string | null;

  @Column('date', { name: 'project_end_date', nullable: true })
  projectEndDate: string | null;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('mediumtext', { name: 'remark', nullable: true })
  remark: string | null;

  @Column('tinyint', {
    name: 'is_preliminary_number',
    nullable: true,
    comment: '判断合同编号contract_number是否为预编号',
    width: 1,
    default: () => "'0'",
  })
  isPreliminaryNumber: boolean | null;

  @ManyToOne(
    () => ProspectProject,
    (prospectProject) => prospectProject.contract,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'prospect_project_id', referencedColumnName: 'id' }])
  prospectProject: ProspectProject;

  @OneToOne(
    () => ContractPaymentMethod,
    (contractPaymentMethod) => contractPaymentMethod.contract,
  )
  contractPaymentMethods: ContractPaymentMethod[];

  @OneToOne(
    () => ContractPerformance,
    (contractPerformance) => contractPerformance.contract,
  )
  contractPerformance: ContractPerformance;

  @OneToMany(() => File, (file) => file.contract)
  files: File[];

  @OneToOne(
    () => ProductionCostForm,
    (productionCostForm) => productionCostForm.contract,
  )
  productionCostForm: ProductionCostForm;
}
