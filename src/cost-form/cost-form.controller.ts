import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CreateCollaborationCompanyDto,
  UpdateCollaborationCompanyDto,
} from './dto/collaboration-company.dto';
import { Public } from '@/auth/auth.decorators';
import { CollaborationCompanyService } from './services/collaboration-company.service';
import { CollaborationDepartmentService } from './services/collaboration-department.service';
import {
  CreateCollaborationDepartmentDto,
  UpdateCollaborationDepartmentDto,
} from './dto/collaboration-department.dto';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from './dto/collaboration-company-invoice.dto';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from './dto/collaboration-company-payment.dto';

@Controller('costForm')
export class CostFormController {
  constructor(private companyService: CollaborationCompanyService) {}
}

@Public()
@Controller('costForm/company')
export class CompanyController {
  constructor(private companyService: CollaborationCompanyService) {}
  @Get('list')
  async getCompanyByCostFormId(@Query('id') id: number) {
    return await this.companyService.getCompanyByCostFormId(id);
  }

  @Get('detail')
  async getCompanyDetail(@Query('id') id: number) {
    return await this.companyService.getCompanyDetail(id);
  }
  @Post('add')
  async addCompany(@Body() companyDto: CreateCollaborationCompanyDto) {
    const company = this.companyService.createCompany(companyDto);
    return await this.companyService.addCompanyByCostFormId(
      companyDto.productionCostFormId,
      company,
    );
  }
  @Post('update')
  async updateCompany(@Body() companyDto: UpdateCollaborationCompanyDto) {
    const company = this.companyService.createCompany(companyDto);
    return await this.companyService.updateCompany(company);
  }
  @Post('delete')
  async deleteCompany(@Body('id') id: number) {
    return await this.companyService.deleteCompany(id);
  }
}

@Public()
@Controller('costForm/company/invoice')
export class CompanyInvoiceController {
  constructor(private companyService: CollaborationCompanyService) {}
  @Post('add')
  async addCompanyInvoice(@Body() invoiceDto: CreateInvoiceDto) {
    const invoice = this.companyService.createInvoice(invoiceDto);
    return await this.companyService.addCompanyInvoiceByCompanyId(
      invoiceDto.companyId,
      invoice,
    );
  }
  @Post('update')
  async updateCompanyInvoice(@Body() invoiceDto: UpdateInvoiceDto) {
    const invoice = this.companyService.createInvoice(invoiceDto);
    return await this.companyService.updateCompanyInvoice(invoice);
  }
  @Post('delete')
  async deleteCompanyInvoice(@Body('id') id: number) {
    return await this.companyService.deleteCompanyInvoice(id);
  }
}

@Public()
@Controller('costForm/company/payment')
export class CompanyPaymentController {
  constructor(private companyService: CollaborationCompanyService) {}
  @Post('add')
  async addCompanyPayment(@Body() paymentDto: CreatePaymentDto) {
    const payment = this.companyService.createPayment(paymentDto);
    return await this.companyService.addCompanyPaymentByCompanyId(
      paymentDto.companyId,
      payment,
    );
  }
  @Post('update')
  async updateCompanyPayment(@Body() paymentDto: UpdatePaymentDto) {
    const payment = this.companyService.createPayment(paymentDto);
    return await this.companyService.updateCompanyPayment(payment);
  }
  @Post('delete')
  async deleteCompanyPayment(@Body('id') id: number) {
    return await this.companyService.deleteCompanyPayment(id);
  }
}

@Public()
@Controller('costForm/department')
export class DepartmentController {
  constructor(private departmentService: CollaborationDepartmentService) {}
  @Get('list')
  async getDepartmentByCostFormId(@Query('id') id: number) {
    return await this.departmentService.getDepartmentByCostFormId(id);
  }
  @Post('add')
  async addDepartment(@Body() departmentDto: CreateCollaborationDepartmentDto) {
    const department = this.departmentService.create(departmentDto);

    return await this.departmentService.addDepartmentByCostFormId(
      departmentDto.productionCostFormId,
      department,
    );
  }
  @Post('update')
  async updateDepartment(
    @Body() departmentDto: UpdateCollaborationDepartmentDto,
  ) {
    const department = this.departmentService.create(departmentDto);
    return await this.departmentService.updateDepartment(department);
  }
  @Post('delete')
  async deleteDepartment(@Body('id') id: number) {
    return await this.departmentService.deleteDepartment(id);
  }
}
