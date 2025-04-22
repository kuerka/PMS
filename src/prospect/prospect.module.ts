import { Module } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { ProspectController } from './prospect.controller';
import { CostFormModule } from '@/cost-form/cost-form.module';
import { FileModule } from '@/file/file.module';

@Module({
  imports: [CostFormModule, FileModule],
  providers: [ProspectService],
  controllers: [ProspectController],
  exports: [ProspectService],
})
export class ProspectModule {}
