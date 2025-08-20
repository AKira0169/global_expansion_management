import { faker } from '@faker-js/faker';
import { Vendor } from '../modules/vendors/entities/vendor.entity';
import { setSeederFactory } from 'typeorm-extension';

export const VendorFactory = setSeederFactory(Vendor, () => {
  const vendor = new Vendor();
  vendor.name = faker.person.firstName();
  vendor.countries_supported = faker.helpers.arrayElements(['egypt', 'america', 'france']);
  vendor.services_offered = faker.helpers.arrayElements(
    ['service1', 'service2', 'service3', 'service4', 'service5'],
    2,
  );

  vendor.rating = Number(faker.number.float({ min: 1, max: 5 }));
  vendor.response_sla_hours = Number(faker.number.int({ min: 1, max: 24 }));
  return vendor;
});
