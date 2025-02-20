import { Module } from '@nestjs/common';
import { CostFormService } from './cost-form.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionCostForm } from './entities/cost-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionCostForm])],
  providers: [CostFormService],
  exports: [TypeOrmModule, CostFormService],
})
export class CostFormModule {}
