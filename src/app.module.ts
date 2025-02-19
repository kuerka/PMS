import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmConfig } from './database/database.config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { ProspectModule } from './prospect/prospect.module';
import { ContractModule } from './contract/contract.module';
import { CostFormModule } from './cost-form/cost-form.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(OrmConfig),
    UserModule,
    AuthModule,
    FileModule,
    ProspectModule,
    ContractModule,
    CostFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
