import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractService } from './services/contract.service';
import {
  CreateContractDto,
  QueryContractDto,
  TransitionContractDto,
  UpdateContractDto,
} from './dto/contract.dto';
import { Roles } from '@/auth/auth.decorators';
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
import { Request } from 'express';
import { ANY_ROLE, LIMIT_ADMIN } from '@/auth/constants';

@Roles(...ANY_ROLE)
@Controller('contract')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Roles(LIMIT_ADMIN)
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
  async getContractSimple(@Query('id', ParseIntPipe) id: number) {
    return await this.contractService.getContractSimpleById(id);
  }
  @Get('detail')
  async getContractDetail(@Query('id', ParseIntPipe) id: number) {
    return await this.contractService.getContractDetailsById(id);
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateContract(
    @Body() contractDto: UpdateContractDto,
    @Req() req: Request,
  ) {
    const contract = this.contractService.createContract(contractDto);
    await this.contractService.logHandleCompany(req, contract.id, '修改');
    return await this.contractService.updateContractTransition(contract);
  }
  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteContract(
    @Body('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.contractService.logHandleCompany(req, id, '删除');
    return await this.contractService.deleteContractTransition(id);
  }

  @Post('transition')
  async addContractTransition(@Body() contractDto: TransitionContractDto) {
    const prospectId = contractDto.prospectProjectId;
    const contract = this.contractService.createContract(contractDto);
    await this.contractService.createContractTransition(prospectId, contract);
  }
}

@Roles(...ANY_ROLE)
@Controller('contract/payment')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PaymentController {
  constructor(private paymentService: PaymentMethodService) {}
  @Roles(LIMIT_ADMIN)
  @Post('add')
  async addPaymentByContractId(@Body() paymentDto: CreatePaymentDto) {
    const payment = this.paymentService.create(paymentDto);
    return await this.paymentService.addPaymentMethod(payment);
  }
  @Get('list')
  async getPaymentByContractId(@Query('contractId', ParseIntPipe) id: number) {
    return await this.paymentService.getPaymentMethodByContractId(id);
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updatePaymentByContractId(@Body() paymentDto: UpdatePaymentDto) {
    const payment = this.paymentService.create(paymentDto);
    const { id } = payment;
    return await this.paymentService.updatePaymentMethod(id, payment);
  }
  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deletePaymentByContractId(@Body('id', ParseIntPipe) id: number) {
    return await this.paymentService.deletePaymentMethod(id);
  }
}

@Roles(...ANY_ROLE)
@Controller('contract/invoiceHeader')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class InvoiceHeaderController {
  constructor(private invoiceHeaderService: InvoiceHeaderService) {}

  @Roles(LIMIT_ADMIN)
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
  async getCostFormByContractId(@Query('contractId', ParseIntPipe) id: number) {
    return await this.invoiceHeaderService.getByContractId(id);
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateInvoiceHeader(@Body() invoiceHeaderDto: UpdateInvoiceHeaderDto) {
    const invoiceHeader = this.invoiceHeaderService.create(invoiceHeaderDto);
    const { id } = invoiceHeader;
    return await this.invoiceHeaderService.update(id, invoiceHeader);
  }
  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteInvoiceHeader(@Body('id', ParseIntPipe) id: number) {
    return await this.invoiceHeaderService.delete(id);
  }
}

@Roles(...ANY_ROLE)
@Controller('contract/invoiceRecord')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class InvoiceRecordController {
  constructor(private invoiceRecordService: InvoiceRecordService) {}

  @Roles(LIMIT_ADMIN)
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
  async getInvoiceRecordByContractId(
    @Query('contractId', ParseIntPipe) id: number,
  ) {
    return await this.invoiceRecordService.getByContractId(id);
  }

  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateInvoiceRecord(@Body() invoiceRecordDto: UpdateInvoiceRecordDto) {
    const invoiceRecord = this.invoiceRecordService.create(invoiceRecordDto);
    const { id } = invoiceRecordDto;
    return await this.invoiceRecordService.update(id, invoiceRecord);
  }

  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteInvoiceRecord(@Body('id', ParseIntPipe) id: number) {
    return await this.invoiceRecordService.delete(id);
  }
}

@Roles(...ANY_ROLE)
@Controller('contract/receiptRecord')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ReceiptRecordController {
  constructor(private receiptRecordService: ReceiptRecordService) {}

  @Roles(LIMIT_ADMIN)
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
  async getReceiptRecordByContractId(
    @Query('contractId', ParseIntPipe) id: number,
  ) {
    return await this.receiptRecordService.getByContractId(id);
  }

  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateReceiptRecord(@Body() receiptRecordDto: UpdateReceiptRecordDto) {
    const receiptRecord = this.receiptRecordService.create(receiptRecordDto);
    const { id } = receiptRecordDto;
    return await this.receiptRecordService.update(id, receiptRecord);
  }

  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteReceiptRecord(@Body('id', ParseIntPipe) id: number) {
    return await this.receiptRecordService.delete(id);
  }
}
