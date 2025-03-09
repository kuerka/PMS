import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractService } from './services/contract.service';
import {
  CreateContractDto,
  QueryContractDto,
  UpdateContractDto,
} from './dto/contract.dto';
import { Public } from '@/auth/auth.decorators';
import { PaymentMethodService } from './services/payment-method.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment-method.dto';
import { InvoiceHeaderService } from './services/invoice-header.service';
import {
  CreateInvoiceHeaderDto,
  UpdateInvoiceHeaderDto,
} from './dto/invoice-header.dto';
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
  async createContract(@Body() contractDto: CreateContractDto) {
    const contract = this.contractService.createContract(contractDto);
    return await this.contractService.addContractTransition(contract);
  }
  @Post('page')
  async getContractPage(@Body() queryContractDto: QueryContractDto) {
    return await this.contractService.getContractPage(queryContractDto);
  }
  @Get('simple')
  async getContractSimple(@Query('id') id: number) {
    return await this.contractService.getContractSimpleById(id);
  }
  @Get('detail')
  async getContractDetail(@Query('id') id: number) {
    return await this.contractService.getContractDetailsById(id);
  }
  @Post('update')
  async updateContract(@Body() contractDto: UpdateContractDto) {
    const contract = this.contractService.createContract(contractDto);
    return await this.contractService.updateContractTransition(contract);
  }
  @Post('delete')
  async deleteContract(@Body('id') id: number) {
    return await this.contractService.deleteContractTransition(id);
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
  @Get('list')
  async getPaymentByContractId(@Query('contractId') contractId: number) {
    if (!contractId) return [];
    return await this.paymentService.getPaymentMethodByContractId(contractId);
  }
  @Post('update')
  async updatePaymentByContractId(@Body() paymentDto: UpdatePaymentDto) {
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
  async addInvoiceHeaderWithContractId(
    @Body() invoiceHeaderDto: CreateInvoiceHeaderDto,
  ) {
    const invoiceHeader = this.invoiceHeaderService.create(invoiceHeaderDto);
    const { contractId } = invoiceHeaderDto;
    return await this.invoiceHeaderService.addWithContractId(
      contractId,
      invoiceHeader,
    );
  }
  @Get('list')
  async getCostFormByContractId(@Query('contractId') id: number) {
    if (!id) return;
    return await this.invoiceHeaderService.getByContractId(id);
  }
  @Post('update')
  async updateInvoiceHeader(@Body() invoiceHeaderDto: UpdateInvoiceHeaderDto) {
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
  async addInvoiceRecordWithContractId(
    @Body() invoiceRecordDto: CreateInvoiceRecordDto,
  ) {
    const invoiceRecord = this.invoiceRecordService.create(invoiceRecordDto);
    const { contractId } = invoiceRecordDto;
    return await this.invoiceRecordService.addWithContractId(
      contractId,
      invoiceRecord,
    );
  }

  @Get('list')
  async getInvoiceRecordByContractId(@Query('contractId') id: number) {
    if (!id) return [];
    return await this.invoiceRecordService.getByContractId(id);
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
  async addReceiptRecordWithContractId(
    @Body() receiptRecordDto: CreateReceiptRecordDto,
  ) {
    const receiptRecord = this.receiptRecordService.create(receiptRecordDto);
    const { contractId } = receiptRecordDto;
    return await this.receiptRecordService.addWithContractId(
      contractId,
      receiptRecord,
    );
  }

  @Get('list')
  async getReceiptRecordByContractId(@Query('contractId') id: number) {
    if (!id) return [];
    return await this.receiptRecordService.getByContractId(id);
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
