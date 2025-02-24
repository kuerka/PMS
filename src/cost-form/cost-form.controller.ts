import { Body, Controller, Post } from '@nestjs/common';
import { CostFormService } from './cost-form.service';
import { CompanyDto } from './dto/collaboration-company.dto';
import { Public } from '@/auth/auth.decorators';

@Controller('costForm')
export class CostFormController {}

@Public()
@Controller('costForm/company')
export class CompanyController {
  constructor(private costFormService: CostFormService) {}
  @Post('add')
  async addCompany(@Body() companyDto: CompanyDto) {
    companyDto.createdAt = new Date();
    companyDto.updatedAt = new Date();
    return await this.costFormService.appendCollaborationCompany(companyDto);
  }
}
