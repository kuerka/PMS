import { Body, Controller, Post } from '@nestjs/common';
import {
  CompanyDto,
  CompanyInvoiceDto,
  CompanyPaymentDto,
  CompanyUpdateDto,
} from './dto/collaboration-company.dto';
import { Public } from '@/auth/auth.decorators';
import { CollaborationCompanyService } from './services/collaboration-company.service';
import { CollaborationDepartmentService } from './services/collaboration-department.service';
import { CollaborationDepartment } from './entities/collaboration-department.entity';

@Controller('costForm')
export class CostFormController {
  constructor(private companyService: CollaborationCompanyService) {}
}

@Public()
@Controller('costForm/company')
export class CompanyController {
  constructor(private companyService: CollaborationCompanyService) {}
  @Post('list')
  async getCompanyByCostFormId(@Body('id') id: number) {
    return await this.companyService.getCompanyByCostFormId(id);
  }

  @Post('detail')
  async getCompanyDetail(@Body('id') id: number) {
    return await this.companyService.getCompanyDetail(id);
  }
  @Post('add')
  async addCompany(@Body() companyDto: CompanyDto) {
    companyDto.createdAt = new Date();
    companyDto.updatedAt = new Date();
    return await this.companyService.addCompanyByCostFormId(
      companyDto.productionCostFormId!,
      companyDto,
    );
  }
  @Post('update')
  async updateCompany(@Body() companyDto: CompanyUpdateDto) {
    companyDto.updatedAt = new Date();
    return await this.companyService.updateCompany(companyDto);
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
  async addCompanyInvoice(@Body() invoice: CompanyInvoiceDto) {
    return await this.companyService.addCompanyInvoiceByCompanyId(
      invoice.companyId!,
      invoice,
    );
  }
  @Post('update')
  async updateCompanyInvoice(@Body() invoice: CompanyInvoiceDto) {
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
  async addCompanyPayment(@Body() payment: CompanyPaymentDto) {
    return await this.companyService.addCompanyPaymentByCompanyId(
      payment.companyId!,
      payment,
    );
  }
  @Post('update')
  async updateCompanyPayment(@Body() payment: CompanyPaymentDto) {
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
  @Post('list')
  async getDepartmentByCostFormId(@Body('id') id: number) {
    return await this.departmentService.getDepartmentByCostFormId(id);
  }
  @Post('add')
  async addDepartment(@Body() department: CollaborationDepartment) {
    return await this.departmentService.addDepartmentByCostFormId(
      department.productionCostFormId!,
      department,
    );
  }
  @Post('update')
  async updateDepartment(@Body() department: CollaborationDepartment) {
    return await this.departmentService.updateDepartment(department);
  }
  @Post('delete')
  async deleteDepartment(@Body('id') id: number) {
    return await this.departmentService.deleteDepartment(id);
  }
}
