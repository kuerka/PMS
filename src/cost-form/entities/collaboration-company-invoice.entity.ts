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
import { CollaborationCompany } from './collaboration-company.entity';

@Index('company_id', ['companyId'], {})
@Index('id', ['id'], { unique: true })
@Entity('collaboration_company_invoice', { schema: 'pms' })
export class CollaborationCompanyInvoice {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'company_id',
    nullable: true,
    comment: '外键，关联 t_collaboration_company_relation 表的 id 字段',
  })
  companyId: number | null;

  @Column('decimal', {
    name: 'invoice_amount',
    nullable: true,
    comment: '本次收票金额',
    precision: 10,
    scale: 0,
  })
  invoiceAmount: string | null;

  @Column('date', { name: 'invoice_time', nullable: true })
  invoiceTime: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(
    () => CollaborationCompany,
    (collaborationCompany) => collaborationCompany.collaborationCompanyInvoices,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  collaborationCompanyRelation: CollaborationCompany;
}
