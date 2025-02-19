import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './contract.entity.entity';

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

  @Column('enum', {
    name: 'condition_process_status',
    nullable: true,
    comment: '付款条件是否触发以及是否完成对应收款',
    enum: ['未触发', '触发已完成', '触发未完成'],
  })
  conditionProcessStatus: '未触发' | '触发已完成' | '触发未完成' | null;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Contract, (contract) => contract.contractPaymentMethods, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_id', referencedColumnName: 'id' }])
  contract: Contract;
}
