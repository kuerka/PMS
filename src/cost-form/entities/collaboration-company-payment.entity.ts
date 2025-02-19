import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CollaborationCompany } from './collaboration-company.entity';

@Index(
  'collaboration_company_relation_id',
  ['collaborationCompanyRelationId'],
  {},
)
@Index('id', ['id'], { unique: true })
@Entity('collaboration_company_payment', { schema: 'pms' })
export class CollaborationCompanyPayment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'collaboration_company_relation_id',
    nullable: true,
    comment: '外键，关联 t_collaboration_company_relation 表的 id 字段',
  })
  collaborationCompanyRelationId: number | null;

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

  @Column('datetime', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(
    () => CollaborationCompany,
    (collaborationCompany) => collaborationCompany.collaborationCompanyPayments,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([
    { name: 'collaboration_company_relation_id', referencedColumnName: 'id' },
  ])
  collaborationCompanyRelation: CollaborationCompany;
}
