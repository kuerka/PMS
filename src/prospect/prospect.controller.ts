import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProspectService } from './prospect.service';
import { Roles } from '@/auth/auth.decorators';
import {
  createProspectDto,
  ProspectQueryDto,
  UpdateProspectDto,
} from './prospect.dto';
import { ANY_ROLE, LIMIT_ADMIN } from '@/auth/constants';

@Roles(...ANY_ROLE)
@Controller('prospect')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ProspectController {
  constructor(private prospectService: ProspectService) {}

  @Roles(LIMIT_ADMIN)
  @Post('add')
  async createProspect(@Body() prospectDto: createProspectDto) {
    const prospect = this.prospectService.create(prospectDto);
    return await this.prospectService.addTransaction(prospect);
  }
  @Roles(LIMIT_ADMIN)
  @Get('detail')
  async getProspectDetail(@Query('id', ParseIntPipe) id: number) {
    return await this.prospectService.findOneWithCostForm(id);
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
    const filename = encodeURIComponent('意向合同') + '.xlsx';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.byteLength,
    });
    res.end(buffer);
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateProspect(
    @Body() prospectDto: UpdateProspectDto,
    @Req() req: Request,
  ) {
    const prospect = this.prospectService.create(prospectDto);
    await this.prospectService.logHandleProspect(req, prospect.id, '更新');
    return await this.prospectService.updateTransaction(prospect.id, prospect);
  }

  @Roles(LIMIT_ADMIN)
  @Post('delete')
  async deleteProspect(
    @Body('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.prospectService.logHandleProspect(req, id, '删除');
    return await this.prospectService.delete(id);
  }
}
