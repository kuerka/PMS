import { Module } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { PaymentMethodService } from './services/payment-method.service';
import { InvoiceHeaderService } from './services/invoice-header.service';
import { InvoiceRecordService } from './services/invoice-record.service';
import { ReceiptRecordService } from './services/receipt-record.service';
import {
  ContractController,
  InvoiceHeaderController,
  InvoiceRecordController,
  PaymentController,
  ReceiptRecordController,
} from './contract.controller';
import { CostFormModule } from '@/cost-form/cost-form.module';
import { AccumulateService } from './services/contract-accumulated.service';

@Module({
  imports: [CostFormModule],
  providers: [
    ContractService,
    PaymentMethodService,
    InvoiceHeaderService,
    InvoiceRecordService,
    ReceiptRecordService,
    AccumulateService,
  ],
  exports: [
    ContractService,
    PaymentMethodService,
    InvoiceHeaderService,
    InvoiceRecordService,
    ReceiptRecordService,
    AccumulateService,
  ],
  controllers: [
    ContractController,
    PaymentController,
    InvoiceHeaderController,
    InvoiceRecordController,
    ReceiptRecordController,
  ],
})
export class ContractModule {}
