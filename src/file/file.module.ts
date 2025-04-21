import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileController } from './file.controller';
import { ProspectModule } from '@/prospect/prospect.module';
import { ContractModule } from '@/contract/contract.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ProspectModule, ContractModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
