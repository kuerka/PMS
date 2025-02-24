import { Module } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { ProspectController } from './prospect.controller';
import { CostFormModule } from '@/cost-form/cost-form.module';

@Module({
  imports: [CostFormModule],
  providers: [ProspectService],
  controllers: [ProspectController],
})
export class ProspectModule {}
