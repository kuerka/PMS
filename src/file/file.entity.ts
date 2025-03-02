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
import { ProspectProject } from '@/prospect/prospect.entity';
import { Contract } from '@/contract/entities/contract.entity';

@Index('id', ['id'], { unique: true })
@Index('prospect_project_id', ['prospectProjectId'], {})
@Index('contract_id', ['contractId'], {})
@Entity('file', { schema: 'pms' })
export class File {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'prospect_project_id',
    nullable: true,
    comment:
      '外键，关联意向项目登记平台表（t_intended_project_registration）的 id 字段，若文件与意向项目登记相关',
  })
  prospectProjectId: number | null;

  @Column('int', {
    name: 'contract_id',
    nullable: true,
    comment:
      '外键，关联合同信息表（t_contract_info）的 id 字段，若文件与合同管理相关',
  })
  contractId: number | null;

  @Column('enum', {
    name: 'type',
    nullable: true,
    comment: '文件类型',
    enum: [
      '预算',
      '结算',
      '协作协议',
      '请款申请',
      '合同',
      '中标通知书',
      '检查验收报告',
      '资料移交清单',
      '其他',
    ],
  })
  type:
    | '预算'
    | '结算'
    | '协作协议'
    | '请款申请'
    | '合同'
    | '中标通知书'
    | '检查验收报告'
    | '资料移交清单'
    | '其他'
    | null;

  @Column('varchar', {
    name: 'path',
    nullable: true,
    comment: '文件存储路径',
    length: 255,
  })
  path: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('int', { name: 'size', nullable: true })
  size: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(
    () => ProspectProject,
    (prospectProject) => prospectProject.files,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'prospect_project_id', referencedColumnName: 'id' }])
  prospectProject: ProspectProject;

  @ManyToOne(() => Contract, (contract) => contract.files, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_id', referencedColumnName: 'id' }])
  contract: Contract;
}
