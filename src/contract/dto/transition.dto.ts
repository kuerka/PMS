import { CollaborationCompanyInvoice } from '@/cost-form/entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '@/cost-form/entities/collaboration-company-payment.entity';
import { CollaborationCompany } from '@/cost-form/entities/collaboration-company.entity';
import { ProductionCostForm } from '@/cost-form/entities/cost-form.entity';
import { CollaborationDepartment } from '@/cost-form/entities/collaboration-department.entity';
import { ClassConstructor, Expose, plainToInstance } from 'class-transformer';

export class TransitionCostDto implements Partial<ProductionCostForm> {
  contractId: number;
  @Expose()
  leadingDepartment: string;
  @Expose()
  projectCompletionProgress: string;
  @Expose()
  projectCompletionDescription: string;
  @Expose()
  totalBudgetAmount: string;
  @Expose()
  totalSettlementAmount: string;
  @Expose()
  accumulatedInvoiceAmount: string;
  @Expose()
  accumulatedPaymentAmount: string;
  @Expose()
  remark: string;
}

export class TransitionCompanyDto implements Partial<CollaborationCompany> {
  productionCostFormId: number;
  @Expose()
  companyName: string;
  @Expose()
  collaborationAmount: string | null;
  @Expose()
  collaborationAmountType: '固定单价' | '包干总价';
  @Expose()
  settlementAmount: string | null;
}

export class TransitionInvoiceDto
  implements Partial<CollaborationCompanyInvoice>
{
  companyId: number;
  @Expose()
  companyName: string;
  @Expose()
  invoiceAmount: string;
  @Expose()
  invoiceTime: string;
  @Expose()
  settlementAmount: string;
}

export class TransitionPaymentDto
  implements Partial<CollaborationCompanyPayment>
{
  companyId: number;
  @Expose()
  paymentAmount: string;
  @Expose()
  paymentTime: string;
}

export class TransitionDepartmentDto
  implements Partial<CollaborationDepartment>
{
  productionCostFormId: number;
  @Expose()
  departmentName: string;
  @Expose()
  budgetAmount: string;
  @Expose()
  budgetExecutionAmount: string;
  @Expose()
  settlementAmount: string;
}

export function transDto<T, V>(dto: ClassConstructor<T>, ins: V) {
  return plainToInstance(dto, ins, { excludeExtraneousValues: true });
}
