import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCollaborationCompanyDto,
  UpdateCollaborationCompanyDto,
} from './dto/collaboration-company.dto';
import { Roles } from '@/auth/auth.decorators';
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
import { CostFormService } from './cost-form.service';
import { CollaborationCompanyInvoiceService } from './services/collaboration-company-invoice.service';
import { CollaborationCompanyPaymentService } from './services/collaboration-company-payment.service';
import { updateCostProgressDto } from './dto/cost-form.dto';
import { ANY_ROLE, LIMIT_ADMIN, LIMIT_EDIT } from '@/auth/constants';

@Roles(...ANY_ROLE)
@Controller('costForm')
export class CostFormController {
  constructor(private costFormService: CostFormService) {}

  @Get('detail')
  async getCostFormDetail(@Query('id', ParseIntPipe) id: number) {
    return await this.costFormService.getCostFormDetail(id);
  }

  @Roles(LIMIT_ADMIN, LIMIT_EDIT)
  @Post('update/progress')
  async updateProgress(@Body() updateDto: updateCostProgressDto) {
    const { id, projectCompletionProgress, projectCompletionDescription } =
      updateDto;
    return await this.costFormService.updateCostProgress(
      id,
      projectCompletionProgress,
      projectCompletionDescription,
    );
  }
}

@Roles(...ANY_ROLE)
@Controller('costForm/company')
export class CompanyController {
  constructor(private companyService: CollaborationCompanyService) {}
  @Get('list')
  async getCompanyByCostFormId(@Query('costId', ParseIntPipe) id: number) {
    return await this.companyService.getCompanyByCostFormId(id);
  }

  @Get('detail')
  async getCompanyDetail(@Query('id', ParseIntPipe) id: number) {
    return await this.companyService.getCompanyDetail(id);
  }

  @Roles(LIMIT_ADMIN)
  @Post('add')
  async addCompany(@Body() companyDto: CreateCollaborationCompanyDto) {
    const company = this.companyService.createCompany(companyDto);
    return await this.companyService.addCompanyByCostFormId(
      companyDto.productionCostFormId,
      company,
    );
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateCompany(@Body() companyDto: UpdateCollaborationCompanyDto) {
    const company = this.companyService.createCompany(companyDto);
    return await this.companyService.updateCompany(company);
  }
  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteCompany(@Body('id', ParseIntPipe) id: number) {
    return await this.companyService.deleteCompany(id);
  }
}

@Roles(...ANY_ROLE)
@Controller('costForm/company/invoice')
export class CompanyInvoiceController {
  constructor(private invoiceService: CollaborationCompanyInvoiceService) {}

  @Roles(LIMIT_ADMIN)
  @Post('add')
  async addCompanyInvoice(@Body() invoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceService.createInvoice(invoiceDto);
    return await this.invoiceService.addCompanyInvoiceByCompanyId(
      invoiceDto.companyId,
      invoice,
    );
  }
  @Get('list')
  async getCompanyInvoiceByCompanyId(
    @Query('companyId', ParseIntPipe) id: number,
  ) {
    return await this.invoiceService.getCompanyInvoiceByCompanyId(id);
  }

  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateCompanyInvoice(@Body() invoiceDto: UpdateInvoiceDto) {
    const invoice = this.invoiceService.createInvoice(invoiceDto);
    return await this.invoiceService.updateCompanyInvoice(invoice);
  }

  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteCompanyInvoice(@Body('id', ParseIntPipe) id: number) {
    return await this.invoiceService.deleteCompanyInvoice(id);
  }
}

@Roles(...ANY_ROLE)
@Controller('costForm/company/payment')
export class CompanyPaymentController {
  constructor(private paymentService: CollaborationCompanyPaymentService) {}

  @Get('list')
  async getCompanyPaymentByCompanyId(
    @Query('companyId', ParseIntPipe) id: number,
  ) {
    return await this.paymentService.getCompanyPaymentByCompanyId(id);
  }

  @Roles(LIMIT_ADMIN)
  @Post('add')
  async addCompanyPayment(@Body() paymentDto: CreatePaymentDto) {
    const payment = this.paymentService.createPayment(paymentDto);
    return await this.paymentService.addCompanyPaymentByCompanyId(
      paymentDto.companyId,
      payment,
    );
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateCompanyPayment(@Body() paymentDto: UpdatePaymentDto) {
    const payment = this.paymentService.createPayment(paymentDto);
    return await this.paymentService.updateCompanyPayment(payment);
  }
  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteCompanyPayment(@Body('id', ParseIntPipe) id: number) {
    return await this.paymentService.deleteCompanyPayment(id);
  }
}

@Roles(...ANY_ROLE)
@Controller('costForm/department')
export class DepartmentController {
  constructor(private departmentService: CollaborationDepartmentService) {}
  @Get('list')
  async getDepartmentByCostFormId(@Query('costId', ParseIntPipe) id: number) {
    return await this.departmentService.getDepartmentByCostFormId(id);
  }
  @Roles(LIMIT_ADMIN)
  @Post('add')
  async addDepartment(@Body() departmentDto: CreateCollaborationDepartmentDto) {
    const department = this.departmentService.create(departmentDto);

    return await this.departmentService.addDepartmentByCostFormId(
      departmentDto.productionCostFormId,
      department,
    );
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateDepartment(
    @Body() departmentDto: UpdateCollaborationDepartmentDto,
  ) {
    const department = this.departmentService.create(departmentDto);
    return await this.departmentService.updateDepartment(department);
  }
  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteDepartment(@Body('id', ParseIntPipe) id: number) {
    return await this.departmentService.deleteDepartment(id);
  }
}
