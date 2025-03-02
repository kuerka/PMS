import { Exclude } from 'class-transformer';
import { CollaborationCompany } from '../entities/collaboration-company.entity';
import { ProductionCostForm } from '../entities/cost-form.entity';
import { CollaborationCompanyInvoice } from '../entities/collaboration-company-invoice.entity';
import { CollaborationCompanyPayment } from '../entities/collaboration-company-payment.entity';

export class CompanyDto extends CollaborationCompany {
  @Exclude()
  id: number;
}

export class CompanyUpdateDto extends CollaborationCompany {
  @Exclude()
  productionCostFormId: number | null;
  @Exclude()
  productionCostForm: ProductionCostForm;
}

export class CompanyInvoiceDto extends CollaborationCompanyInvoice {
  @Exclude()
  id: number;
}

export class CompanyPaymentDto extends CollaborationCompanyPayment {
  @Exclude()
  id: number;
}
