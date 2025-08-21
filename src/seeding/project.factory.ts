import { faker } from '@faker-js/faker';
import { Project } from '../modules/projects/entities/project.entity';
import { ProjectStatus } from '../modules/projects/enums/ProjectStatus';
import { setSeederFactory } from 'typeorm-extension';

export const ProjectFactory = setSeederFactory(Project, () => {
  const project = new Project();
  project.name = faker.person.firstName();
  project.budget = Number(faker.commerce.price({ min: 10000, max: 100000, dec: 0 }));
  project.country = faker.helpers.arrayElement(['egypt', 'america', 'france']);
  project.services_needed = faker.helpers.arrayElements(
    ['service1', 'service2', 'service3', 'service4', 'service5'],
    2,
  );

  project.status = faker.helpers.arrayElement([ProjectStatus.ACTIVE]);
  return project;
});
