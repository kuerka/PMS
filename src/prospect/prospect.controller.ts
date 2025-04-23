import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  StreamableFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ProspectService } from './prospect.service';
import { Roles } from '@/auth/auth.decorators';
import {
  createProspectDto,
  ProspectQueryDto,
  UpdateProspectDto,
} from './prospect.dto';
import { ANY_ROLE, LIMIT_ADMIN } from '@/auth/constants';
import { FailedCause } from '@/response-formatter/response-formatter.interceptor';

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

  @Roles(LIMIT_ADMIN)
  @Post('excel')
  async exportProspectExcel(@Body() prospectQueryDto: ProspectQueryDto) {
    const buffer = await this.prospectService.getFilterExcel(prospectQueryDto);
    const filename = encodeURIComponent('意向合同') + '.xlsx';
    if (!buffer) return new FailedCause('导出失败');

    return new StreamableFile(Buffer.from(buffer), {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${filename}"`,
    });
  }
  @Roles(LIMIT_ADMIN)
  @Post('update')
  async updateProspect(
    @Body() prospectDto: UpdateProspectDto,
    @Req() req: Request,
  ) {
    const { projectDockingStage: stage, id } = prospectDto;
    const oldRecord = await this.prospectService.findById(id);
    const toSign =
      stage === '已签合同' && oldRecord?.projectDockingStage !== '已签合同';
    if (toSign && !prospectDto.contract)
      return new FailedCause('修改中标时，合同信息不能为空');
    const prospect = this.prospectService.create(prospectDto);
    await this.prospectService.logHandleProspect(req, id, '更新');
    return await this.prospectService.updateTransaction(id, prospect, toSign);
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
