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
@Entity('contract_invoice_record', { schema: 'pms' })
export class ContractInvoiceRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'contract_performance_id',
    nullable: true,
    comment:
      '外键，关联合同履约信息表（t_contract_performance_info）的 id 字段，确定该开票记录属于哪个合同的履约过程',
  })
  contractPerformanceId: number | null;

  @Column('date', { name: 'invoice_time', nullable: true, comment: '开票时间' })
  invoiceTime: string | null;

  @Column('decimal', {
    name: 'invoice_amount',
    nullable: true,
    comment: '开票金额',
    precision: 10,
    scale: 0,
  })
  invoiceAmount: string | null;

  @Column('enum', {
    name: 'invoice_type',
    nullable: true,
    enum: ['增值税专用发票', '增值税普通发票'],
  })
  invoiceType: '增值税专用发票' | '增值税普通发票' | null;

  @Column('mediumtext', { name: 'remark', nullable: true })
  remark: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(
    () => ContractPerformance,
    (contractPerformance) => contractPerformance.contractInvoiceRecords,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'contract_performance_id', referencedColumnName: 'id' }])
  contractPerformance: ContractPerformance;
}
