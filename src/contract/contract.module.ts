import { Module } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { PaymentMethodService } from './services/payment-method.service';
import { PerformanceService } from './services/performance.service';
import { InvoiceHeaderService } from './services/invoice-header.entity';
import { InvoiceRecordService } from './services/invoice-record.service';
import { ReceiptRecordService } from './services/receipt-record.service';
import { ContractController } from './contract.controller';

@Module({
  providers: [
    ContractService,
    PaymentMethodService,
    PerformanceService,
    InvoiceHeaderService,
    InvoiceRecordService,
    ReceiptRecordService,
  ],
  exports: [
    ContractService,
    PaymentMethodService,
    PerformanceService,
    InvoiceHeaderService,
    InvoiceRecordService,
    ReceiptRecordService,
  ],
  controllers: [ContractController],
})
export class ContractModule {}
