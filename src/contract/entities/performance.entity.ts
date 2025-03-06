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
import { ContractInvoiceRecord } from './invoice-record.entity';
import { Contract } from './contract.entity';
import { ContractReceiptRecord } from './receipt-record.entity';
import { InvoiceHeader } from './invoice-header.entity';

@Index('contract_id', ['contractId'], {})
@Index('id', ['id'], { unique: true })
@Entity('contract_performance', { schema: 'pms' })
export class ContractPerformance {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'contract_id',
    nullable: true,
    comment:
      '外键，关联合同信息表（t_contract_info）的 id 字段，用于确定是哪个合同的履约信息',
  })
  contractId: number | null;

  @Column('enum', {
    name: 'bond_type',
    nullable: true,
    enum: ['现金', '保险/保函'],
  })
  bondType: '现金' | '保险/保函' | null;

  @Column('decimal', {
    name: 'cash_bond_amount',
    nullable: true,
    precision: 10,
    scale: 0,
  })
  cashBondAmount: string | null;

  @Column('date', {
    name: 'bond_expiry_date',
    nullable: true,
    comment:
      '保险及保函形式的履约保证金到期时间，当 bond_type 为 保险/保函 时有效',
  })
  bondExpiryDate: string | null;

  @Column('decimal', {
    name: 'contract_settlement_amount',
    nullable: true,
    comment: '合同结算金额',
    precision: 10,
    scale: 0,
  })
  contractSettlementAmount: string | null;

  @Column('decimal', {
    name: 'accounts_receivable',
    nullable: true,
    comment: '应收账款',
    precision: 10,
    scale: 0,
  })
  accountsReceivable: string | null;

  @Column('enum', {
    name: 'contract_execution_status',
    nullable: true,
    comment: '合同执行情况',
    enum: ['履约中', '暂停', '终止', '履约完成'],
  })
  contractExecutionStatus: '履约中' | '暂停' | '终止' | '履约完成' | null;

  @Column('decimal', {
    name: 'accumulated_invoice_amount',
    nullable: true,
    comment: '累计开票金额',
    precision: 10,
    scale: 0,
  })
  accumulatedInvoiceAmount: string | null;

  @Column('decimal', {
    name: 'accumulated_receipt_amount',
    nullable: true,
    comment: '累计收款金额',
    precision: 10,
    scale: 0,
  })
  accumulatedReceiptAmount: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @Column('decimal', {
    name: 'uncollected_amount',
    nullable: true,
    comment: '未收账款',
    precision: 10,
    scale: 0,
  })
  uncollectedAmount: string | null;

  @OneToMany(
    () => ContractInvoiceRecord,
    (contractInvoiceRecord) => contractInvoiceRecord.contractPerformance,
  )
  contractInvoiceRecords: ContractInvoiceRecord[];

  @OneToOne(() => Contract, (contract) => contract.contractPerformance, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_id', referencedColumnName: 'id' }])
  contract: Contract;

  @OneToMany(
    () => ContractReceiptRecord,
    (contractReceiptRecord) => contractReceiptRecord.contractPerformance,
  )
  contractReceiptRecords: ContractReceiptRecord[];

  @OneToOne(
    () => InvoiceHeader,
    (invoiceHeader) => invoiceHeader.contractPerformance,
  )
  invoiceHeader: InvoiceHeader;
}
