import { Controller, Get, Post } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { ProspectProject } from './prospect.entity';
import { Public } from '@/auth/auth.decorators';

// TODO 后续添加权限
@Public()
@Controller('prospect')
export class ProspectController {
  constructor(private prospectService: ProspectService) {}

  @Post('add')
  async createProspect() {
    const prospect = new ProspectProject();
    prospect.projectName = '测试项目';
    prospect.businessPersonnel = '测试人员';
    prospect.isPriorWorkStarted = Math.random() > 0.5;
    return await this.prospectService.create(prospect);
  }
  @Get('list')
  async getProspectList() {
    return await this.prospectService.findAllWithCostForm();
  }
}
