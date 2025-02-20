import { Module } from '@nestjs/common';
import { ProspectService } from './prospect.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectProject } from './prospect.entity';
import { ProspectController } from './prospect.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProspectProject])],
  providers: [ProspectService],
  controllers: [ProspectController],
})
export class ProspectModule {}
