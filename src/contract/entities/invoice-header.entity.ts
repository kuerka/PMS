import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractPerformance } from './performance.entity';

@Index('contract_performance_id', ['contractPerformanceId'], {})
@Index('id', ['id'], { unique: true })
@Entity('invoice_header', { schema: 'pms' })
export class InvoiceHeader {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'company_name', nullable: true, length: 255 })
  companyName: string | null;

  @Column('varchar', { name: 'contact_phone', nullable: true, length: 20 })
  contactPhone: string | null;

  @Column('varchar', {
    name: 'taxpayer_identification_number',
    nullable: true,
    comment: '纳税人识别号',
    length: 20,
  })
  taxpayerIdentificationNumber: string | null;

  @Column('varchar', { name: 'bank_account', nullable: true, length: 50 })
  bankAccount: string | null;

  @Column('varchar', { name: 'bank_name', nullable: true, length: 100 })
  bankName: string | null;

  @Column('mediumtext', { name: 'address', nullable: true })
  address: string | null;

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('int', { name: 'contract_performance_id', nullable: true })
  contractPerformanceId: number | null;

  @OneToOne(
    () => ContractPerformance,
    (contractPerformance) => contractPerformance.invoiceHeader,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'contract_performance_id', referencedColumnName: 'id' }])
  contractPerformance: ContractPerformance;
}
