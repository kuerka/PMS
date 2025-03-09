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
@Entity('contract_invoice_record', { schema: 'pms' })
export class ContractInvoiceRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'contract_id',
    nullable: true,
    comment:
      '外键，关联合同履约信息表（contract）的 id 字段，确定该开票记录属于哪个合同的履约过程',
  })
  contractId: number | null;

  @Column('date', { name: 'invoice_time', nullable: true, comment: '开票时间' })
  invoiceTime: string | null;

  @Column('decimal', {
    name: 'invoice_amount',
    nullable: true,
    comment: '开票金额',
    precision: 15,
    scale: 2,
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

  @ManyToOne(() => Contract, (contract) => contract.contractInvoiceRecords, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_id', referencedColumnName: 'id' }])
  contract: Contract;
}
