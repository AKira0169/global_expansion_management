import { faker } from '@faker-js/faker';
import { Project } from '../modules/projects/entities/project.entity';
import { User } from '../modules/users/entities/user.entity';
import { Vendor } from '../modules/vendors/entities/vendor.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(10);
    const VendorFactory = factoryManager.get(Vendor);
    await VendorFactory.saveMany(50);

    const projectFactory = factoryManager.get(Project);
    const projects = await Promise.all(
      Array(50)
        .fill('')
        .map(async () => {
          const project = await projectFactory.make({
            user: faker.helpers.arrayElement(users),
          });
          return project;
        }),
    );
    const ProjectRepo = dataSource.getRepository(Project);
    await ProjectRepo.save(projects);
  }
}
