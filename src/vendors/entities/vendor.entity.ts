import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @Column({ type: 'simple-array' })
  countries_supported: string[];

  @Column({ type: 'simple-array' })
  services_offered: string[];

  @Column({ type: 'double' })
  rating: Number;

  @Column({ type: 'double' })
  response_sla_hours: Number;
}
