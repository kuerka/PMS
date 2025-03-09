import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { Public } from '@/auth/auth.decorators';
import {
  createProspectDto,
  ProspectQueryDto,
  UpdateProspectDto,
} from './prospect.dto';

// TODO 后续添加权限
@Public()
@Controller('prospect')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ProspectController {
  constructor(private prospectService: ProspectService) {}

  @Post('add')
  async createProspect(@Body() prospectDto: createProspectDto) {
    const prospect = this.prospectService.create(prospectDto);
    return await this.prospectService.addTransaction(prospect);
  }
  @Get('detail')
  async getProspectDetail(@Query('id') id: number) {
    if (!id) return null;
    return await this.prospectService.findOneWithCostForm(id);
  }
  @Get('list')
  async getProspectList() {
    return await this.prospectService.findAllWithCostForm();
  }
  @Post('page')
  async getProspectPage(@Body() prospectQueryDto: ProspectQueryDto) {
    return await this.prospectService.getProspectPage(prospectQueryDto);
  }
  @Post('totalEstimated')
  async getTotalEstimated(@Body() prospectQueryDto: ProspectQueryDto) {
    return await this.prospectService.getTotalAccumulated(prospectQueryDto);
  }

  @Post('update')
  async updateProspect(@Body() prospectDto: UpdateProspectDto) {
    const prospect = this.prospectService.create(prospectDto);
    return await this.prospectService.updateTransaction(prospect.id, prospect);
  }

  @Post('delete')
  async deleteProspect(@Body('id') id: number) {
    return await this.prospectService.delete(id);
  }
}
