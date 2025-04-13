import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

const OrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '1.116.121.38',
  port: 3039,
  username: 'root',
  password: '25362565k',
  database: 'pms',
  dateStrings: true,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: ['query'],
};

export { OrmConfig };
