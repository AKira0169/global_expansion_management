// data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Project } from '../modules/projects/entities/project.entity';
import { Vendor } from '../modules/vendors/entities/vendor.entity';
import { Match } from '../modules/matches/entities/match.entity';
import { MainSeeder } from './main.seeder';
import { UserFactory } from './user.factory';
import { ProjectFactory } from './project.factory';
import { VendorFactory } from './vendor.factory';

dotenv.config(); // <-- load .env manually here

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [User, Project, Vendor, Match],
  seeds: [MainSeeder],
  factories: [UserFactory, ProjectFactory, VendorFactory],
};

export const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
