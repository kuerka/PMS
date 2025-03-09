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
@Entity('contract_receipt_record', { schema: 'pms' })
export class ContractReceiptRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'contract_id',
    nullable: true,
    comment:
      '外键，关联合同履约信息表（contract）的 id 字段，确定该收款记录属于哪个合同的履约过程',
  })
  contractId: number | null;

  @Column('date', { name: 'receipt_time', nullable: true })
  receiptTime: string | null;

  @Column('decimal', {
    name: 'receipt_amount',
    nullable: true,
    precision: 15,
    scale: 2,
  })
  receiptAmount: string | null;

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
