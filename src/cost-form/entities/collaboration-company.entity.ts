import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductionCostForm } from './cost-form.entity';
import { CollaborationCompanyInvoice } from './collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from './collaboration-company-payment.entity';

@Index('id', ['id'], { unique: true })
@Index('production_cost_form_id', ['productionCostFormId'], {})
@Entity('collaboration_company', { schema: 'pms' })
export class CollaborationCompany {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'production_cost_form_id',
    nullable: true,
    comment: '外键，关联 t_production_cost_form 表的 id 字段',
  })
  productionCostFormId: number | null;

  @Column('varchar', {
    name: 'company_name',
    nullable: true,
    comment: '协作公司名称',
    length: 255,
  })
  companyName: string | null;

  @Column('decimal', {
    name: 'collaboration_amount',
    nullable: true,
    comment: '协作公司协作金额',
    precision: 10,
    scale: 0,
  })
  collaborationAmount: string | null;

  @Column('enum', {
    name: 'collaboration_amount_type',
    nullable: true,
    comment: '协作金额类型，区分是固定单价还是包干总价',
    enum: ['固定单价', '包干总价'],
  })
  collaborationAmountType: '固定单价' | '包干总价' | null;

  @Column('decimal', {
    name: 'settlement_amount',
    nullable: true,
    comment: '协作公司结算金额',
    precision: 10,
    scale: 0,
  })
  settlementAmount: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date | null;

  @Column('decimal', {
    name: 'collaboration_payable_funds',
    nullable: true,
    comment:
      '协作应支付资金，根据公式 “结算金额 *（累计收款金额 / 合同结算金额） - 累计支付金额” 计算得出；只在合同管理平台中显示，在意向登记平台中不显示',
    precision: 10,
    scale: 0,
  })
  collaborationPayableFunds: string | null;

  @ManyToOne(
    () => ProductionCostForm,
    (productionCostForm) => productionCostForm.collaborationCompanies,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'production_cost_form_id', referencedColumnName: 'id' }])
  productionCostForm: ProductionCostForm;

  @OneToMany(
    () => CollaborationCompanyInvoice,
    (collaborationCompanyInvoice) =>
      collaborationCompanyInvoice.collaborationCompanyRelation,
  )
  collaborationCompanyInvoices: CollaborationCompanyInvoice[];

  @OneToMany(
    () => CollaborationCompanyPayment,
    (collaborationCompanyPayment) =>
      collaborationCompanyPayment.collaborationCompanyRelation,
  )
  collaborationCompanyPayments: CollaborationCompanyPayment[];
}
