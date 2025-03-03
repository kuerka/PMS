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
import { ContractPerformance } from './performance.entity';

@Index('contract_performance_id', ['contractPerformanceId'], {})
@Index('id', ['id'], { unique: true })
@Entity('contract_receipt_record', { schema: 'pms' })
export class ContractReceiptRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'contract_performance_id',
    nullable: true,
    comment:
      '外键，关联合同履约信息表（t_contract_performance_info）的 id 字段，确定该收款记录属于哪个合同的履约过程',
  })
  contractPerformanceId: number | null;

  @Column('date', { name: 'receipt_time', nullable: true })
  receiptTime: string | null;

  @Column('decimal', {
    name: 'receipt_amount',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  receiptAmount: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(
    () => ContractPerformance,
    (contractPerformance) => contractPerformance.contractReceiptRecords,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'contract_performance_id', referencedColumnName: 'id' }])
  contractPerformance: ContractPerformance;
}
