import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as config from 'config';

type DatabaseConfig = {
  type: 'mysql' | 'postgres' | 'sqlite' | 'mssql' | 'oracle' | 'mongodb';
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  query: boolean;
};
const databaseConfig = config.get<DatabaseConfig>('database');

const OrmConfig: TypeOrmModuleOptions = {
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  dateStrings: true,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: databaseConfig.query ? ['query'] : false,
};

export { OrmConfig };
