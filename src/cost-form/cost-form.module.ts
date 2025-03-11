import { Module } from '@nestjs/common';
import { CostFormService } from './cost-form.service';
import {
  CompanyController,
  CompanyInvoiceController,
  CompanyPaymentController,
  CostFormController,
  DepartmentController,
} from './cost-form.controller';
import { CollaborationCompanyService } from './services/collaboration-company.service';
import { CollaborationDepartmentService } from './services/collaboration-department.service';
import { CollaborationCompanyInvoiceService } from './services/collaboration-company-invoice.service';
import { CollaborationCompanyPaymentService } from './services/collaboration-company-payment.service';
import { CostFormAccumulatedService } from './services/costForm-accumulated.service';

@Module({
  providers: [
    CostFormService,
    CollaborationCompanyService,
    CollaborationDepartmentService,
    CollaborationCompanyInvoiceService,
    CollaborationCompanyPaymentService,
    CostFormAccumulatedService,
  ],
  exports: [
    CostFormService,
    CollaborationCompanyService,
    CollaborationDepartmentService,
    CollaborationCompanyInvoiceService,
    CollaborationCompanyPaymentService,
    CostFormAccumulatedService,
  ],
  controllers: [
    CostFormController,
    CompanyController,
    CompanyInvoiceController,
    CompanyPaymentController,
    DepartmentController,
  ],
})
export class CostFormModule {}
