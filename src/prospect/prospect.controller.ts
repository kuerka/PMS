import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { ProspectProject } from './prospect.entity';
import { Public } from '@/auth/auth.decorators';
import { ProspectQueryDto } from './prospect.dto';

// TODO 后续添加权限
@Public()
@Controller('prospect')
export class ProspectController {
  constructor(private prospectService: ProspectService) {}

  @Post('add')
  async createProspect(@Body() prospect: ProspectProject) {
    return await this.prospectService.create(prospect);
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

  @Post('update')
  async updateProspect(@Body() prospect: ProspectProject) {
    if (!prospect.id) return null;
    return await this.prospectService.update(prospect.id, prospect);
  }

  @Post('delete')
  async deleteProspect(@Body('id') id: number) {
    return await this.prospectService.delete(id);
  }
}
