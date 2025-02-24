import { Module } from '@nestjs/common';
import { CostFormService } from './cost-form.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionCostForm } from './entities/cost-form.entity';
import { CompanyController, CostFormController } from './cost-form.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionCostForm])],
  providers: [CostFormService],
  exports: [TypeOrmModule, CostFormService],
  controllers: [CostFormController, CompanyController],
})
export class CostFormModule {}
