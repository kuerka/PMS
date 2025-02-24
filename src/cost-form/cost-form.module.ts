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

@Module({
  providers: [
    CostFormService,
    CollaborationCompanyService,
    CollaborationDepartmentService,
  ],
  exports: [
    CostFormService,
    CollaborationCompanyService,
    CollaborationDepartmentService,
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
