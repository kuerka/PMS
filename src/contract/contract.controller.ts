import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractService } from './services/contract.service';
import {
  ContractDto,
  ContractQueryDto,
  ContractUpdateDto,
} from './dto/contract.dto';
import { Public } from '@/auth/auth.decorators';
import { UpdatePerformanceDto } from './dto/performance.dto';
import { PerformanceService } from './services/performance.service';
import { PaymentMethodService } from './services/payment-method.service';
import { CreatePaymentDto } from './dto/payment-method.dto';
import { InvoiceHeaderService } from './services/invoice-header.service';
import { CreateInvoiceHeaderDto } from './dto/invoice-header.dto';
import { InvoiceRecordService } from './services/invoice-record.service';
import { ReceiptRecordService } from './services/receipt-record.service';
import {
  CreateInvoiceRecordDto,
  UpdateInvoiceRecordDto,
} from './dto/invoice-record.dto';
import {
  CreateReceiptRecordDto,
  UpdateReceiptRecordDto,
} from './dto/receipt_record.dto';

@Public()
@Controller('contract')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post('add')
  async createContract(@Body() contractDto: ContractDto) {
    console.log(contractDto);
    const contract = this.contractService.createContract(contractDto);
    return await this.contractService.addContractTransition(contract);
  }
  @Post('page')
  async getContractPage(@Body() contractQueryDto: ContractQueryDto) {
    return await this.contractService.getContractPage(contractQueryDto);
  }
  @Get('detail')
  async getContractDetail(@Query('id') id: number) {
    return await this.contractService.getContractDetailsById(id);
  }
  @Post('update')
  async updateContract(@Body() contractDto: ContractUpdateDto) {
    const contract = this.contractService.createContract(contractDto);
    console.log(contract);
    return await this.contractService.updateContractTransition(contract);
  }
  @Post('delete')
  async deleteContract(@Param('id') id: number) {
    return await this.contractService.deleteContract(id);
  }
}

@Public()
@Controller('contract/performance')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PerformanceController {
  constructor(private performanceService: PerformanceService) {}
  @Get('detail')
  async getPerformance(@Query('contractId') contractId: number) {
    return await this.performanceService.getByContractId(contractId);
  }
  @Post('update')
  async updatePerformance(@Body() performanceDto: UpdatePerformanceDto) {
    const { id } = performanceDto;
    const performance = this.performanceService.create(performanceDto);
    return await this.performanceService.updateById(id, performance);
  }
  @Post('delete')
  async deletePerformance(@Body('contractId') contractId: number) {
    return await this.performanceService.deleteByContractId(contractId);
  }
}

@Public()
@Controller('contract/payment')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PaymentController {
  constructor(private paymentService: PaymentMethodService) {}
  @Post('add')
  async addPaymentByContractId(@Body() paymentDto: CreatePaymentDto) {
    const payment = this.paymentService.create(paymentDto);
    return await this.paymentService.addPaymentMethod(payment);
  }
  @Get('detail')
  async getPaymentByContractId(@Query('contractId') contractId: number) {
    return await this.paymentService.getPaymentMethodByContractId(contractId);
  }
  @Post('update')
  async updatePaymentByContractId(@Body() paymentDto: UpdatePerformanceDto) {
    const payment = this.paymentService.create(paymentDto);
    const { id } = payment;
    return await this.paymentService.updatePaymentMethod(id, payment);
  }
  @Post('delete')
  async deletePaymentByContractId(@Body('id') id: number) {
    return await this.paymentService.deletePaymentMethod(id);
  }
}

@Public()
@Controller('contract/invoiceHeader')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class InvoiceHeaderController {
  constructor(private invoiceHeaderService: InvoiceHeaderService) {}
  @Post('add')
  async addInvoiceHeaderWithPerformanceId(
    @Body() invoiceHeaderDto: CreateInvoiceHeaderDto,
  ) {
    const invoiceHeader = this.invoiceHeaderService.create(invoiceHeaderDto);
    const { contractPerformanceId } = invoiceHeaderDto;
    return await this.invoiceHeaderService.addWithPerformanceId(
      contractPerformanceId,
      invoiceHeader,
    );
  }
  @Get('detail')
  async getCostFormByPerformanceId(@Query('performanceId') id: number) {
    return await this.invoiceHeaderService.getByPerformanceId(id);
  }
  @Post('update')
  async updateInvoiceHeader(@Body() invoiceHeaderDto: UpdatePerformanceDto) {
    const invoiceHeader = this.invoiceHeaderService.create(invoiceHeaderDto);
    const { id } = invoiceHeader;
    return await this.invoiceHeaderService.update(id, invoiceHeader);
  }
  @Post('delete')
  async deleteInvoiceHeader(@Body('id') id: number) {
    return await this.invoiceHeaderService.delete(id);
  }
}

@Public()
@Controller('contract/invoiceRecord')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class InvoiceRecordController {
  constructor(private invoiceRecordService: InvoiceRecordService) {}

  @Post('add')
  async addInvoiceRecordWithPerformanceId(
    @Body() invoiceRecordDto: CreateInvoiceRecordDto,
  ) {
    const invoiceRecord = this.invoiceRecordService.create(invoiceRecordDto);
    const { contractPerformanceId } = invoiceRecordDto;
    return await this.invoiceRecordService.addWithPerformanceId(
      contractPerformanceId,
      invoiceRecord,
    );
  }

  @Get('detail')
  async getInvoiceRecordByPerformanceId(@Query('performanceId') id: number) {
    return await this.invoiceRecordService.getByPerformanceId(id);
  }

  @Post('update')
  async updateInvoiceRecord(@Body() invoiceRecordDto: UpdateInvoiceRecordDto) {
    const invoiceRecord = this.invoiceRecordService.create(invoiceRecordDto);
    const { id } = invoiceRecordDto;
    return await this.invoiceRecordService.update(id, invoiceRecord);
  }

  @Post('delete')
  async deleteInvoiceRecord(@Body('id') id: number) {
    return await this.invoiceRecordService.delete(id);
  }
}

@Public()
@Controller('contract/receiptRecord')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ReceiptRecordController {
  constructor(private receiptRecordService: ReceiptRecordService) {}

  @Post('add')
  async addReceiptRecordWithPerformanceId(
    @Body() receiptRecordDto: CreateReceiptRecordDto,
  ) {
    const receiptRecord = this.receiptRecordService.create(receiptRecordDto);
    const { contractPerformanceId } = receiptRecordDto;
    return await this.receiptRecordService.addWithPerformanceId(
      contractPerformanceId,
      receiptRecord,
    );
  }

  @Get('detail')
  async getReceiptRecordByPerformanceId(@Query('performanceId') id: number) {
    return await this.receiptRecordService.getByPerformanceId(id);
  }

  @Post('update')
  async updateReceiptRecord(@Body() receiptRecordDto: UpdateReceiptRecordDto) {
    const receiptRecord = this.receiptRecordService.create(receiptRecordDto);
    const { id } = receiptRecordDto;
    return await this.receiptRecordService.update(id, receiptRecord);
  }

  @Post('delete')
  async deleteReceiptRecord(@Body('id') id: number) {
    return await this.receiptRecordService.delete(id);
  }
}
