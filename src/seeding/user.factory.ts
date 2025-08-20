import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/users/enums/roles.enum';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt'; // <-- if you want hashed passwords

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = faker.internet.email({ firstName, lastName });
  user.role = faker.helpers.arrayElement([Role.CLIENT, Role.ADMIN]);
  user.companyName = faker.company.name();
  user.contactEmail = faker.internet.email({ firstName, lastName });

  // Set a password (plain text or hashed)
  const plainPassword = 'admin123';
  user.password = bcrypt.hashSync(plainPassword, 10); // hashed version
  // OR for quick testing: user.password = plainPassword;

  return user;
});
