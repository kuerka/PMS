import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
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

  @Post('excel')
  async exportProspectExcel(
    @Body() prospectQueryDto: ProspectQueryDto,
    @Res() res: Response,
  ) {
    const buffer = await this.prospectService.getFilterExcel(prospectQueryDto);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="prospects.xlsx"',
      'Content-Length': buffer.byteLength,
    });
    res.end(buffer);
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
