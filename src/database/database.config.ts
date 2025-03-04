import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

const OrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '124.220.164.61',
  port: 3037,
  username: 'root',
  password: '25362565k',
  database: 'pms',
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: ['query'],
};

export { OrmConfig };
