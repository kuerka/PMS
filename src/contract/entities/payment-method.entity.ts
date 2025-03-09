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
import { Contract } from './contract.entity';

@Index('contract_id', ['contractId'], {})
@Index('id', ['id'], { unique: true })
@Entity('contract_payment_method', { schema: 'pms' })
export class ContractPaymentMethod {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'contract_id',
    nullable: true,
    comment: '外键，关联合同信息表的 id 字段',
  })
  contractId: number | null;

  @Column('mediumtext', {
    name: 'condition_description',
    nullable: true,
    comment: '付款条件描述，如 “达到条件 1,付款百分之XX”',
  })
  conditionDescription: string | null;

  @Column('tinyint', {
    name: 'condition_process_status',
    nullable: true,
    comment: '付款条件是否触发',
    width: 1,
  })
  conditionProcessStatus: boolean | null;

  @Column('decimal', {
    name: 'accounts',
    nullable: true,
    comment: '对应此收款条件的具体的应该收款的数额',
    precision: 15,
    scale: 2,
  })
  accounts: string | null;

  @Column('tinyint', {
    name: 'accounts_status',
    nullable: true,
    comment: '与项目累计收款金额对比，大于累计收款金额为true，小于为false',
    width: 1,
    default: () => "'0'",
  })
  accountsStatus: boolean | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(() => Contract, (contract) => contract.contractPaymentMethods, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_id', referencedColumnName: 'id' }])
  contract: Contract;
}
