import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const OrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '124.220.164.61',
  port: 3037,
  username: 'root',
  password: '25362565k',
  database: 'cms',
  autoLoadEntities: true,
  synchronize: true,
};

export { OrmConfig };
