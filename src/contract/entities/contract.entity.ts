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
import { ProspectProject } from '@/prospect/prospect.entity';
import { ContractPaymentMethod } from './payment-method.entity';
import { File } from '@/file/file.entity';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { ContractInvoiceRecord } from './invoice-record.entity';
import { ContractReceiptRecord } from './receipt-record.entity';
import { InvoiceHeader } from './invoice-header.entity';

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
    precision: 15,
    scale: 2,
  })
  contractAmount: string | null;

  @Column('date', { name: 'project_start_date', nullable: true })
  projectStartDate: string | null;

  @Column('date', { name: 'project_end_date', nullable: true })
  projectEndDate: string | null;

  @Column('enum', {
    name: 'bond_type',
    nullable: true,
    comment: '合约类型',
    enum: ['现金', '保险/保函'],
  })
  bondType: '现金' | '保险/保函' | null;

  @Column('decimal', {
    name: 'cash_bond_amount',
    nullable: true,
    comment: '合约类型数额',
    precision: 15,
    scale: 2,
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
    precision: 15,
    scale: 2,
  })
  contractSettlementAmount: string | null;

  @Column('decimal', {
    name: 'accounts_receivable',
    nullable: true,
    comment: '应收账款',
    precision: 15,
    scale: 2,
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
    precision: 15,
    scale: 2,
  })
  accumulatedInvoiceAmount: string | null;

  @Column('decimal', {
    name: 'accumulated_receipt_amount',
    nullable: true,
    comment: '累计收款金额',
    precision: 15,
    scale: 2,
  })
  accumulatedReceiptAmount: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
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

  @Column('decimal', {
    name: 'uncollected_amount',
    nullable: true,
    comment: '未收账款',
    precision: 15,
    scale: 2,
  })
  uncollectedAmount: string | null;

  @OneToOne(
    () => ProspectProject,
    (prospectProject) => prospectProject.contract,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'prospect_project_id', referencedColumnName: 'id' }])
  prospectProject: ProspectProject;

  @OneToMany(
    () => ContractInvoiceRecord,
    (contractInvoiceRecord) => contractInvoiceRecord.contract,
  )
  contractInvoiceRecords: ContractInvoiceRecord[];

  @OneToMany(
    () => ContractPaymentMethod,
    (contractPaymentMethod) => contractPaymentMethod.contract,
  )
  contractPaymentMethods: ContractPaymentMethod[];

  @OneToMany(
    () => ContractReceiptRecord,
    (contractReceiptRecord) => contractReceiptRecord.contract,
  )
  contractReceiptRecords: ContractReceiptRecord[];

  @OneToMany(() => File, (file) => file.contract)
  files: File[];

  @OneToOne(() => InvoiceHeader, (invoiceHeader) => invoiceHeader.contract)
  invoiceHeader: InvoiceHeader;

  @OneToOne(
    () => ProductionCostForm,
    (productionCostForm) => productionCostForm.contract,
  )
  productionCostForm: ProductionCostForm;
}
