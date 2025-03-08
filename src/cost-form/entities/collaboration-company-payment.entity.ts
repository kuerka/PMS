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
@Entity('collaboration_company_payment', { schema: 'pms' })
export class CollaborationCompanyPayment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'company_id',
    nullable: true,
    comment: '外键，关联 t_collaboration_company_relation 表的 id 字段',
  })
  companyId: number | null;

  @Column('decimal', {
    name: 'payment_amount',
    nullable: true,
    comment: '本次支付金额',
    precision: 10,
    scale: 0,
  })
  paymentAmount: string | null;

  @Column('date', { name: 'payment_time', nullable: true, comment: '支付时间' })
  paymentTime: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @ManyToOne(
    () => CollaborationCompany,
    (collaborationCompany) => collaborationCompany.collaborationCompanyPayments,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  CollaborationCompany: CollaborationCompany;
}
