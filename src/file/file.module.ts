import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileController } from './file.controller';
import { ProspectModule } from '@/prospect/prospect.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ProspectModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
